import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from "../component/Footer";
import { useCart } from '../page/CartContext'; 
import Header from "../component/Header";
import config from "../config";

const Checkout = () => {
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY;
  const { cart } = useCart();
  const [Name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [contactnumber, setContactnumber] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Online');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  const charge = config.SHIPPING_CHARGE;
  const totalAmount = Object.values(cart).reduce(
    (total, item) => total + item.Product_price * item.quantity, 
    0
  ) + charge;

  useEffect(() => {
    const user_id = sessionStorage.getItem('user_id');
    if (!user_id) {
      alert("Login is required!");
      window.location.href = "/login";
    }
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    await handleRazorpayPayment();
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert('Razorpay SDK failed to load. Please check your internet connection.');
      setLoading(false);
      return;
    }
    try {
      const data = {
        user_id: sessionStorage.getItem('user_id'),
        UserName: sessionStorage.getItem('name'),
        Name,
        email,
        address,
        city,
        state,
        zipcode,
        paymentMethod,
        contactnumber,
        note,
        products: Object.values(cart).map(item => ({
          product_id: item._id,
          product_name: item.Product_name,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          price: item.Product_price,
          Product_img: item.Product_img,
        })),
        amount: totalAmount,
      };
  
      const response = await axios.post(`${apiUrl}/order-api/save-order`, data, {
        headers: {
          "x-api-key": process.env.REACT_APP_API_KEY,
        },
      });
  
      if (response.data.success) {
        const { id, amount } = response.data;
  
        const options = {
          key: razorpayKey,
          amount: amount * 100,
          currency: 'INR',
          name: 'Taha Fashion',
          description: 'Order Payment',
          order_id: id,
          handler: async function (paymentResponse) {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = paymentResponse;
  
            const verificationPayload = {
              payment_id: razorpay_payment_id,
              order_id: razorpay_order_id,
              signature: razorpay_signature,
              orderDetails: data,
            };
            
          try {
              const verificationResponse = await axios.post(`${apiUrl}/order-api/verify-payment`, verificationPayload, {
                headers: { "x-api-key": process.env.REACT_APP_API_KEY },
              });
          
              console.log("Verification Response:", verificationResponse.data);
          
              if (verificationResponse.data.success) {
                sessionStorage.removeItem('cart');
                window.location.replace('/paymentsuccess');
              } else {
                console.error("Verification failed, redirecting to failure page");
                window.location.replace('/paymentfailure');
              }
          } catch (error) {
              console.error("Verification request failed", error);
              window.location.replace('/paymentfailure');
          }          
          },
          prefill: {
            name: Name,
            email: email,
            contact: contactnumber,
          },
          theme: { color: '#F37254' },
          modal: {
            ondismiss: function () {
              window.location.replace('/paymentfailure');
            },
          },
        };
  
        const razorpay = new window.Razorpay(options);
  
        // Razorpay's built-in failure event
        razorpay.on('payment.failed', function () {
          window.location.replace('/paymentfailure');
        });
  
        razorpay.open();
      } else {
        alert('Order creation failed.');
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!Name) newErrors.Name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is not valid';
    if (!address) newErrors.address = 'Address is required';
    if (!city) newErrors.city = 'City is required';
    if (!state) newErrors.state = 'State is required';
    if (!zipcode) newErrors.zipcode = 'Zipcode is required';
    else if (!/^\d{6}$/.test(zipcode)) newErrors.zipcode = 'Zipcode must be 6 digits';
    if (!contactnumber) newErrors.contactnumber = 'Contact number is required';
    if (!paymentMethod) newErrors.paymentMethod = 'Payment method is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <>
      <Header />
      <section className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4>Check Out</h4>
                <div className="breadcrumb__links">
                  <a href="/">Home</a>
                  <a href="/shop">Shop</a>
                  <span>Check Out</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="checkout spad">
        <div className="container">
          <div className="checkout__form">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-8 col-md-6">
                  <h6 className="checkout__title">Billing Details</h6>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="checkout__input">
                        <p>Name<span>*</span></p>
                        <input
                          type="text"
                          placeholder="Name"
                          value={Name}
                          onChange={(e) => setName(e.target.value)}
                        />
                        {errors.Name && <span className="errorcon">{errors.Name}</span>}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="checkout__input">
                        <p>Email<span>*</span></p>
                        <input
                          type="email"
                          placeholder="Email"
                          pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <span className="errorcon">{errors.email}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="checkout__input">
                    <p>Address<span>*</span></p>
                    <input
                      type="text"
                      placeholder="Address"
                      className="checkout__input__add"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    {errors.address && <span className="errorcon">{errors.address}</span>}
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="checkout__input">
                        <p>State<span>*</span></p>
                        <input
                          type="text"
                          placeholder="State Name"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                        />
                        {errors.state && <span className="errorcon">{errors.state}</span>}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="checkout__input">
                        <p>City<span>*</span></p>
                        <input
                          type="text"
                          placeholder="City Name"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                        {errors.city && <span className="errorcon">{errors.city}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="checkout__input">
                        <p>Zipcode<span>*</span></p>
                        <input
                          type="text"
                          placeholder="Zipcode"
                          pattern="\d{6}"
                          value={zipcode}
                          onChange={(e) => setZipcode(e.target.value.replace(/\D/g, ''))} // Removes non-digit characters
                        />
                        {errors.zipcode && <span className="errorcon">{errors.zipcode}</span>}
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="checkout__input">
                        <p>Contact Number<span>*</span></p>
                        <input
                          type="text"
                          placeholder="Contact Number"
                          maxLength="10"
                          value={contactnumber}
                          onChange={(e) => {
                            // Allow only numeric input and ensure max length is 10
                            const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                            setContactnumber(value.slice(0, 10)); }}// Limit to 10 digits
                        />
                        {errors.contactnumber && <span className="errorcon">{errors.contactnumber}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="checkout__input">
                    <p>Order notes<span></span></p>
                    <input
                      type="text"
                      placeholder="Special notes for order and delivery..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="checkout__order">
                    <h4 className="order__title">Your Order</h4>
                    <ul className="checkout__total__all">
                      <li>Total <span>{totalAmount.toFixed(2)}</span></li>
                    </ul>
                    <div className="checkout__input__checkbox">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="onlinePayment"
                          checked={paymentMethod === 'Online'}
                          onChange={() => setPaymentMethod('Online')}
                        />
                        <label className="form-check-label" htmlFor="onlinePayment">
                          Online Payment 
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input disabled-input"
                          type="radio"
                          name="paymentMethod"
                          id="codPayment"
                          disabled
                        />
                        <label className="form-check-label " htmlFor="codPayment">
                          Case On Delivery (Work In Process)
                        </label>
                      </div>
                    </div>
                    <button type="submit" className="site-btn" disabled={loading}>
                      {loading ? 'Processing...' : 'Proceed to Pay'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Checkout;
