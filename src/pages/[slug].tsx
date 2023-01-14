import type { NextPage, InferGetStaticPropsType, GetStaticPaths } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import { buildClient, IPostFields } from "../lib/contentful";
import { EntryCollection } from "contentful";
import {
  documentToReactComponents,
  Options,
} from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS } from "@contentful/rich-text-types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { ReactNode } from "react";
const getPostEntries = async () => {
  const client = buildClient();
  const { items }: EntryCollection<IPostFields> = await client.getEntries({
    content_type: "post",
  });
  return items;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const items = await getPostEntries();
  return {
    paths: items.map((item) => ({
      params: { slug: item.fields.slug },
    })),
    fallback: false,
  };
};

export const getStaticProps = async () => {
  const items = await getPostEntries();
  return {
    props: {
      posts: items,
    },
  };
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Post: NextPage<Props> = ({ posts }) => {
  const { isFallback } = useRouter();
  if (!isFallback && !posts[0].fields.slug) {
    return <ErrorPage statusCode={404} />;
  }
  const post = posts[0];
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
        console.info(node);
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
        console.info(node);
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
