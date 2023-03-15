import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { ArticleEntity } from "../articles/article.entity";

@Entity()
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @ManyToMany((type) => ArticleEntity, (article) => article.tags)
  articles: ArticleEntity[];
}
