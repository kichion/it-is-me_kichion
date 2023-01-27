import ContentfulImage from "./contentful-image";

export default function RichTextAsset({ id, assets }) {
  const asset = assets?.find((asset) => asset.sys.id === id);

  if (asset?.url) {
    return (
      <div>
        <ContentfulImage
          src={asset.url}
          width={400}
          height={400}
          priority={false}
          sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
          alt={asset.description}
        />
      </div>
    );
  }

  return null;
}
