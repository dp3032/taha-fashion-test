import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../component/Header';
import Footer from '../component/Footer';

const MyOrder = () => {
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  // const [isReturnActive, setIsReturnActive] = useState(null); 
  // const [returnReason, setReturnReason] = useState(''); 
  // const [loadingOrders, setLoadingOrders] = useState({}); 
  const user_id = sessionStorage.getItem('user_id'); 

  useEffect(() => {
    if (!user_id) {
      alert("Login is required....!");
      setError('No user found in session.');
      window.location.href = "/login";
      return;
    }

    // Fetch orders for the user
    axios
      .get(`${apiUrl}/order-api/get-user-orders?user_id=${user_id}`, {
        headers: {
          "x-api-key": process.env.REACT_APP_API_KEY,
        },
      })
      .then((response) => {
        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          setError(response.data.message);
        }
      })
      .catch((err) => {
        console.error("Order fetch failed:", err);
      });
  }, [user_id, apiUrl]);

  // const handleCancelClick = (id) => {
  //   if (window.confirm("Are you sure you want to Cancel this product?")) {
  //     setLoadingOrders((prev) => ({ ...prev, [id]: true })); // Set loading state for this order
  //     fetch(`${apiUrl}/order-api/delete-order/${id}`, {
  //       method: "DELETE",
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         alert(data.message);
  //         setOrders(orders.filter((order) => order._id !== id));
  //       })
  //       .catch(() => {
  //         alert("Failed to Cancel the Order");
  //       })
  //       .finally(() => {
  //         setLoadingOrders((prev) => ({ ...prev, [id]: false })); // Clear loading state
  //       });
  //   }
  // };

  // const handleReturnClick = (id, reason) => {
  //   if (window.confirm("Are you sure you want to Return this product?")) {
  //     setLoadingOrders((prev) => ({ ...prev, [id]: true })); // Set loading state for this order
  //     fetch(`${apiUrl}/order-api/return-order/${id}`, {
  //       method: "DELETE",
  //       body: JSON.stringify({ reason }),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         alert(data.message);
  //         setOrders(orders.filter((order) => order._id !== id));
  //       })
  //       .catch(() => {
  //         alert("Failed to Return Order..!");
  //       })
  //       .finally(() => {
  //         setLoadingOrders((prev) => ({ ...prev, [id]: false })); // Clear loading state
  //       });
  //   }
  // };

  // const handleReturnButtonClick = (orderId) => {
  //   setIsReturnActive(orderId); // Activate return input for a specific order
  // };

  // const handleSubmitReturn = (orderId) => {
  //   if (returnReason.trim()) {
  //     handleReturnClick(orderId, returnReason);
  //     setReturnReason(''); // Clear the reason after submitting
  //     setIsReturnActive(null); // Hide input box after submission
  //   } else {
  //     alert("Please provide a reason for the return.");
  //   }
  // };

  // const isCancelDisabled = (orderDate, orderStatus) => {
  //   const currentDate = new Date();
  //   const placedDate = new Date(orderDate);
  //   const diffInDays = Math.floor((currentDate - placedDate) / (1000 * 60 * 60 * 24));

  //   return orderStatus === "Delivered" || diffInDays > 7; // Disable cancel after delivery or after 7 days
  // };

  // const isReturnDisabled = (orderStatus, statusTime) => {
  //   const currentDate = new Date();
  //   const deliveredTime = new Date(statusTime);
  //   const diffInDays = Math.floor((currentDate - deliveredTime) / (1000 * 60 * 60 * 24));

  //   return orderStatus !== "Delivered" || diffInDays > 3; // Disable return after 3 days from Delivered
  // };

  if (error) {
    return <div className="error-notification">{error}</div>;
  }

  // const refundpage = () => {
  //   window.location.href = "/userrefund";
  // };

  // const returnpage = () => {
  //   window.location.href = "/myreturn";
  // };

  return (
    <>
      <Header />
      <section className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4>My Order</h4>
                <div className="breadcrumb__links">
                  <a href="/"> Home </a>
                  <span>My Order</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <div className="refundbtn">
        <button className="btn btn-outline-dark" onClick={refundpage}> View Cancelled/Refund </button>
        <button className="btn btn-outline-dark ml-4 orderetu" onClick={returnpage}> View Return Order </button>
      </div> */}

      {orders.length === 0 ? (
        <>
          <p className="errororder">No orders found....</p>
          <p className="errororderf">Please Order First....</p>
        </>
      ) : (
        <div className="col-lg-12">
          {orders.map((order) => (
            <div key={order._id} className="order-item-card">
              <div className="row">

                <div className="col-lg-6">
                  <h4>
                    <strong>Order ID: </strong>
                    {order._id}
                  </h4>
                  <p>
                    <strong>Order Status: </strong>
                    {order.order_status}
                  </p>
                  <p>
                    <strong>Total Amount: </strong>
                    {order.totalAmount}
                  </p>
                  <p>
                    <strong>Payment Method: </strong>
                    {order.paymentMethod}
                  </p>

                  <p>
                    <strong>Ordered on: </strong>
                    {order.order_date}
                  </p>

                  <p>
                    <strong> Payment Detils </strong>
                      {order.paymentDetails.map((payment, index) => (
                            <div>
                              <p className="paymentdetiss"> <strong> Payment Status : </strong> {payment.paymentStatus}  </p>
                              <p className="paymentdetis"> <strong> Payment ID : </strong> {payment.payment_id}  </p>
                            </div>
                        ))}
                  </p>
                  <p>
                    <strong>
                      Any Query Please <a href="/contacts" className="linkhove"> Contact Us </a> 
                    </strong>
                  </p>

                </div>

                <div className="col-lg-6">
                  <ul className="order-product-list">
                    <div className="row">
                      {order.products.map((product, index) => (
                        <div className="col-lg-6" key={index}>
                          <li>
                            <img src={product.Product_img[0]} alt="Loading..." style={{ width: 100 }} />
                            <p className="ordertet">
                              <strong>{product.product_name}</strong>
                              <br />
                              <strong>Quantity: </strong>{product.quantity}
                              <br />
                              <strong>Price: </strong>{product.price}
                            </p>
                          </li>
                        </div>
                      ))}
                    </div>
                  </ul>
                </div>

              </div>

            {/* Return Button - Disable after 3 days from Delivered Status Time */}
              {/* {order.order_status === "Delivered" && !isReturnDisabled(order.order_status, order.order_status_time) ? (
                <>
                  <button
                    className="btn btn-outline-primary mt-2"
                    onClick={() => handleReturnButtonClick(order._id)}
                    disabled={loadingOrders[order._id]}
                  >
                     {loadingOrders[order._id] ? "Processing Return..." : "Return"}
                  </button>
                  <p className="cancel-disabled-msg">
                    Return is disabled after 3 days from Delivered.
                  </p>
                  {isReturnActive === order._id && (
                    <div>
                      <input
                        type="text"
                        placeholder="Enter return reason..."
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        className="resoninput"
                      />
                      <button
                        className="btn btn-outline-success resonsubmit"
                        onClick={() => handleSubmitReturn(order._id)}
                      >
                        Submit
                      </button>
                    </div>
                  )}
                </>
              ) : null} */}

            {/* Cancel Button - Disable after Delivered */}
            {/* {order.order_status !== "Delivered" && !isCancelDisabled(order.order_date, order.order_status) ? (
              <>
                <button
                  className="btn btn-outline-danger mt-2"
                  onClick={() => handleCancelClick(order._id)}
                  disabled={loadingOrders[order._id]}
                >
                  {loadingOrders[order._id] ? "Cancelling..." : "Cancel"}
                </button>
                <p className="cancel-disabled-msg">
                  Cancellation is Only Avilable 7 days from order.
                </p>
              </>
            ) : null} */}

            </div>
          ))}
        </div>
      )}
      <Footer />
    </>
  );
};

export default React.memo(MyOrder);