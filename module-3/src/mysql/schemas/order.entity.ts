import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity.js';

// Note: "order" is a reserved keyword in SQL, but TypeORM will quote it.
@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'int' })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    default: 0,
  })
  total: string;

  @Column({ type: 'varchar', length: 32, default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

