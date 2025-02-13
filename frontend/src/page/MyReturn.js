import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";

function MyReturn() {
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const [returnorder, Setordereturn] = useState([]); 
    const user_id = sessionStorage.getItem('user_id');

    useEffect(() => {
        if (!user_id) {
            alert("Login is required....!");
            return;
        }

        axios.get(`${apiUrl}/get-user-return?user_id=${user_id}`, {
            headers: {
                "x-api-key": process.env.REACT_APP_API_KEY, 
            },
        })
        .then(response => {
            if (response.data.success) {
                Setordereturn(response.data.returnord || []); 
            } else {
                Setordereturn([]); 
            }
        })
        .catch(err => {
            console.error("Order fetch failed:", err);
            Setordereturn([]); 
        });
    }, [user_id , apiUrl]);

    
    
    const refundpage = () => {
        window.location.href = "/userrefund";
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
                                    <span>Return Order</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="refundbtnn">
                <button className="btn btn-outline-dark" onClick={refundpage}> View Cancelled/Refund </button>
            </div>


            {returnorder && returnorder.length === 0 ? (  // Check if refundes is not undefined and has length
                <p className="errororder">No Return found....</p>
            ) : (
                returnorder.length > 0 && (
                    <>  
                        <h3 className="text-center mt-5 mb-3">Return Order</h3>
                        {returnorder.map((returnorder) => (  // No need to reverse here
                            <div key={returnorder._id} className="col-lg-12">
                                <div className="order-item-card">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <p>
                                                <strong>Return ID : </strong>
                                                {returnorder._id}
                                            </p>
                                            <p>
                                                <strong>Order ID : </strong>
                                                {returnorder.order_id}
                                            </p>
                                            <p>
                                                <strong>User ID : </strong>
                                                {returnorder.user_id}
                                            </p>
                                            <p>
                                                <strong>Total Amount : </strong>
                                                {returnorder.totalAmount}
                                            </p>
                                            <p>
                                                <strong>Order Date : </strong>
                                                {returnorder.order_date}
                                            </p>
                                            <p>
                                                <strong>Order Return Date : </strong>
                                                {returnorder.Retunorder_date}
                                            </p>
                                            <p>
                                                <strong>Order Return Reason : </strong>
                                                {returnorder.reason}
                                            </p>
                                        </div>

                                        <div className="col-lg-6">
                                            <ul className="order-product-list">
                                                {returnorder.products.map((product, index) => (
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
                                        <strong>Return Status: </strong>
                                        <div style={{
                                                backgroundColor: 
                                                    returnorder.Retunorder_status === 'Refund' ? 'green' :
                                                    returnorder.Retunorder_status === 'Pending' ? 'Aqua' :
                                                    returnorder.Retunorder_status === 'Request-Accpet' ? 'blue' : 'inherit',
                                                color: 
                                                    returnorder.Retunorder_status === 'Refund' ? 'white' :
                                                    returnorder.Retunorder_status === 'Pending' ? 'black' :
                                                    returnorder.Retunorder_status === 'Request-Accpet' ? 'white' :'inherit',
                                                textAlign: 'center', fontSize:'20px',
                                            }}>
                                            {returnorder.Retunorder_status}
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

export default React.memo(MyReturn);
