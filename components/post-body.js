import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS } from "@contentful/rich-text-types";
import markdownStyles from "./markdown-styles.module.css";
import RichTextAsset from "./rich-text-asset";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

const Code = ({ children }) => (
  <div>
    <pre className="my-0 py-0 lg:my-0 lg:py-0">
      <code>{children}</code>
    </pre>
  </div>
);
const customMarkdownOptions = (content) => ({
  renderNode: {
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
        return <Code>{children}</Code>;
      }
      return <p>{children}</p>;
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
