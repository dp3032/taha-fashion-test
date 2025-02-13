// import React from 'react'
//  import axios from "axios";
//  import Footer from "../component/Footer";
//  import { useCart } from '../page/CartContext'; 
//  import { useEffect, useState } from 'react';
//  import Header from "../component/Header";

// export const phonepepayment = () => {
//      const apiUrl = process.env.REACT_APP_BASE_URL;
//          const { cart } = useCart();   
//          const [Name, setName] = useState("");
//          const [email, setEmail] = useState("");
//          const [address, setAddress] = useState("");
//          const [city, setCity] = useState("");
//          const [state, setState] = useState("");
//          const [zipcode, setZipcode] = useState("");
//          const [contactnumber, setContactnumber] = useState("");
//          const [note, setNote] = useState("");
//          const [paymentMethod, setPaymentMethod] = useState("");
    
        
//          const charge = 100; 
//          const totalAmount = Object.values(cart).reduce(
//              (total, item) => total + item.Product_price * item.quantity, 
//              0
//          ) + charge;
    
//          useEffect(() => {
//                  const user_id = sessionStorage.getItem('user_id'); 
//                  if (!user_id) {
//                      alert("Login is !");
//                      window.location.href = "/login";
//                  }
//              }, []);
    
//                const data = {
//                  user_id: sessionStorage.getItem("user_id"),
//                  UserName: sessionStorage.getItem("name"),
//                  Name,
//                  email,
//                  address,
//                  city,
//                  state,
//                  zipcode,
//                  contactnumber,
//                  note,
//                  products: Object.values(cart).map(item => ({
//                      product_id: item._id,
//                      product_name: item.Product_name,
//                      quantity: item.quantity,
//                      selectedSize: item.selectedSize,
//                      price: item.Product_price,
//                      Product_img: item.Product_img,
//                  })),
//                  amount: totalAmount,
//                  paymentMethod,
//                  MID: 'MID' + Date.now(),
//                  transactionId: 'T' + Date.now()
//              };
            
//              const handleSubmit = async (e) => {
//                  e.preventDefault();
//                  sessionStorage.removeItem("cart");
//                  try {
//                      const res = await axios.post(`${apiUrl}/ordertest`, data); 
            
//                       console.log("Backend Response:", res.data);
            
//                      if (res.data.success) {
//                          const redirectUrl = res.data.redirectUrl;
//                          if (redirectUrl) {
                            
//                              window.location.href = redirectUrl;
//                          } else {
//                              alert("Redirect URL not found. Please try again.");
//                          }
//                      } else {
//                          alert("Payment initiation failed. Please try again.");
//                      }
//                  } catch (error) {
//                      console.error("Error during payment initiation:", error.message);
//                      alert("An error occurred while processing the payment. Please try again.");
//                  }
//              };
//     return (
//     <>
//              <Header/>

//             <section className="breadcrumb-option">
//                  <div className="container">
//                      <div className="row">
//                         <div className="col-lg-12">
//                             <div className="breadcrumb__text">
//                                  <h4>Check Out</h4>
//                                  <div className="breadcrumb__links">
//                                      <a href="/">Home</a>
//                                      <a href="/shop">Shop</a>
//                                      <span>Check Out</span>
//                                  </div>
//                              </div>
//                          </div>
//                      </div>
//                  </div>
//              </section>

//              <section className="checkout spad">
//                  <div className="container">
//                      <div className="checkout__form">
//                          <form onSubmit={handleSubmit}>
//                              <div className="row">
//                                  <div className="col-lg-8 col-md-6">
//                                      <h6 className="checkout__title">Billing Details</h6>
//                                      <div className="row">
//                                          <div className="col-lg-6">
//                                              <div className="checkout__input">
//                                                  <p>Name<span>*</span></p>
//                                                  <input
//                                                      type="text"
//                                                      placeholder="Name"
//                                                      value={Name}
//                                                      onChange={(e) => setName(e.target.value)}
//                                                  />
//                                              </div>
//                                          </div>
//                                          <div className="col-lg-6">
//                                              <div className="checkout__input">
//                                                  <p>Email<span>*</span></p>
//                                                  <input
//                                                      type="email"
//                                                      placeholder="Email"
//                                                      pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
//                                                      value={email}
//                                                      onChange={(e) => setEmail(e.target.value)}
//                                                  />
//                                              </div>
//                                          </div>
//                                      </div>
//                                      <div className="checkout__input">
//                                          <p>Address<span>*</span></p>
//                                          <input
//                                              type="text"
//                                              placeholder="Address"
//                                              className="checkout__input__add"
//                                              value={address}
//                                              onChange={(e) => setAddress(e.target.value)}
//                                          />
//                                      </div>
//                                      <div className="row">
//                                          <div className="col-lg-6">
//                                              <div className="checkout__input">
//                                                  <p>State<span>*</span></p>
//                                                  <input type="text" 
//                                                      value={state}
//                                                      onChange={(e) => setState(e.target.value)}
//                                                      placeholder="Country/State Name" />
//                                              </div>
//                                          </div>
//                                          <div className="col-lg-6">
//                                              <div className="checkout__input">
//                                                  <p>City<span>*</span></p>
//                                                  <input type="text"
//                                                      value={city}
//                                                      onChange={(e) => setCity(e.target.value)} 
//                                                      placeholder="Town/City Name" />
//                                              </div>
//                                          </div>
//                                      </div>
//                                      <div className="row">
//                                          <div className="col-lg-6">
//                                              <div className="checkout__input">
//                                                  <p>Postcode<span>*</span></p>
//                                                  <input type="text" 
//                                                      value={zipcode}
//                                                      onChange={(e) => setZipcode(e.target.value)}
//                                                      placeholder="Postcode/Zip Code" />
//                                              </div>
//                                          </div>
//                                          <div className="col-lg-6">
//                                              <div className="checkout__input">
//                                                  <p>Contact Number<span>*</span></p>
//                                                  <input type="tel" 
//                                                      value={contactnumber}
//                                                      onChange={(e) => setContactnumber(e.target.value)}
//                                                      placeholder="Contact Number" />
//                                              </div>
//                                          </div>
//                                      </div>
//                                      <div className="checkout__input">
//                                          <p>Order notes<span></span></p>
//                                          <input type="text"
//                                              value={note}
//                                              onChange={(e) => setNote(e.target.value)}
//                                              placeholder="special notes for order and delivery..." />
//                                       </div>
//                                       <div className="checkout__input">
//                                          <p>All Filed Is Required<span>*</span></p>
//                                       </div>
//                                  </div>
                                
//                                  <div className="col-lg-4 col-md-6">
//                                      <div className="checkout__order">
//                                          <h4 className="order__title">Your order</h4>
//                                          <ul className="checkout__total__all">
//                                              <li>Total <span>{totalAmount.toFixed(2)}</span></li>
//                                          </ul>
//                                          <div className="checkout__input__checkbox">
//                                              <div className="form-check">
//                                                  <input
//                                                      className="form-check-input"
//                                                      type="radio"
//                                                      name="paymentMethod"
//                                                      value="Online"
//                                                      id="flexRadioDefault2"
//                                                      onChange={() => setPaymentMethod('Online')}
                                                    
//                                                  />
//                                                  <label className="form-check-label" htmlFor="flexRadioDefault2">
//                                                      Online
//                                                  </label>
//                                              </div>
//                                          </div>
//                                          <button type="submit" className="site-btn">PLACE ORDER</button>
//                                      </div>
//                                  </div>
//                              </div>
//                          </form>
//                      </div>
//                  </div>
//              </section>

//              <Footer />
//     </>
//   )
// }
