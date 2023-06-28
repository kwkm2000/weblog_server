import {
  createEditor,
  Descendant,
  Transforms,
  Editor,
  Element as SlateElement,
} from "slate";

export default class CreateArticleDto {
  readonly title: string;
  readonly text: Descendant[];
  readonly tagIds: number[];
}
