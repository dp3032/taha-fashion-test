import React, { useEffect, useState } from "react";
import LeftSide from "../AdminComponent/LeftSide";
import NotifactionAdmin from "../AdminComponent/NotifactionAdmin";

function ViewRefundDetails() {
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const [refundDetails, setRefundDetails] = useState(null);
    const [loading, setLoading] = useState(false); // Track loading state
  
    useEffect(() => {
            const fetchrefundDetails = async () => {
              const displayrefundId = sessionStorage.getItem("displayrefundId");
          
              try {
                const response = await fetch(`${apiUrl}/refundid/${displayrefundId}`,{
                    headers: {
                        "x-api-key": process.env.REACT_APP_API_KEY, // Use environment variable
                    },
                });
                if (!response.ok) {
                  throw new Error(await response.text());
                }
          
                const data = await response.json();
                setRefundDetails(data);
              } catch (err) {
                console.error("Error fetching Refund details:", err.message);
              }
            };
          
            fetchrefundDetails();
          }, [apiUrl]);

          const handleSendEmail = () => {
            setLoading(true); 
            const userEmail = refundDetails.email;
            const orderDetailsToSend = refundDetails;
          
            fetch(`${apiUrl}/send-refund-email`, {
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

          const handleStatusChange = (id, newStatus) => {
            fetch(`${apiUrl}/refund/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ Refund_status: newStatus }),
            })
              .then((response) => response.json())
              .then((updatedData) => {
                setRefundDetails((prevDetails) =>
                  prevDetails && prevDetails._id === id
                    ? { ...prevDetails, Refund_status: newStatus }
                    : prevDetails
                );
              })
              .catch((error) => console.error('Error updating status:', error));
          };
          
          const refundpage = () => {
            sessionStorage.removeItem("displayorderId");
            sessionStorage.removeItem("displayrefundId");
            window.location.href="/orderrefund";
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
                                    <h4> Refund Detils </h4>
                                    <div className="breadcrumb__links">
                                        <a href="/dashboard"> Dashboard </a>
                                        <a href="/orderrefund"> Refund </a>
                                        <span>Refund Detils</span>
                                    </div>
                                </div>
                            </div>
                            <NotifactionAdmin/>
                        </div>
                    </div>
                </section>
                <div className="container">
                {refundDetails ? (
                  <>
                      <p className="order-item"> <button className="btn btn-outline-dark mt-3" onClick={refundpage}>Back</button></p>
                    
                    {/* Order Detils Start */}
                      <div className="container mt-3">
                        <h3 className="order-title mb-2">Order Refund Details</h3>
                        <hr/>
                          <div className="row">
                            <div className="col-lg-5">
                            <p className="order-item"> <strong> Refund ID : </strong> {refundDetails._id}</p>
                              <p className="order-item"> <strong> Order ID : </strong> {refundDetails.order_id}</p>
                              <p className="order-item"> <strong> Total Amount : </strong> {refundDetails.totalAmount}</p>
                              <p className="order-item"> <strong> Refund Date : </strong> {refundDetails.refund_date}</p>
                              <p className="order-item"> <strong> Order Status : </strong> {refundDetails.Refund_status}</p><p className="order-item">  
                                <select 
                                  value={refundDetails.Refund_status}
                                  onChange={(e) => handleStatusChange(refundDetails._id, e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Request-Accpet">Request Accepted</option>
                                    <option value="Refund">Refund</option>
                                </select>
                              </p>
                              <p className="order-item"> <strong> Order notes : </strong> {refundDetails.note}</p>                
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
                                {Array.isArray(refundDetails.products) ? (
                                    <ul className="product-items">
                                      {refundDetails.products.map((product, i) => (
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
                          <p className="order-item"> <strong> User ID : </strong> {refundDetails.user_id}</p>
                          <p className="order-item"> <strong> Registrat User Name : </strong> {refundDetails.UserName}</p>
                          <p className="order-item"> <strong> Billing Name : </strong> {refundDetails.Name}</p>
                          <p className="order-item"> <strong> User Email : </strong> {refundDetails.email}</p>
                          <p className="order-item"> <strong> Contact Number : </strong> {refundDetails.contactnumber}</p>
                        </div>
                        <div className="col-lg-5">
                          <p className="order-item"> <strong> Address : </strong> {refundDetails.address}</p>
                          <p className="order-item"> <strong> State : </strong> {refundDetails.state}</p>
                          <p className="order-item"> <strong> City : </strong> {refundDetails.city}</p>
                          <p className="order-item"> <strong> ZipCode : </strong> {refundDetails.zipcode}</p>
                        </div>
                      </div>
                    {/* User Detils End */}

                    {/* Payment Detils Start */}
                      <h3 className="order-title mb-2">Payment Details</h3>
                      <hr/>
                      {/* User Detils Start */}
                      <div className="row">
                        <div className="col-lg-12">
                          <p className="order-item"> <strong>Method : </strong> {refundDetails.paymentMethod}</p>
                          <div>
                            {Array.isArray(refundDetails.paymentDetails) ? (
                              <ul className="product-items">
                                {refundDetails.paymentDetails.map((payment, i) => (
                                    <>
                                      <div className="row">
                                        <div className="col-lg-4">
                                          <p className="order-item"> <strong> Payment Method : </strong> {payment.method}</p>
                                          <p className="order-item"> <strong> Payment bank : </strong> {payment.bank || null}</p>
                                          <p className="order-item"> <strong> Payment wallet : </strong> {payment.wallet || null}</p>
                                          <p className="order-item"> <strong> Payment vpa : </strong> {payment.vpa || null}</p>
                                          <p className="order-item"> <strong> Payment fee : </strong> {payment.fee}</p>
                                          
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
                    <p className="loading-text">Loading Refund details...</p>
                  )}
              </div>
        </div>
    </>
  );
}

export default React.memo(ViewRefundDetails);
