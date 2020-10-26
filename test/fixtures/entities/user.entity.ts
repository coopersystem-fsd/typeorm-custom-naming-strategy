import {
  Check,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Photo } from './photo.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Check('CH_user_age', 'age > 18')
  @Column()
  age: number;

  @ManyToOne(() => Photo)
  photo: Photo;
}
