import { Descendant } from "slate";

export default class UpdateArticleDto {
  readonly title: string;
  readonly text: Descendant[];
  readonly tagIds: number[];
}
