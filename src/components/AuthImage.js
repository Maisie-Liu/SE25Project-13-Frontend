import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';

const AuthImage = ({ src, alt, ...props }) => {
  const [imgUrl, setImgUrl] = useState('');

  useEffect(() => {
    let isMounted = true;
    if (src) {
      axios
        .get(src, { responseType: 'blob' })
        .then(res => {
          if (isMounted) {
            const url = URL.createObjectURL(res.data);
            setImgUrl(url);
          }
        })
        .catch(() => {
          if (isMounted) setImgUrl('/no-image.png');
        });
    } else {
      setImgUrl('/no-image.png');
    }
    return () => {
      isMounted = false;
      if (imgUrl) URL.revokeObjectURL(imgUrl);
    };
    // eslint-disable-next-line
  }, [src]);

  return <img src={imgUrl} alt={alt} {...props} />;
};

export default AuthImage; 