import Footer from "../component/Footer";
import Header from "../component/Header";
import React from "react";

function ThankYouPage() {

  const navihome = () => {
    sessionStorage.removeItem('cart');
    window.location.href = "/";
  };

  return (
    <>
      <Header />
      <div className="thank-you-container">
        <div className="thank-you-message">
          <div className="character-animation">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
              <circle cx="50" cy="50" r="40" fill="yellow" className="animated-circle"/>
              <circle cx="40" cy="40" r="5" fill="black"/>
              <circle cx="60" cy="40" r="5" fill="black"/>
              <path d="M35,60 Q50,75 65,60" stroke="black" strokeWidth="2" fill="transparent"/>
            </svg>
          </div>
          <p>Thank You for Your Purchase!</p>
          <p>Your order has been successfully placed.</p>
          <button className="btn btn-outline-success animated-button" onClick={navihome}>
            Go to Homepage
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ThankYouPage;
