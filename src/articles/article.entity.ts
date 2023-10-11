import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { TagEntity } from "../tags/tag.entity";

@Entity()
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  headerImage: string;

  @Column()
  text: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column({ default: false })
  draft: boolean;

  @ManyToMany((type) => TagEntity, (tag) => tag.articles, { cascade: true })
  @JoinTable()
  tags: TagEntity[];
}
