import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Point } from "./Point";

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  symbol: string;

  @OneToMany(() => Point, (point) => point.asset)
  points: Point[];
}
