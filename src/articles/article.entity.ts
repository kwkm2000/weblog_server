import { Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { TagEntity } from '../tags/tag.entity';

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

    @OneToMany(type => TagEntity, tag => tag.article, { eager: true })
    @JoinColumn()
    tags: TagEntity[];
}
