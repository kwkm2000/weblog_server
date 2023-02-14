import { Tag } from "../tags/interface";

interface Text {
  blocks: [
    {
      key: string;
      text: string;
      type: string;
      depth: number;
      inlineStyleRanges: [];
      entityRanges: [];
      data: {};
    }
  ];
  entityMap: {};
}
export interface Article {
  id: number;
  title: string;
  text: Text;
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
}
