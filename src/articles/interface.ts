import { Tag } from "../tags/interface";
import { Descendant } from "slate";
import { z } from "zod";

const TextSchema = z.record(z.any()).transform((v) => v as Descendant);
const TagsSchema = z.record(z.any()).transform((v) => v as Tag);

export const ArticleSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  text: z.array(TextSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
  tags: z.array(TagsSchema),
  headerImage: z.string(),
});

export const CreateValueSchema = ArticleSchema.pick({
  title: true,
  text: true,
  headerImage: true,
}).extend({
  tagIds: z.array(z.number()),
});

export const UpdateValueSchema = z.object({
  id: z.number(),
  value: CreateValueSchema,
});

export type Article = z.infer<typeof ArticleSchema>;
export type CreateValue = z.infer<typeof CreateValueSchema>;
export type UpdateValue = z.infer<typeof UpdateValueSchema>;
