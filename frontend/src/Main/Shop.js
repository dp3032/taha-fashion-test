import React, { useCallback, useEffect, useState } from "react";
import ShopCat from "../page/ShopCat";
import Header from "../component/Header";
import Footer from "../component/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

function Shop() {
  const [apiproductdata, setApiProductData] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [reviews, setReviews] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading
  const apiUrl = process.env.REACT_APP_BASE_URL;

  const isNewArrival = (createdAt) => {
    const now = new Date();
    const productDate = new Date(createdAt);
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    return now - productDate <= oneDayInMilliseconds;
  };

  const fetchProducts = useCallback(() => {
    const query = searchQuery ? `?search=${searchQuery}` : "";
    fetch(`${apiUrl}/product-api/products${query}`, {
      headers: {
        "x-api-key": process.env.REACT_APP_API_KEY,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setApiProductData(sortedData);

        data.forEach((product) => {
          fetch(`${apiUrl}/proreview-api/products/${product._id}/reviews`, {
            headers: {
              "x-api-key": process.env.REACT_APP_API_KEY,
            },
          })
            .then((response) => response.json())
            .then((reviewData) => {
              const sortedReviews = reviewData.sort((a, b) => new Date(b.date) - new Date(a.date));
              setReviews((prevReviews) => ({ ...prevReviews, [product._id]: sortedReviews }));
            })
            .catch((error) => console.error(`Failed to fetch reviews for product ${product._id}:`, error));
        });
      })
      .catch((error) => console.error("Failed to fetch products:", error));
  }, [apiUrl, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, fetchProducts]);

  const handleLoadMore = () => {
    setLoading(true); // Show the loader
    setTimeout(() => {
      setVisibleProducts((prev) => prev + 12);
      setLoading(false); // Hide the loader after products are loaded
    }, 1000); // Simulate an API call delay (1 second)
  };

  return (
    <>
      <Header />
      <section className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4>Shop</h4>
                <div className="breadcrumb__links">
                  <a href="/">Home</a>
                  <span>Shop</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shop spad">
        <div className="container">
          <div className="row">
            <ShopCat />
            <div className="col-lg-9">
              <div className="shop__sidebar__search">
                <form onSubmit={(e) => { e.preventDefault(); fetchProducts(); }}>
                  <div className="serbox">
                    <input
                      type="text"
                      placeholder="Search for products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="crossicon"
                      onClick={() => setSearchQuery("")}
                    />
                  </div>
                </form>
              </div>

              <div className="row">
                {apiproductdata.length === 0 ? (
                  <div className="col-12">
                    <p className="text-center">No Products Available</p>
                  </div>
                ) : (
                  apiproductdata.slice(0, visibleProducts).map((product) => {
                    const productReviews = reviews[product._id] || [];
                    const averageRating = productReviews.length
                      ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
                      : 0;

                    const isOutOfStock = product.Product_stock_status === 'out-of-stock';
                    const isBestSeller = product.Best_seller === true;
                    const isNewArrivalProduct = isNewArrival(product.createdAt) && !isBestSeller && !isOutOfStock;

                    return (
                      <div className="col-lg-4 col-md-6 col-sm-6 boxhover" key={product._id}>
                        <a href={`/productdetils`} className="product__item__link" onClick={(e) => {
                          e.preventDefault();
                          sessionStorage.removeItem("productId");
                          sessionStorage.removeItem("selectedCategory");
                          sessionStorage.setItem("productId", product._id);
                          window.location.href = `/productdetils`;
                        }}>
                          <div className="product__item">
                            {isOutOfStock && <div className="ooslable"><span>Out Of Stock</span></div>}
                            {!isOutOfStock && isNewArrivalProduct && <div className="newlable"><span>New Arrival</span></div>}
                            {!isOutOfStock && isBestSeller && <div className="newlable"><span>Best Seller</span></div>}
                            <div className="product__item__pic set-bg">
                              <img src={product.Product_img[0]} alt="Loading..." className="product_img" />
                            </div>
                            <div className="product__item__text txtproduct">
                              <h6>{product.Product_name}</h6>
                              <div className="rating">
                                {[...Array(5)].map((_, index) => (
                                  <i key={index} className={`fa ${index < Math.round(averageRating) ? "fa-star" : "fa-star-o"}`} ></i>
                                ))}
                              </div>
                              <h5> Price: {product.Product_price}</h5>
                            </div>
                          </div>
                        </a>
                      </div>
                    );
                  })
                )}
              </div>
              {loading ? (
                <div className="spinner-wrapper">
                  <div className="spinner"></div>
                </div>
              ) : (
                visibleProducts < apiproductdata.length && (
                  <div className="text-center mt-4">
                    <button className="btn btn-primary" onClick={handleLoadMore}>Load More</button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default React.memo(Shop);
