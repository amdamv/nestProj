import { IsNumber } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import * as bcrypt from "bcrypt";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn({ name: "user_id" })
  @IsNumber()
  id: number;

  @ApiProperty({ description: "Username" })
  @Column()
  fullName: string;

  @ApiProperty({ description: "Email address", example: "maff.akh@gmail.com" })
  @Column({ nullable: false, unique: true })
  email: string;

  @ApiProperty({
    description: "Password",
    minLength: 4,
    maxLength: 20,
    example: "password123",
  })
  @Column({ nullable: false })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @ApiProperty({ description: "Balance $" })
  @Column({ default: 0, scale: 2 })
  @IsNumber()
  balance: number;

  @ApiProperty({ description: "Description" })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: "Creation date" })
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: "Last update date" })
  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
