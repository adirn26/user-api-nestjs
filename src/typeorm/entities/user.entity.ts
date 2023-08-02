import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true})
  email: string;

  @Column()
  hash: string;

  @Column({ default: "" })
  firstName: string;

  @Column({ default: "" })
  lastName: string;
}