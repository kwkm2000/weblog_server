import { Descendant } from "slate";

export default class CreateArticleDto {
  readonly title: string;
  readonly text: Descendant[];
  readonly tagIds: number[];
  readonly headerImage: string;
}
