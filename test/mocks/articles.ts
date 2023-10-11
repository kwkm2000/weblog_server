import { Article } from "../../src/articles/interface";
import { ArticleEntity } from "../../src/articles/article.entity";

export const articles: Article[] = [
  {
    id: 1,
    title: "ブログを作り直した",
    headerImage: "",
    text: [
      {
        type: "paragraph",
        children: [
          {
            text: "Slatejsでエディターを作り直して、ブログを実装し直した",
          },
        ],
      },
    ],
    createdAt: new Date("2023-08-06T07:29:52.580Z"),
    updatedAt: new Date("2023-08-06T07:29:52.580Z"),
    tags: [],
    draft: false,
  },
  {
    id: 2,
    title: "headerあり",
    headerImage:
      "https://weblog-images-dev.s3.amazonaws.com/31b7aad8-0e75-4920-8c6c-41dd4fc7473a_E01LANL044T-U04LFQX8ELQ-d79c052a3dff-512.png",
    text: [
      {
        type: "paragraph",
        children: [
          {
            text: "A line of text in a paragraph.",
          },
        ],
      },
      {
        type: "image",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/A_cat_on_a_motorcycle_in_the_medina_of_Tunis_20171017_131525.jpg/1200px-A_cat_on_a_motorcycle_in_the_medina_of_Tunis_20171017_131525.jpg",
        children: [
          {
            text: "",
          },
        ],
      },
    ],
    createdAt: new Date("2023-07-13T10:54:38.728Z"),
    updatedAt: new Date("2023-07-13T10:54:38.728Z"),
    tags: [],
    draft: false,
  },
];

export const articleEntities: ArticleEntity[] = [
  {
    id: 1,
    title: "ブログを作り直した",
    headerImage: "",
    text: JSON.stringify([
      {
        type: "paragraph",
        children: [
          {
            text: "Slatejsでエディターを作り直して、ブログを実装し直した",
          },
        ],
      },
    ]),
    createdAt: new Date("2023-08-06T07:29:52.580Z"),
    updatedAt: new Date("2023-08-06T07:29:52.580Z"),
    tags: [],
    draft: false,
  },
  {
    id: 2,
    title: "headerあり",
    headerImage:
      "https://weblog-images-dev.s3.amazonaws.com/31b7aad8-0e75-4920-8c6c-41dd4fc7473a_E01LANL044T-U04LFQX8ELQ-d79c052a3dff-512.png",
    text: JSON.stringify([
      {
        type: "paragraph",
        children: [
          {
            text: "A line of text in a paragraph.",
          },
        ],
      },
      {
        type: "image",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/A_cat_on_a_motorcycle_in_the_medina_of_Tunis_20171017_131525.jpg/1200px-A_cat_on_a_motorcycle_in_the_medina_of_Tunis_20171017_131525.jpg",
        children: [
          {
            text: "",
          },
        ],
      },
    ]),
    createdAt: new Date("2023-07-13T10:54:38.728Z"),
    updatedAt: new Date("2023-07-13T10:54:38.728Z"),
    tags: [],
    draft: false,
  },
];
