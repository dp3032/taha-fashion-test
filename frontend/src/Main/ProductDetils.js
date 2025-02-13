import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../page/CartContext";  
import Footer from "../component/Footer";
import Header from "../component/Header";
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import RelatedProduct from "../product/RelatedProduct";


function ProductDetils() {
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const { cart, addToCart } = useCart(); 
    const [productdetils, Setproductdetils] = useState(null);
    const [is_user_login, setIsUserLogin] = useState(false); 
    const [reviews, setReviews] = useState([]); 
    const [selectedSize, setSelectedSize] = useState("");  
    const [newReview, setNewReview] = useState({ rating: 0, message: "", name: "" });
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    
    //Product Display
    useEffect(() => {
        const fetchProductDetails = async () => {
          const productId = sessionStorage.getItem("productId");
      
          try {
            const response = await fetch(`${apiUrl}/product-api/products/${productId}`,{
                headers: {
                    "x-api-key": process.env.REACT_APP_API_KEY, 
                },
            })
            if (!response.ok) {
              throw new Error(await response.text());
            }
      
            const data = await response.json();
            Setproductdetils(data);
          } catch (err) {
            console.error("Error fetching product details:", err.message);
          }
        };
      
        fetchProductDetails();
      });

     //Login Stuts 
    useEffect(() => {
            const userLoginStatus = sessionStorage.getItem('role');
            if (userLoginStatus === 'user') {
                setIsUserLogin(true);
            } else {
                setIsUserLogin(false);
            }
        }, []); 

    const handleAddToCart = () => {
        if (productdetils && selectedSize) {
            const productWithSize = { ...productdetils, selectedSize };
            addToCart(productWithSize);  
            
            // Display a toast notification for success
            toast.success(`${productdetils.Product_name} added to cart successfully!`, {
                position: "top-right", 
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
    
            sessionStorage.removeItem("productId");
            
        } else {
            // Display a toast notification for error
            toast.error("Please select a size!", {
                position: "top-right", 
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
    };
        
    const loginaddcart = () => {
        navigate("/login");
    }

    const isInCart = (productid) => Object.keys(cart || {}).includes(productid.toString());
    const productId = sessionStorage.getItem("productId");
  
    //Revire Display
     useEffect(() => {
        fetch(`${apiUrl}/proreview-api/products/${productId}/reviews`,{
            headers: {
                "x-api-key": process.env.REACT_APP_API_KEY, 
            },
        })
        .then((response) => response.json())
        .then((data) => setReviews(data))
        .catch((error) => console.log("Failed to fetch reviews", error));
    }, [productId , apiUrl]);

    // Submit review handler
    const handleReviewSubmit = () => {
        if (!newReview.rating || !newReview.message || !newReview.name) {
            alert("Please provide a rating, a message, and a name.");
            return;
        }

        const review = {
            rating: newReview.rating,
            name: newReview.name,
            message: newReview.message,
        };

        fetch(`${apiUrl}/proreview-api/products/${productId}/reviews`, {
            method: "POST",
            headers: {
                "x-api-key": process.env.REACT_APP_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(review),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((text) => {
                        throw new Error(text);
                    });
                }
                return response.json();
            })
            .then((data) => {
                setReviews((prev) => [...prev, data]); // Add new review
                setNewReview({ rating: 0, message: "", name: "" }); // Reset form
                alert("Review submitted successfully!");
            })
            .catch((error) => console.error("Failed to submit review:", error.message));
    };

    const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

    const isOutOfStock = productdetils?.Product_stock_status === "out-of-stock";

    return (
        <>
            <Header/>

                <ToastContainer />
                
                    {productdetils ? (
                        <section className="shop-details">
                            <div className="product__details__pic">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <div className="product__details__breadcrumb">
                                                <a href="/"> Home </a>
                                                <a href="/shop"> Shop </a>
                                                <span>Product Details</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-lg-2 col-md-3">
                                            <div className="silderthymbile">
                                                <ul className="nav nav-tabs" role="tablist">
                                                    {productdetils.Product_img && productdetils.Product_img.map((img, index) => (
                                                        <li className="nav-item" key={index}>
                                                            <a className={`nav-link ${index === 0 ? "active" : ""}`} data-toggle="tab" href={`#tabs-${index + 1}`} role="tab">
                                                                <div className="product__thumb__pic set-bg">
                                                                    <img src={img} alt={`Product Thumbnail ${index + 1}`} />
                                                                </div>
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="col-lg-4 col-md-9">
                                            <div className="tab-content">
                                                {productdetils.Product_img &&
                                                    productdetils.Product_img.map((img, index) => (
                                                    <div
                                                        className={`tab-pane ${index === 0 ? 'active' : ''}`}
                                                        id={`tabs-${index + 1}`}
                                                        key={index}
                                                        role="tabpanel"
                                                    >
                                                        <div className="product__details__pic__item">
                                                        <TransformWrapper>
                                                            <TransformComponent>
                                                            <img src={img} alt="Product" />
                                                            </TransformComponent>
                                                        </TransformWrapper>
                                                        </div>
                                                    </div>
                                                    ))}
                                            </div>
                                        </div>

                                        <div className="col-lg-6 col-md-9">
                                            <div className="product__details__content">
                                                <div className="container">
                                                    <div className="row d-flex justify-content-center">
                                                        <div className="col-lg-10">
                                                            <div className="product__details__text">
                                                                <h3 className="firstltter"> {productdetils.Product_name} </h3>
                                                                <h4 className="mb-4"> Price : {productdetils.Product_price} </h4>
                                                                
                                                                <div className="product__details__last__option">
                                                                    <>
                                                                        <ul>
                                                                            <li> 
                                                                                Categories : {productdetils.Product_category?.name || "Category not available"} 
                                                                            </li>
                                                                            <li>
                                                                                Product Tags : {productdetils.tags.length > 0 ? productdetils.tags.join(', ') : "Tags not available"}
                                                                            </li>
                                                                            <li className="rating">
                                                                                Rating :{" "} 
                                                                                    {[...Array(5)].map((_, index) => (
                                                                                        <i
                                                                                            key={index}
                                                                                            className={`fa ${
                                                                                            index < Math.round(averageRating) ? "fa-star" : "fa-star-o"
                                                                                    }`}> </i>
                                                                                ))} {" "}
                                                                                ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                                                                            </li>
                                                                            <li>
                                                                                <div className="row">
                                                                                    <div className="col-lg-4"> 
                                                                                        <select required value={selectedSize} 
                                                                                            onChange={(e) => setSelectedSize(e.target.value)}
                                                                                        >
                                                                                            <option value="" disabled>
                                                                                                Select your size
                                                                                            </option>

                                                                                            {productdetils.Product_sizes && productdetils.Product_sizes.length > 0 ? (
                                                                                                productdetils.Product_sizes.map((size, index) => (
                                                                                                    <option key={index} value={size}>
                                                                                                        {size}
                                                                                                    </option>
                                                                                                ))
                                                                                            ) : (
                                                                                                <option value="" disabled>
                                                                                                    Sizes not available
                                                                                                </option>
                                                                                            )}
                                                                                        </select>
                                                                                    </div>
                                                                                    <div> 
                                                                                        <p className="sizegudie mt-1 mb-1" onClick={() => setIsOpen(true)}>
                                                                                            Size Guide
                                                                                        </p>
                                                                                        {isOpen && (
                                                                                            <div className="modal-overlaysg" onClick={() => setIsOpen(false)}>
                                                                                                <div className="modal-contentsg" onClick={(e) => e.stopPropagation()}>
                                                                                                    <button className="close-btnsg" onClick={() => setIsOpen(false)}>×</button>
                                                                                                    {productdetils.Size_images ? (
                                                                                                        <img src={productdetils.Size_images} alt="Size Guide" className="size-guide-imgsg" />
                                                                                                    ) : (
                                                                                                        <p className="no-size-image-msg">Size image is not available</p>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>  
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                            <li>
                                                                                {is_user_login ? (
                                                                                    <div className="mt-4">
                                                                                        {isOutOfStock ? (
                                                                                            <>
                                                                                                <button className="btn btn-danger disblebtn" disabled>
                                                                                                    Out of Stock
                                                                                                </button>
                                                                                                <p className="mt-3">
                                                                                                    <strong> This Product Are Out OF Stock...! </strong>
                                                                                                </p>
                                                                                            </>
                                                                                        ) : (
                                                                                            <button 
                                                                                                className="btn btn-success addcrtbtn" 
                                                                                                disabled={isInCart(productdetils._id)} 
                                                                                                onClick={handleAddToCart}
                                                                                            >
                                                                                                {isInCart(productdetils._id) ? 'Already in Cart' : 'Add to Cart'}
                                                                                            </button>
                                                                                        )}
                                                                                    </div>
                                                                                ) : (
                                                                                    <button 
                                                                                        onClick={loginaddcart} className="addlogin mt-3"> 
                                                                                        Please Login
                                                                                    </button>
                                                                                )}
                                                                            </li>
                                                                        </ul>
                                                                        
                                                                    </>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-12 col-md-9 mt-5">
                                            <p className="text-left"> <strong> Description : </strong> <span dangerouslySetInnerHTML={{ __html: productdetils.Product_des }} /></p>
                                    </div>

                                    {/* Review Section */}
                                    <div className="review-section">
                                        <h3>Customer Reviews</h3>
                                        <div className="col-lg-12">
                                            <div className="row">
                                                <div className="col-lg-4" style={{ maxHeight: "300px", overflowY: "auto" }}>
                                                    {/* Display Reviews */}
                                                    {reviews.length > 0 ? (
                                                        reviews.slice().reverse().map((review, index) => (
                                                            <div key={index} className="review-item">
                                                                <p>Name : {review.name}</p>
                                                                <div className="rating">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <i
                                                                            key={i}
                                                                            className={`fa ${i < review.rating ? "fa-star" : "fa-star-o"}`}
                                                                        ></i>
                                                                    ))}
                                                                </div>
                                                                <p>Message : {review.message}</p>
                                                                <small>{review.rating_date}</small>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p>No reviews yet. Be the first to review this product!</p>
                                                    )}
                                                </div>

                                                <div className="col-lg-1">
                                                </div>

                                                <div className="col-lg-7">
                                                    {/* Add Review Form */}
                                                    {is_user_login ? (
                                                        <div className="add-review">
                                                            <h4>Leave a Review</h4>
                                                            <div className="col-lg-12">
                                                                <div className="row">
                                                                    <div className="col-lg-12">
                                                                        {/* Rating stars */}
                                                                        <div className="star-rating">
                                                                            {[...Array(5)].map((_, index) => (
                                                                                <i
                                                                                    key={index}
                                                                                    className={`fa ${index < newReview.rating ? "fa-star" : "fa-star-o"}`}
                                                                                    onClick={() => setNewReview((prev) => ({ ...prev, rating: index + 1 }))}
                                                                                ></i>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-12">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Name"
                                                                            value={newReview.name}
                                                                            onChange={(e) =>
                                                                                setNewReview((prev) => ({ ...prev, name: e.target.value }))
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <textarea
                                                                value={newReview.message}
                                                                onChange={(e) =>
                                                                    setNewReview((prev) => ({ ...prev, message: e.target.value }))
                                                                }
                                                                placeholder="Write your review here..."
                                                            />
                                                            <button onClick={handleReviewSubmit}>Submit Review</button>
                                                        </div>
                                                    ) : (
                                                        <p>
                                                            <button onClick={() => navigate("/login")}>Log in to leave a review</button>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    </div>
                                </div>
                            
                            {/* Product details UI */}
                            
                        </section>
                    ) : (
                        <p>Loading product details...</p>
                    )}

            <RelatedProduct/>

            <Footer />
        </>
    );
}

export default ProductDetils;
