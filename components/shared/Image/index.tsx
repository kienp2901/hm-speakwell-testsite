import Image, { ImageLoader, ImageProps } from 'next/image';
import React, { memo } from 'react';

interface ImageComponentProps {
  src: string;
  loader?: ImageLoader;
  layout?: 'intrinsic' | 'fixed' | 'responsive' | 'fill' | 'raw';
  alt?: string;
  width?: string | number;
  height?: string | number;
  priority?: boolean;
}

const ImageComponent: React.FC<ImageComponentProps> = (props) => {
  const {
    src,
    loader,
    layout = 'intrinsic',
    alt = '',
    width = '100%',
    height = '100%',
    priority = false,
  } = props;

  return (
    <Image
      src={src}
      loader={loader}
      width={width}
      height={height}
      layout={layout}
      priority={priority}
      alt={alt}
    />
  );
};

export default memo(ImageComponent);

