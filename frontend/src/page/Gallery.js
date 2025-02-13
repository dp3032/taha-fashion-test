import React, { useEffect, useState } from 'react';

const Gallery = () => {
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const [Displaygallery, setDisplaygallery] = useState([]);
  
  // Fetch the gallery data
  useEffect(() => {
    fetch(`${apiUrl}/product-banner-api/display-gallery-homepage-admin`, {
      headers: {
        'x-api-key': process.env.REACT_APP_API_KEY,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setDisplaygallery(sortedData);
      })
      .catch((error) => console.log('Something went wrong', error));
  }, [apiUrl]);

  // Manually assign images
  const galleryImages = Displaygallery.reduce((acc, item) => {
    acc[item.Gallery_name] = item.Gallery_img[0];
    return acc;
  }, {});

  return (
    <>
      <div className="boygally">
        <div className="gallery-container">
          <div>
            <img className="gallery-item gallery-item-1 img-item-1" src={galleryImages['gallery-1']} alt="Loading..." />
            <p><a href="/shop" className="shophover">Shop</a></p>
          </div>
          <div>
            <img className="gallery-item gallery-item-2 img-item-2" src={galleryImages['gallery-2']} alt="Loading..." />
            <p><a href="/shop" className="shophover">Shop</a></p>
          </div>
          <div>
            <img className="gallery-item gallery-item-3 img-item-3" src={galleryImages['gallery-3']} alt="Loading..." />
            <p><a href="/shop" className="shophover">Shop</a></p>
          </div>
          <div>
            <img className="gallery-item gallery-item-4 img-item-4" src={galleryImages['gallery-4']} alt="Loading..." />
            <p><a href="/shop" className="shophover">Shop</a></p>
          </div>
          <div>
            <img className="gallery-item gallery-item-5 img-item-5" src={galleryImages['gallery-5']} alt="Loading..." />
            <p><a href="/shop" className="shophover">Shop</a></p>
          </div>
          <div>
            <img className="gallery-item gallery-item-6 img-item-6" src={galleryImages['gallery-6']} alt="Loading..." />
            <p><a href="/shop" className="shophover">Shop</a></p>
          </div>
          <div>
            <img className="gallery-item gallery-item-7 img-item-7" src={galleryImages['gallery-7']} alt="Loading..." />
            <p><a href="/shop" className="shophover">Shop</a></p>
          </div>
          <div>
            <img className="gallery-item gallery-item-8 img-item-8" src={galleryImages['gallery-8']} alt="Loading..." />
            <p><a href="/shop" className="shophover">Shop</a></p>
          </div>
          <div>
            <img className="gallery-item gallery-item-9 img-item-9" src={galleryImages['gallery-9']} alt="Loading..." />
            <p><a href="/shop" className="shophover">Shop</a></p>
          </div>
          <div>
            <img className="gallery-item gallery-item-10 img-item-10" src={galleryImages['gallery-10']} alt="Loading..." />
            <p><a href="/shop" className="shophover">Shop</a></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Gallery;
