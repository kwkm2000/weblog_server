import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { TagEntity } from "../tags/tag.entity";

@Entity()
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  text: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @ManyToMany((type) => TagEntity, (tag) => tag.articles, { cascade: true })
  tags: TagEntity[];
}
