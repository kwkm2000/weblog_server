import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ArticleEntity } from '../articles/article.entity';

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

    @ManyToOne(type => ArticleEntity, article => article.tags)
    article: ArticleEntity;
}
