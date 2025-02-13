import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../component/Header";
import ShopCat from "../../page/ShopCat";
import Footer from "../../component/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import debounce from "lodash.debounce";

function FilterProduct() {
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const isNewArrival = (createdAt) => {
    const now = new Date();
    const productDate = new Date(createdAt);
    const timeDifference = now - productDate;
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    return timeDifference <= oneDayInMilliseconds;
  };

  useEffect(() => {
    const fetchProducts = debounce(async (searchQuery) => {
      const categoryId = sessionStorage.getItem("selectedCategory");
      try {
        const response = await axios.get(`${apiUrl}/product-api/products`, {
          params: {
            category: categoryId,
            search: searchQuery,
          },
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products. Please try again later.");
      }
    }, 500);

    fetchProducts(searchInput);

    return () => {
      fetchProducts.cancel();
    };
  }, [searchInput, apiUrl]);

  useEffect(() => {
    const fetchProductReviews = async () => {
      try {
        const reviewsPromises = products.slice(0, visibleProducts).map(async (product) => {
          const response = await axios.get(`${apiUrl}/proreview-api/products/${product._id}/reviews`, {
            headers: {
              "x-api-key": process.env.REACT_APP_API_KEY,
            },
          });
          return { productId: product._id, reviews: response.data };
        });

        const reviewsData = await Promise.all(reviewsPromises);

        const reviewsMap = reviewsData.reduce((acc, { productId, reviews }) => {
          acc[productId] = reviews;
          return acc;
        }, {});

        setReviews(reviewsMap);
      } catch (error) {
        console.error("Failed to fetch reviews.", error);
      }
    };

    if (products.length > 0) {
      fetchProductReviews();
    }
  }, [products, visibleProducts, apiUrl]);

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const loadMoreProducts = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleProducts((prev) => prev + 12);
      setIsLoadingMore(false);
    }, 1000); // Simulates a loading effect for 1 second
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
                  <a href="/"> Home </a>
                  <a href="/shop"> Shop </a>
                  <span>Category Product</span>
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
                <form>
                  <div className="serbox">
                    <input
                      type="text"
                      placeholder="Search for products..."
                      value={searchInput}
                      onChange={handleSearchInputChange}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="crossicon"
                      onClick={() => setSearchInput("")}
                    />
                  </div>
                </form>
              </div>
              <div className="row">
                {products.slice(0, visibleProducts).length === 0 ? (
                  <p>No Product Available</p>
                ) : (
                  products.slice(0, visibleProducts).map((product) => {
                    const productReviews = reviews[product._id] || [];
                    const averageRating = productReviews.length
                      ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
                      : 0;
                      const isOutOfStock = product.Product_stock_status === 'out-of-stock';
                      const isBestSeller = product.Best_seller === true;
                      const isNewArrivalProduct = isNewArrival(product.createdAt) && !isBestSeller && !isOutOfStock;

                    return (
                      <div className="col-lg-4 col-md-6 col-sm-6 boxhover" key={product._id}>
                        <a href={`/productdetils`} className="product__item__link" onClick={(e) => {
                          e.preventDefault();
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
                                  <i key={index} className={`fa ${index < Math.round(averageRating) ? "fa-star" : "fa-star-o"}`} />
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
              {isLoadingMore ? (
                <div className="spinner-wrapper">
                  <div className="spinner"></div>
                </div>
              ) : (
                visibleProducts < products.length && (
                  <div className="text-center mt-4">
                    <button className="btn btn-primary" onClick={loadMoreProducts}>
                      Load More
                    </button>
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

export default React.memo(FilterProduct);
