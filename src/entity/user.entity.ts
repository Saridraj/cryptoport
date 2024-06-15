import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @Length(6, 10)
  password: string; 


  @Column()
  registeredAt: string; 

}
