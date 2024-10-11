import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { Asset } from "./Asset";

@Entity()
export class Point {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  timestamp: Date;

  @Column("float")
  value: number;

  @Column()
  assetId: number;

  @ManyToOne(() => Asset, asset => asset.points, { eager: true })
  @JoinColumn({ name: 'assetId', referencedColumnName: 'id' })
  asset: Asset;
}
