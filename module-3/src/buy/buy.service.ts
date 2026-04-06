import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { BananaEntity } from 'src/mysql/schemas/banana.entity';
import { OrderEntity } from 'src/mysql/schemas/order.entity';
import { UserEntity } from 'src/mysql/schemas/user.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class BuyService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async createUser(): Promise<void> {
    const user = this.userRepository.create({
      firstName: 'John',
      lastName: 'Doe',
      money: '100',
      isActive: true,
    });
    await this.userRepository.save(user);
  }

  async createOrder(): Promise<void> {
    const order = this.orderRepository.create({
      userId: 1,
      total: '100',
      status: 'pending',
    });
    await this.orderRepository.save(order);
  }

  async buy(): Promise<void> {
    await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const order = await transactionalEntityManager.findOne(
          OrderEntity, {
          where: { id: 1 },
        });
        if (!order) {
          throw new Error('Order not found');
        }
        const user = await transactionalEntityManager.findOne(
          UserEntity, {
          where: { id: order.userId },
        });
        if (!user) {
          throw new Error('User not found');
        }
        // cập nhật trạng thái của order thành paid
        console.log("bắt đầu update trạng thái order thành công")
        await transactionalEntityManager.update(
          OrderEntity, order.id, {
          status: 'paid',
        });
        console.log("update trạng thái order thành công")
        if (Number(user.money) < Number(order.total)) {
          throw new BadRequestException('User does not have enough money');
        }
        // trừ tiền của user
        await transactionalEntityManager.update(
          UserEntity,
          order.userId, {
          money: (Number(user.money) - Number(order.total)).toString(),
        }
        );

      });
  }
}