import Footer from "../component/Footer";
import Header from "../component/Header";
import React from "react";

function PaymentFailure() {

  const navigateHome = () => {
    sessionStorage.removeItem('cart');
    window.location.href = "/";
  };

  return (
    <>
      <Header />
      <div className="failure-container">
        <div className="failure-message">
          <div className="failure-character">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
              <circle cx="50" cy="50" r="40" fill="lightgray" className="failure-circle"/>
              <circle cx="40" cy="40" r="5" fill="black"/>
              <circle cx="60" cy="40" r="5" fill="black"/>
              <path d="M35,60 Q50,50 65,60" stroke="black" strokeWidth="2" fill="transparent"/>
            </svg>
          </div>
          <p>Payment Failed...!</p>
          <p>Your order has been Failed...!</p>
          <button className="btn-error" onClick={navigateHome}>
            Go to Homepage
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PaymentFailure;