import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('banana')
export class BananaEntity {
  @PrimaryGeneratedColumn()
  id: number;
   
  // typeorm đánh index tự động vào các cột trong DB
  // tụi em có thể tìm banana theo name nhanh hơn
  @Index()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

