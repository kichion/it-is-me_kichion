import type { NextPage, InferGetStaticPropsType, GetStaticPaths } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import { buildClient, IPostFields } from "../lib/contentful";
import { EntryCollection } from "contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

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
  return (
    <div>
      <Head>
        <title>{post.fields.title}</title>
      </Head>
      <main className="prose dark:prose-invert lg:prose-xl">
        <h1>{post.fields.title}</h1>
        <div>{documentToReactComponents(post.fields.content)}</div>
      </main>
    </div>
  );
};

export default Post;
