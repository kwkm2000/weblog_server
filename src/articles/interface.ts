import { Tag } from '../tags/interface';

export interface Article {
    id: number;
    title: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
    tags: Tag[];
}
