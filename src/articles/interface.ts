import { Tag } from "../tags/interface";
import { RawDraftContentState } from "draft-js";

export interface Article {
  id: number;
  title: string;
  text: RawDraftContentState;
  createdAt: Date;
  updatedAt: Date;
  headerImage: string;
  tags: Tag[];
}
