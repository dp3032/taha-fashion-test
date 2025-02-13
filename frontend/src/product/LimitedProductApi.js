// src/components/LimitedProductApi.js

import { useEffect, useState, useCallback } from "react";
import Slider from "react-slick";

// Import slick-carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function LimitedProductApi() {
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const [limitedApi, setLimitedApi] = useState([]);
  const [reviews, setReviews] = useState({});

  // Function to check if a product is a "New Arrival"
  const isNewArrival = (createdAt) => {
    const now = new Date();
    const productDate = new Date(createdAt);
    const timeDifference = now - productDate;
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 1 day
    return timeDifference <= oneDayInMilliseconds;
  };

  // Memoize fetchReviews with useCallback to prevent unnecessary re-renders
  const fetchReviews = useCallback((productId) => {
    fetch(`${apiUrl}/proreview-api/products/${productId}/reviews`, {
      headers: {
        "x-api-key": process.env.REACT_APP_API_KEY, // Use environment variable
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const sortedReviews = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setReviews((prevReviews) => ({ ...prevReviews, [productId]: sortedReviews }));
      })
      .catch((error) => console.error(`Failed to fetch reviews for product ${productId}:`, error));
  }, [apiUrl]);

  useEffect(() => {
    // Fetch limited products
    fetch(`${apiUrl}/product-api/products/best-sellers`, {
      headers: {
        "x-api-key": process.env.REACT_APP_API_KEY, 
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLimitedApi(data);

          // Fetch reviews for each product
          data.forEach((product) => fetchReviews(product._id));
        } else {
          console.error("Expected an array, but got:", data);
        }
      })
      .catch((error) => console.error("Something went wrong:", error));
  }, [apiUrl, fetchReviews]);

  // Slick carousel settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 900,
    slidesToShow: 4, 
    slidesToScroll: 1, 
    autoplay: true, 
    autoplaySpeed: 3000, 
    responsive: [
      {
        breakpoint: 1208,
        settings: {
          slidesToShow: 3, 
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3, 
        },
      },
      {
        breakpoint: 990,
        settings: {
          slidesToShow: 2, 
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2, 
        },
      },
      {
        breakpoint: 620,
        settings: {
          slidesToShow: 2, 
        },
      },
      {
        breakpoint: 540,
        settings: {
          slidesToShow:1, 
        },
      },
    ],
  };

  return (
    <section className="product spad rmov">
      <div className="container ">
        <div className="row">
          <div className="col-lg-12">
            <ul className="filter__controls">
              <li className="active">Best Seller</li>
            </ul>
          </div>
        </div>

        {/* Slider for product items */}
        <Slider {...settings} className="cheking custom-slider">
          {limitedApi.length === 0 ? (
            <div className="col-12 text-center">
              <p>No Products Available</p>
            </div>
          ) : (
            limitedApi.map((product) => {
              const productReviews = reviews[product._id] || [];
              const averageRating = productReviews.length
                ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
                : 0;

              const isOutOfStock = product.Product_stock_status === 'out-of-stock';
              const isNewArrivalProduct = isNewArrival(product.createdAt) && !isOutOfStock; // New arrival logic only if not out of stock

              return (
                <div className="col-12" key={product._id}>
                  <a
                          href={`/productdetils`}
                          className="add-cart "
                          onClick={() => {
                            sessionStorage.removeItem("productId");
                            sessionStorage.setItem("productId", product._id);
                            window.location.href = `/productdetils`;
                          }}
                        >
                    <div className="siderimg">
                      {/* Out of stock label */}
                      {isOutOfStock && (
                        <div className="ooslable">
                          <span>Out Of Stock</span>
                        </div>
                      )}
                      {/* New Arrival label (only if not out of stock) */}
                      {isNewArrivalProduct && (
                        <div className="newlable">
                          <span>New Arrival</span>
                        </div>
                      )}

                      <div className="product__item__pic set-bg">
                        <img
                          src={product.Product_img[0]}
                          alt="Loading..."
                          className="product_img custom-img imgsilder"
                        />
                      </div>
                      <div className="product__item__text">
                      
                        <h6 className="sometxt"> 
                            {product.Product_name} 
                        </h6>
                        
                        <p className="rating">
                          {[...Array(5)].map((_, index) => (
                            <i
                              key={index}
                              className={`fa ${index < Math.round(averageRating) ? "fa-star" : "fa-star-o"}`}
                            ></i>
                          ))}
                        </p>
                        <h5>Price: {product.Product_price}</h5>
                      </div>
                    </div>
                  </a>
                </div>
              );
            })
          )}
        </Slider>
      </div>
    </section>
  );
}

export default LimitedProductApi;