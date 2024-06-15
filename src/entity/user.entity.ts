import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Portfolio } from './portfolio.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column()
  password: string; 

  @OneToMany(type => Portfolio, portfolio => portfolio.user, { eager: true },)
  portfolios: Portfolio[];
}
