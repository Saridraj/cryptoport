import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn('uuid')
  id: string;
 
  @Column("json")
  cryptocurrencies: object;

  @Column()
  userId: string; 

  @Column()
  createdAt: string; 
}
 