import { useEffect, useState } from "react";
import React from "react";
import LeftSide from "../AdminComponent/LeftSide";
import NotifactionAdmin from "../AdminComponent/NotifactionAdmin";

function DisplayOrder() {
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const [orderdata, Setorderdata] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const [selectedFilter, setSelectedFilter] = useState("success"); // Manage the selected radio button

    useEffect(() => {
        fetchOrders(`${apiUrl}/order-api/ordersonlysuccess`); // Fetch success orders by default
    }, [apiUrl]);

    const fetchOrders = (url) => {
        setLoading(true);
        fetch(url, {
            headers: {
                "x-api-key": process.env.REACT_APP_API_KEY,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    const sortedOrders = data.orders.sort(
                        (a, b) => new Date(b.order_date) - new Date(a.order_date)
                    );
                    Setorderdata(sortedOrders);
                } else {
                    setError("Failed to fetch orders.");
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Something went wrong while fetching orders.");
                setLoading(false);
            });
    };

    const handleRadioChange = (event) => {
        const value = event.target.value;
        setSelectedFilter(value); // Update the selected filter state
        if (value === "success") {
            fetchOrders(`${apiUrl}/order-api/ordersonlysuccess`);
        } else if (value === "failed") {
            fetchOrders(`${apiUrl}/order-api/ordersonlyfailed`);
        } else if (value === "all") {
            fetchOrders(`${apiUrl}/order-api/ordersonly`);
        }
    };

    const handleStatusChange = (orderId, newStatus) => {
        fetch(`${apiUrl}/order-api/update-order-status/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order_status: newStatus }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    // Update local state to reflect the new status
                    Setorderdata((prevOrders) => 
                        prevOrders.map((order) => 
                            order._id === orderId ? { ...order, order_status: newStatus } : order
                        )
                    );
                } else {
                    setError("Failed to update order status.");
                }
            })
            .catch(() => {
                setError("Something went wrong while updating order status.");
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Calculate the total number of pages
    const totalPages = Math.ceil(orderdata.length / productsPerPage);

    // Get the products for the current page
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = orderdata.slice(indexOfFirstProduct, indexOfLastProduct);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    // Generate the page numbers to display with ellipses
    const pageNumbers = [];
    // Max number of pages to show in pagination

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            pageNumbers.push(i);
        }
    }

    // Add ellipses for pages that are not shown
    const paginationItems = [];
    for (let i = 0; i < pageNumbers.length; i++) {
        if (i > 0 && pageNumbers[i] - pageNumbers[i - 1] > 1) {
            paginationItems.push("...");
        }
        paginationItems.push(pageNumbers[i]);
    }

    return (
        <>
            <LeftSide />
            <div className="bord">
                <section className="breadcrumb-option">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="breadcrumb__text">
                                    <h4> Order Details </h4>
                                    <div className="breadcrumb__links">
                                        <a href="/dashboard"> Dashboard </a>
                                        <span>Order Display</span>
                                    </div>
                                </div>
                            </div>
                            <NotifactionAdmin/>
                        </div>
                    </div>
                </section>

                <div className="row-container">
                    <div className="col-lg-10 mt-3">
                        <div className="row">
                            <div className="form-check ml-3">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="orderFilter"
                                    id="successOrders"
                                    value="success"
                                    checked={selectedFilter === "success"}
                                    onChange={handleRadioChange}
                                />
                                <label className="form-check-label" htmlFor="successOrders">
                                    Payment Success Orders
                                </label>
                            </div>
                            <div className="form-check ml-5">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="orderFilter"
                                    id="failedOrders"
                                    value="failed"
                                    checked={selectedFilter === "failed"}
                                    onChange={handleRadioChange}
                                />
                                <label className="form-check-label" htmlFor="failedOrders">
                                    Payment Failed Orders
                                </label>
                            </div>
                            <div className="form-check ml-5">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="orderFilter"
                                    id="allOrders"
                                    value="all"
                                    checked={selectedFilter === "all"}
                                    onChange={handleRadioChange}
                                />
                                <label className="form-check-label" htmlFor="allOrders">
                                    All Orders
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="justify-content-end">
                        <div className="item-box w-auto p-2"><a href="/displayorder">Total Order: {orderdata.length}</a></div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">User Name</th>
                                <th scope="col">Address</th>
                                <th scope="col">Product</th>
                                <th scope="col">Total Amount</th>
                                <th scope="col">Order Date</th>
                                <th scope="col">Status</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(orderdata) && currentProducts.map((displayorderdata, index) => (
                                <tr key={displayorderdata._id}>
                                    <td>{indexOfFirstProduct + index + 1}</td>
                                    <td className="overhieed">{displayorderdata.UserName}</td>
                                    <td className="overhieed">{displayorderdata.address}</td>
                                    <td className="titlecapi">
                                        {Array.isArray(displayorderdata.products) ? (
                                            <ul>
                                                {displayorderdata.products.map((product, i) => (
                                                    <li key={i}>
                                                        {product.product_name} - {product.quantity} x {product.price} - {product.selectedSize}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            "No products"
                                        )}
                                    </td>
                                    <td>{displayorderdata.totalAmount}</td>
                                    <td>{displayorderdata.order_date}</td>
                                    <td>
                                        <select
                                            value={displayorderdata.order_status}
                                            onChange={(e) => handleStatusChange(displayorderdata._id, e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </td>
                                    <td>
                                        <a
                                            href={`/vieworder`}
                                            className="ordeview"
                                            onClick={() => {
                                                sessionStorage.removeItem("displayorderId");
                                                sessionStorage.setItem("displayorderId", displayorderdata._id);
                                                window.location.href = `/vieworder`; }} >
                                            View Details
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Start */}
                    <div className="pagination-container">
                        <div className="pagination-right">
                            <button className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
                                    onClick={() => handlePageChange(currentPage - 1)}>
                                Prev
                            </button>

                            {/* Page Numbers */}
                            {paginationItems.map((item, index) => (
                                item === "..." ? (
                                    <span key={index} className="pagination-ellipsis">...</span>
                                ) : (
                                    <button key={index} className={`pagination-button ${currentPage === item ? "active" : ""}`}
                                            onClick={() => handlePageChange(item)} >
                                        {item}
                                    </button>
                                )
                            ))}

                            {/* Next Button */}
                            <button
                                className={`pagination-button ${currentPage === totalPages ? "disabled" : ""}`}
                                onClick={() => handlePageChange(currentPage + 1)} >
                                Next
                            </button>
                        </div>
                    </div>
                    {/* Pagination End */}
                </div>
            </div>
        </>
    );
}

export default React.memo(DisplayOrder);