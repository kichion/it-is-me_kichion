import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types";
import markdownStyles from "./markdown-styles.module.css";
import RichTextAsset from "./rich-text-asset";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

const customMarkdownOptions = (content) => ({
  renderNode: {
    [INLINES.HYPERLINK]: (node, children) => {
      return (
        <a
          href={node.data.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
        >
          {children}
        </a>
      );
    },
    [BLOCKS.EMBEDDED_ASSET]: (node) => (
      <RichTextAsset
        id={node.data.target.sys.id}
        assets={content.links.assets.block}
      />
    ),
    // NOTE: コードブロックをdivで括る
    [BLOCKS.PARAGRAPH]: (node, children) => {
      const n = node.content[0];
      if (
        node.content.length === 1 &&
        n.nodeType === "text" &&
        n.marks.find((x) => x.type === "code")
      ) {
        return (
          <div>
            <pre className="my-0 py-0 lg:my-0 lg:py-0">
              <code>{children}</code>
            </pre>
          </div>
        );
      }
      return <p>{children}</p>;
    },
    [BLOCKS.UL_LIST]: (node) => {
      return (
        <ul className="list-disc pl-8">
          {node.content.map((c, i) => {
            return <li key={i}>{c.content[0].content[0].value}</li>;
          })}
        </ul>
      );
    },
  },
  renderMark: {
    [MARKS.CODE]: (node) => {
      // NOTE: using code block (first line is config => {language}:{startingLineNumber}).
      //       showLineNumbers is false if startingLineNumber is 0
      const texts = node.split("\n");
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
});

export default function PostBody({ content }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className={markdownStyles["markdown"]}>
        {documentToReactComponents(
          content.json,
          customMarkdownOptions(content)
        )}
      </div>
    </div>
  );
}
