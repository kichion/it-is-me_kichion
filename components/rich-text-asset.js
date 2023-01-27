import Image from "next/image";

export default function RichTextAsset({ id, assets }) {
  const asset = assets?.find((asset) => asset.sys.id === id);

  if (asset?.url) {
    // NOTE: どうにかしてwidth / heightを充てたい
    return (
      <div>
        <Image
          loader={CMSLoader}
          src={asset.url}
          width={400}
          height={400}
          alt={asset.description}
        />
      </div>
    );
  }

  return null;
}

const CMSLoader = ({ src, width, quality }) => {
  return src;
};
