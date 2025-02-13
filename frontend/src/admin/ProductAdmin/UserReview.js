import { useEffect, useState } from "react";
import React from "react";
import LeftSide from "../AdminComponent/LeftSide";
import NotifactionAdmin from "../AdminComponent/NotifactionAdmin";

function UserReview() {
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);

    useEffect(() => {
        // Fetch reviews from backend
        fetch(`${apiUrl}/proreview-api/admin/reviews`, {
            headers: {
                "x-api-key": process.env.REACT_APP_API_KEY,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setReviews(data.reviews); // Set the reviews data
            })
            .catch((error) => console.log("Something went wrong", error));
    }, [apiUrl]);

    const handleDeleteReview = (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            fetch(`${apiUrl}/proreview-api/admin/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    "x-api-key": process.env.REACT_APP_API_KEY,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to delete review');
                    }
                    return response.json();
                })
                .then((data) => {
                    // Remove the deleted review from the state
                    setReviews(reviews.filter((review) => review.reviewId !== reviewId));
                    alert('Review deleted successfully');
                })
                .catch((error) => console.error('Error deleting review:', error));
        }
    };

    // Pagination logic
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    // Generate page numbers for pagination
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            pageNumbers.push(i);
        }
    }

    const paginationItems = [];
    for (let i = 0; i < pageNumbers.length; i++) {
        if (i > 0 && pageNumbers[i] - pageNumbers[i - 1] > 1) {
            paginationItems.push("...");
        }
        paginationItems.push(pageNumbers[i]);
    }

    const renderStars = (rating) => {
        return (
            <p className="rating">
                {[...Array(5)].map((_, index) => (
                    <i
                        key={index}
                        className={`fa ${index < Math.round(rating) ? "fa-star" : "fa-star-o"}`}
                    ></i>
                ))}
            </p>
        );
    };

    return (
        <>
            <LeftSide />
            <div className="bord">
                <section className="breadcrumb-option">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="breadcrumb__text">
                                    <h4>Reviews</h4>
                                    <div className="breadcrumb__links">
                                        <a href="/dashboard">Dashboard</a>
                                        <span>Reviews</span>
                                    </div>
                                </div>
                            </div>
                            <NotifactionAdmin/>
                        </div>
                    </div>
                </section>

                <div className="container">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col"> # </th>
                                    <th scope="col"> User Name </th>
                                    <th scope="col"> Product Name </th>
                                    <th scope="col"> Product Image</th>
                                    <th scope="col"> Rating </th>
                                    <th scope="col"> Rating Message </th>
                                    <th scope="col"> Rating Date </th>
                                    <th scope="col"> Action </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentReviews.length > 0 ? (
                                    currentReviews.map((review, index) => (
                                        <tr key={review._id || index}>
                                            <td> {indexOfFirstReview + index + 1} </td>
                                            <td> {review.name} </td>
                                            <td className="textcapi"> {review.productName} </td>
                                            <td>
                                                <img
                                                    src={review.productImages[0]}
                                                    alt="Loading..."
                                                    className="reviewimgadin"
                                                />
                                            </td>
                                            <td> {renderStars(review.rating)} </td>
                                            <td> {review.message} </td>
                                            <td> {review.rating_date} </td>
                                            <td>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/hwjcdycb.json"
                                                    trigger="morph"
                                                    state="morph-trash-in"
                                                    onClick={() => handleDeleteReview(review.reviewId)}
                                                ></lord-icon>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            Product not available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="pagination-container mt-5">
                        <div className="pagination-right">
                            <button
                                className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                Prev
                            </button>

                            {/* Page Numbers */}
                            {paginationItems.map((item, index) =>
                                item === "..." ? (
                                    <span key={index} className="pagination-ellipsis">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={index}
                                        className={`pagination-button ${
                                            currentPage === item ? "active" : ""
                                        }`}
                                        onClick={() => handlePageChange(item)}
                                    >
                                        {item}
                                    </button>
                                )
                            )}

                            {/* Next Button */}
                            <button
                                className={`pagination-button ${
                                    currentPage === totalPages ? "disabled" : ""
                                }`}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default React.memo(UserReview);
