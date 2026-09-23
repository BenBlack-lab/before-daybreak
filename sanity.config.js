"use client";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schema.mjs";
import ReviewTool from "./sanity/ReviewTool";
export default defineConfig({
  name: "before-daybreak",
  title: "Before Daybreak",
  projectId: "o1wtlllc",
  dataset: "production",
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Story content")
          .items(
            S.documentTypeListItems().map((item) =>
              item.child(
                S.documentList()
                  .title(item.getTitle())
                  .schemaType(item.getId())
                  .filter('_type == $type && !(_id in path("bd.**"))')
                  .params({ type: item.getId() }),
              ),
            ),
          ),
    }),
  ],
  tools: [
    { name: "story-review", title: "Story review", component: ReviewTool },
  ],
  schema: { types: schemaTypes },
});
