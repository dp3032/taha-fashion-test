import React, { useEffect, useState } from "react";
import LeftSide from "../AdminComponent/LeftSide";
import NotifactionAdmin from "../AdminComponent/NotifactionAdmin";

function ViewOrderDetails() {
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false); // Track loading state
  
    useEffect(() => {
      const fetchorderDetails = async () => {
        const displayorderId = sessionStorage.getItem("displayorderId");
    
        try {
          const response = await fetch(`${apiUrl}/order-api/orders/${displayorderId}`,{
            headers: {
                "x-api-key": process.env.REACT_APP_API_KEY, // Use environment variable
            },
        });
          if (!response.ok) {
            throw new Error(await response.text());
          }
    
          const data = await response.json();
          setOrderDetails(data);
        } catch (err) {
          console.error("Error fetching Order details:", err.message);
        }
      };
    
      fetchorderDetails();
    }, [apiUrl]);

    const handleSendEmail = () => {
      setLoading(true); 
      const userEmail = orderDetails.email;
      const orderDetailsToSend = orderDetails;
    
      fetch(`${apiUrl}/order-api/send-order-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderDetails: orderDetailsToSend,
          userEmail: userEmail,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false); 
          if (data.success) {
            alert("Email sent successfully!");
          } else {
            alert("Failed to send email.");
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error:", error);
          alert("Something went wrong.");
        });
    };

    const handleStatusChange = (orderId, newStatus) => {
      fetch(`${apiUrl}/order-api/update-order-status/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order_status: newStatus }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setOrderDetails((prevOrder) => ({
              ...prevOrder,
              order_status: newStatus,
            }));
          } else {
            alert("Failed to update order status...!")
            console.log("Failed to update order status.");
          }
        })
        .catch((error) => {
          alert("Something went wrong while updating order status....!", error);
          console.log("Something went wrong while updating order status.", error);
        });
    };

    const orderpage = () => {
      sessionStorage.removeItem("displayorderId");
      window.location.href="/displayorder";
    }

    const iconStyle = {
      width: '37px', 
      height: '29px', 
      color: 'black', 
      marginLeft: '11px',
      marginTop: '0px',
      cursor: 'pointer',
      marginBottom: '-8px',
    };

  return (

    <>
      <LeftSide/>
        <div className="bord">
          <section className="breadcrumb-option">
              <div className="container">
                  <div className="row">
                      <div className="col-lg-12">
                          <div className="breadcrumb__text">
                              <h4> Order Detils </h4>
                              <div className="breadcrumb__links">
                                  <a href="/dashboard"> Dashboard </a>
                                  <a href="/displayorder"> Order </a>
                                  <span>Order Detils</span>
                              </div>
                          </div>
                      </div>
                      <NotifactionAdmin/>
                  </div>
              </div>
          </section>

          <div className="container">
            {orderDetails ? (
              <>
                  <p className="order-item"> <button className="btn btn-outline-dark mt-3" onClick={orderpage}>Back</button></p>
                
                {/* Order Detils Start */}
                  <div className="container mt-3">
                    <h3 className="order-title mb-2">Order Details</h3>
                    <hr/>
                      <div className="row">
                        <div className="col-lg-5">
                          <p className="order-item"> <strong> Order ID : </strong> {orderDetails._id}</p>
                          <p className="order-item"> <strong> Total Amount : </strong> {orderDetails.totalAmount}</p>
                          <p className="order-item"> <strong> Order Status : </strong> {orderDetails.order_status}</p><p className="order-item">  
                            <select 
                              value={orderDetails.order_status}
                              onChange={(e) => handleStatusChange(orderDetails._id, e.target.value)}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </p>
                          <p className="order-item"> <strong> Order notes : </strong> {orderDetails.note}</p>                
                          <button
                              type="button"
                              className="btn sendmsg"
                              onClick={handleSendEmail}
                              disabled={loading}
                            >
                              {loading ? "Processing..." : "Send Process"}
                          <lord-icon
                              src="https://cdn.lordicon.com/hmqxevgf.json"
                              trigger="hover"
                              state="hover-slide"
                              style={iconStyle}>
                          </lord-icon>
                          </button>
                        </div>

                        <div className="col-lg-5">
                          <div className="product-list">
                            {Array.isArray(orderDetails.products) ? (
                                <ul className="product-items">
                                  {orderDetails.products.map((product, i) => (
                                      <li key={i} className="product-item">
                                        <div className="product-image-container">
                                            <img className="product-image" src={product.Product_img[0]} alt="Loading..." />
                                            <div className="product-text">
                                                <p className="product-name">{product.product_name}</p>
                                                <p className="product-details">{product.quantity} x {product.price}</p>
                                                <p className="product-name"> Size : {product.selectedSize}</p>
                                            </div>
                                        </div>
                                      </li>
                                  ))}
                                </ul>
                              ) : (
                                  "No products"
                              )}
                            </div>
                          </div>
                        </div>
                    </div>
                  {/* Order Detils End */}

                
                  <h3 className="order-title mb-2">User Details</h3>
                  <hr/>
                  {/* User Detils Start */}
                  <div className="row">
                    <div className="col-lg-5">
                      <p className="order-item"> <strong> User ID : </strong> {orderDetails.user_id}</p>
                      <p className="order-item"> <strong> Registrat User Name : </strong> {orderDetails.UserName}</p>
                      <p className="order-item"> <strong> Billing Name : </strong> {orderDetails.Name}</p>
                      <p className="order-item"> <strong> User Email : </strong> {orderDetails.email}</p>
                      <p className="order-item"> <strong> Contact Number : </strong> {orderDetails.contactnumber}</p>
                    </div>
                    <div className="col-lg-5">
                      <p className="order-item"> <strong> Address : </strong> {orderDetails.address}</p>
                      <p className="order-item"> <strong> State : </strong> {orderDetails.state}</p>
                      <p className="order-item"> <strong> City : </strong> {orderDetails.city}</p>
                      <p className="order-item"> <strong> ZipCode : </strong> {orderDetails.zipcode}</p>
                    </div>
                  </div>
                {/* User Detils End */}

                {/* Payment Detils Start */}
                  <h3 className="order-title mb-2">Payment Details</h3>
                  <hr/>
                  {/* User Detils Start */}
                  <div className="row">
                    <div className="col-lg-12">
                      <p className="order-item"> <strong>Method : </strong> {orderDetails.paymentMethod}</p>
                      <div>
                        {Array.isArray(orderDetails.paymentDetails) ? (
                          <ul className="product-items">
                            {orderDetails.paymentDetails.map((payment, i) => (
                                <>
                                  <div className="row">
                                    <div className="col-lg-4">
                                      <p className="order-item"> <strong> Payment Method : </strong> {payment.method}</p>
                                      <p className="order-item"> <strong> Payment bank : </strong> {payment.bank || null}</p>
                                      <p className="order-item"> <strong> Payment wallet : </strong> {payment.wallet || null}</p>
                                      <p className="order-item"> <strong> Payment vpa : </strong> {payment.vpa || null}</p>
                                      <p className="order-item"> <strong> Payment fee : </strong> {payment.fee}</p>
                                      <p className="order-item"> <strong> Payment tax : </strong> {payment.tax}</p>
                                      
                                    </div>
                                    <div className="col-lg-6">
                                      <p className="order-item"> <strong> Payment Status : </strong> {payment.paymentStatus}</p>
                                      <p className="order-item"> <strong> Payment ID : </strong>  {payment.payment_id}</p>
                                      <p className="order-item"> <strong> Order ID : </strong> {payment.order_id} </p>
                                      <p className="order-item"> <strong> Signature ID : </strong> {payment.signature}</p>
                                      <p className="order-item"> 
                                        <strong>Payment Date :</strong> {new Date(payment.paymentDate).toLocaleString("en-IN", { 
                                          timeZone: "Asia/Kolkata", 
                                          year: "numeric", 
                                          month: "long", 
                                          day: "numeric", 
                                          hour: "2-digit", 
                                          minute: "2-digit", 
                                          second: "2-digit",
                                          hour12: true 
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                </>
                            ))}
                            </ul>
                        ) : (
                            "No Payment Data Avilable"
                        )}
                      </div>
                    </div>
                  </div>
                <hr/>
              </>
            ) : (
                <p className="loading-text">Loading order details...</p>
              )}
          </div>
        </div>
    </>
  );
}

export default React.memo(ViewOrderDetails);