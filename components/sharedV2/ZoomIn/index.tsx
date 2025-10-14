import { memo } from 'react';
import Zoom from 'react-medium-image-zoom';

import 'react-medium-image-zoom/dist/styles.css';

type ZoomIn = {
  src: string;
  alt?: string;
  className?: string;
};

const ZoomIn = ({ src, alt, className }: ZoomIn) => {
  return (
    <div>
      <Zoom>
        <img alt={alt} src={src} className={className} />
      </Zoom>
    </div>
  );
};

export default memo(ZoomIn);
