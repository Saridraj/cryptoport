import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('simple-json')
  cryptocurrencies: { [key: string]: number };

  @ManyToOne(type => User, user => user.portfolios, { eager: false })
  user: User; 
}
 