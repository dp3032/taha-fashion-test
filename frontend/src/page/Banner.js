import React, { useEffect, useState } from 'react';

const Banner = () => {
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
        setDisplaygallery(sortedData.slice(0, 3)); // Limit to 3 items
      })
      .catch((error) => console.log('Something went wrong', error));
  }, [apiUrl]);

  return (
    <>
      <div className="banner-section">
        <div className="container-banner">
          <h1 className="banner-title">Our Top Product</h1>
          <p className="banner-description mb-5">
            Elevate your style with a mix of elegance and modernity—be it the timeless 
            charm of embroidered sherwanis for grand celebrations or the bold sophistication 
            of a red blazer for standout moments. Perfect for every occasion that demands 
            confidence and charisma.
          </p>

          {Displaygallery[0] && (
            <div className="cycle-container">
              <div className="row">
                <div className="col-md-5">
                  <div className="cycle-box">
                    <div className="cycle-image">
                          <img src={Displaygallery[0].Gallery_img[0]} alt="Loading..." />
                    </div>
                  </div>
                </div>
                <div className="col-md-7 baner-1">
                  <h1 className="cycle-name res-name">{Displaygallery[0].Gallery_name}</h1>
                  <p className="cycle-description"> <strong> Description : </strong> {Displaygallery[0].Gallery_des}</p>
                  <div className="cycle-actions">
                    <a  className="buy-button"
                        href={`/productdetils`}
                        onClick={() => {
                         
                        const productId = Displaygallery[0].Gallery_Product_ID;
                        if (productId && typeof productId === 'object') {

                          sessionStorage.setItem("productId", productId.id || productId._id); 
                        } else {
                          
                          sessionStorage.setItem("productId", productId);
                        }

                        sessionStorage.removeItem("selectedCategory");
                        window.location.href = `/productdetils`;
                      }}
                    >
                      Buy Now
                    </a>
                    <h4 className="cycle-price">
                      Price : <span className="highlighted-price">{Displaygallery[0].Gallery_price}</span>
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          )}

          {Displaygallery[1] && (
            <div className="cycle-container">
              <div className="row">
                <div className="col-md-7 baner-2">
                  <h1 className="cycle-name">{Displaygallery[1].Gallery_name}</h1>
                  <p className="cycle-description"> <strong> Description : </strong> {Displaygallery[1].Gallery_des}</p>
                  <div className="cycle-actions">
                    <h4 className="cycle-price res-pric">
                      Price : <span className="highlighted-price">{Displaygallery[1].Gallery_price}</span>
                    </h4>
                    <a  className="buy-button mb-3"
                        href={`/productdetils`}
                        onClick={() => {
                         
                        const productId = Displaygallery[1].Gallery_Product_ID;
                        if (productId && typeof productId === 'object') {
                          
                          sessionStorage.setItem("productId", productId.id || productId._id); 
                        } else {

                          sessionStorage.setItem("productId", productId);
                        }

                        sessionStorage.removeItem("selectedCategory");
                        window.location.href = `/productdetils`;
                      }}
                    >
                      Buy Now
                    </a>
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="cycle-box">
                    <div className="cycle-image">
                      <img src={Displaygallery[1].Gallery_img[0]} alt="Loading..." />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {Displaygallery[2] && (
            <div className="cycle-container">
              <div className="row">
                <div className="col-md-5">
                  <div className="cycle-box">
                    <div className="cycle-image">
                      <img src={Displaygallery[2].Gallery_img[0]} alt="Loading..." />
                    </div>
                  </div>
                </div>
                <div className="col-md-7 baner-1">
                  <h1 className="cycle-name res-name">{Displaygallery[2].Gallery_name}</h1>
                  <p className="cycle-description"> <strong> Description : </strong> {Displaygallery[2].Gallery_des}</p>
                  <div className="cycle-actions">
                  <a  className="buy-button"
                        href={`/productdetils`}
                        onClick={() => {
                          
                        const productId = Displaygallery[2].Gallery_Product_ID;
                        if (productId && typeof productId === 'object') {
                          
                          sessionStorage.setItem("productId", productId.id || productId._id); 
                        } else {

                          sessionStorage.setItem("productId", productId);
                        }

                        sessionStorage.removeItem("selectedCategory");
                        window.location.href = `/productdetils`;
                      }}
                    >
                      Buy Now
                    </a>
                    <h4 className="cycle-price">
                      Price : <span className="highlighted-price">{Displaygallery[2].Gallery_price}</span>
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="read-more">
            <a href="/shop" className="read-more-button">Read More</a>
          </div>

        </div>
      </div>
    </>
  );
};

export default Banner;
