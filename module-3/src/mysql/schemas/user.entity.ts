
import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from './order.entity.js';
import { UserRole } from './user-role.enum.js';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  /** Google OAuth `sub` — liên kết tài khoản Google */
  @Column({ nullable: true, unique: true, type: 'varchar', length: 255 })
  googleId: string | null;

  @Column()
  password: string;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    default: 0,
  })
  money: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 20, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];
}