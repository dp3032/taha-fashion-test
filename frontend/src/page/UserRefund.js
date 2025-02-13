import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";

function UserRefund() {
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const [refundes, Setorderfund] = useState([]); // Initialize as an empty array
    const user_id = sessionStorage.getItem('user_id');

    useEffect(() => {
        if (!user_id) {
            alert("Login is required....!");
            return;
        }

        axios.get(`${apiUrl}/get-user-refund?user_id=${user_id}`,{
            headers: {
                "x-api-key": process.env.REACT_APP_API_KEY, // Use environment variable
            },
        })
            .then(response => {
                if (response.data.success) {
                    Setorderfund(response.data.refundes || []); // Ensure it's always an array
                } else {
                    Setorderfund([]); // Ensure no invalid state
                }
            })
            .catch(err => {
                console.error("Order fetch failed:", err);
                Setorderfund([]); 
            });
    }, [user_id , apiUrl]);

    const returnpage = () => {
        window.location.href = "/myreturn";
    };

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
                                    <a href="/myorder"> My Order </a>
                                    <span>Refund Order</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="refundbtnn">
                <button className="btn btn-outline-dark ml-4 orderetu" onClick={returnpage}> View Return Order </button>
            </div>

            {refundes && refundes.length === 0 ? (  // Check if refundes is not undefined and has length
                <p className="errororder">No Refund found....</p>
            ) : (
                refundes.length > 0 && (
                    <>  
                        <h3 className="text-center mt-5 mb-3">Refund Order</h3>
                        {refundes.map((refund) => (  // No need to reverse here
                            <div key={refund._id} className="col-lg-12">
                                <div className="order-item-card">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <p>
                                                <strong>Refund ID : </strong>
                                                {refund._id}
                                            </p>
                                            <p>
                                                <strong>Order ID : </strong>
                                                {refund.order_id}
                                            </p>
                                            <p>
                                                <strong>User ID : </strong>
                                                {refund.user_id}
                                            </p>
                                            <p>
                                                <strong>Total Amount : </strong>
                                                {refund.totalAmount}
                                            </p>
                                            <p>
                                                <strong>Payment Method : </strong>
                                                {refund.paymentMethod}
                                            </p>
                                            <p>
                                                <strong>Order Date : </strong>
                                                {refund.order_date}
                                            </p>
                                            <p>
                                                <strong>Refund Date : </strong>
                                                {refund.refund_date}
                                            </p>
                                        </div>

                                        <div className="col-lg-6">
                                            <ul className="order-product-list">
                                                {refund.products.map((product, index) => (
                                                    <li key={index}>
                                                        <img src={product.Product_img[0]} alt="Loading..." style={{ width: 100 }} />
                                                        <p>
                                                            <strong>{product.product_name}</strong>
                                                            <br />
                                                            <strong>Quantity : </strong>{product.quantity}
                                                            <br />
                                                            <strong>Price : </strong>{product.price}
                                                        </p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="refund-status">
                                        <strong>Refund Status: </strong>
                                        <div style={{
                                                backgroundColor: 
                                                    refund.Refund_status === 'Refund' ? 'green' :
                                                    refund.Refund_status === 'Pending' ? 'Aqua' :
                                                    refund.Refund_status === 'Request-Accpet' ? 'blue' : 'inherit',
                                                color: 
                                                    refund.Refund_status === 'Refund' ? 'white' :
                                                    refund.Refund_status === 'Pending' ? 'black' :
                                                    refund.Refund_status === 'Request-Accpet' ? 'white' : 'inherit',
                                                textAlign: 'center', fontSize:'20px',
                                            }}>
                                            {refund.Refund_status}
                                        </div>
                                        <p> Note : If Any Query Please <a href="/contacts" className="contctlink">  Contact Us  </a> </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )
            )}

            <Footer />
        </>
    );
}

export default React.memo(UserRefund);
