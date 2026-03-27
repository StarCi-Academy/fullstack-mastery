
import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from './order.entity.js';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    default: 0,
  })
  money: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];
}