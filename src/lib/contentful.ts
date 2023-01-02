import { createClient } from "contentful";

import { Entry } from "contentful";
import { Document } from "@contentful/rich-text-types";

export interface IPostFields {
  title: string;
  slug: string;
  content: Document;
}

export interface IPost extends Entry<IPostFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: "post";
        linkType: "ContentType";
        type: "Link";
      };
    };
  };
}

export const buildClient = () => {
  return createClient({
    space: process.env.CF_SPACE_ID!,
    accessToken: process.env.CF_ACCESS_TOKEN!,
  });
};
