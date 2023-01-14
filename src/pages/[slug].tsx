import type {
  NextPage,
  InferGetStaticPropsType,
  GetStaticPaths,
  GetStaticProps,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import { buildClient, IPostFields } from "../lib/contentful";
import { Entry, EntryCollection } from "contentful";
import {
  documentToReactComponents,
  Options,
} from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS } from "@contentful/rich-text-types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { ReactNode } from "react";
import { ParsedUrlQuery } from "querystring";

export const getStaticPaths: GetStaticPaths = async () => {
  const client = buildClient();
  const { items }: EntryCollection<IPostFields> = await client.getEntries({
    content_type: "post",
  });
  return {
    paths: items.map((item) => ({
      params: { slug: item.fields.slug },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  const client = buildClient();
  const { items }: EntryCollection<IPostFields> = await client.getEntries({
    content_type: "post",
    "fields.slug": params?.slug,
  });
  return {
    props: {
      post: items[0],
    },
  };
};

interface Params extends ParsedUrlQuery {
  slug: string;
}

type Props = {
  post: Entry<IPostFields>;
};

const Post: NextPage<Props> = ({ post }) => {
  const { isFallback } = useRouter();
  if (!isFallback && !post.fields.slug) {
    return <ErrorPage statusCode={404} />;
  }
  const Code = ({ children }: { children: ReactNode }) => (
    <div>
      <pre className="my-0 py-0 lg:my-0 lg:py-0">
        <code>{children}</code>
      </pre>
    </div>
  );
  const options: Options = {
    renderNode: {
      // コードブロックをdivで括る
      [BLOCKS.PARAGRAPH]: (node, children) => {
        const n = node.content[0];
        if (
          node.content.length === 1 &&
          n.nodeType === "text" &&
          n.marks.find((x) => x.type === "code")
        ) {
          return <Code>{children}</Code>;
        }
        return <p>{children}</p>;
      },
    },
    renderMark: {
      [MARKS.CODE]: (node: ReactNode) => {
        // NOTE: using code block (first line is config => {language}:{startingLineNumber}).
        //       showLineNumbers is false if startingLineNumber is 0
        const texts = (node as string).split("\n");
        const langConfig = texts[0].split(":");
        const startingLineNumber = parseInt(
          langConfig.length > 1 ? langConfig[1] : "1"
        );
        return (
          <SyntaxHighlighter
            language={langConfig[0]}
            style={materialDark}
            materialDark={startingLineNumber > 0}
            startingLineNumber={startingLineNumber}
            wrapLongLines
          >
            {texts.slice(1)}
          </SyntaxHighlighter>
        );
      },
    },
  };
  return (
    <div>
      <Head>
        <title>{post.fields.title}</title>
      </Head>
      <main className="prose max-w-none dark:prose-invert lg:prose-lg">
        <h1>{post.fields.title}</h1>
        <div>{documentToReactComponents(post.fields.content, options)}</div>
      </main>
    </div>
  );
};

export default Post;
