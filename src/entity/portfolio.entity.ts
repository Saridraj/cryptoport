import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn('uuid')
  id: string;
 
  @Column('simple-array')
  cryptocurrencies: string[];

  @Column()
  userId: string; 

  @Column()
  createdAt: string; 
}
 