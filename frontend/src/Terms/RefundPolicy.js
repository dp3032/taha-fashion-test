import React from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";
function RefundPolicy(){
    return (
        <>
            <Header/>
                <section className="breadcrumb-option">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="breadcrumb__text">
                                    <h4>Refund Policy</h4>
                                        <div className="breadcrumb__links">
                                            <a href="/">Home</a>
                                            <span>Refund Policy</span>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container">
                    <div className="privacy-policy-container">
                        <h1 className="policy-title mb-3"> <u> Refund Policy for Taha Fashion </u></h1>
                        <p className="policy-date"><strong>Effective Date :</strong> [01/02/2025]</p>

                        <p className="policy-intro">
                            At <strong> Taha Fashion </strong>, we specialize in creating custom-made garments tailored to our customers' unique preferences. Since our products are customized as per individual requirements, we do not accept returns. However, we are committed to providing the best fit and quality, which is why we offer free alterations on the same product if required.
                        </p>

                        <h2 className="policy-heading">1. No Return & No Refund Policy</h2>
                        <ul className="policy-list">
                            <li>
                                As each product is made-to-order based on customer specifications,
                                measurements, and preferences, we do not accept returns or 
                                provide refunds. Since our garments are not mass-produced or 
                                resellable, returning them is not possible.
                            </li>
                            <li>
                                We encourage customers to carefully check their measurements and requirements before placing an order to avoid any misunderstandings.
                            </li>
                        </ul>

                        <h2 className="policy-heading">2. Alteration Policy</h2> 
                        <p className="policy-intro">
                            To ensure that your custom-made outfit fits you perfectly, we provide a free alteration service for the same product under the following conditions :
                        </p>
                        <ul className="policy-list">
                            <li>
                                <strong>Fit Issues :</strong> 
                                    If the delivered product does not fit as expected, we will alter it free of charge to make necessary adjustments.
                            </li>
                            <li>
                                <strong>Quality Assurance :</strong> 
                                If there is any mistake from our side (e.g., incorrect stitching, wrong size compared to given measurements, or color variation), we will correct it at no additional cost.
                            </li>
                        </ul>
                        <p>
                            <strong>Conditions for Alteration :</strong>
                        </p>
                        <ul   className="policy-list">
                            <li>
                                The request for alteration must be made within 7 days of receiving the product.
                            </li>
                            <li>
                                The garment should be in its original condition (unused, unwashed, and undamaged).
                            </li>
                            <li>
                                Alterations are limited to adjustments in fitting; we do not change the design, fabric, or style of the product after delivery.
                            </li>
                            <li>
                                If incorrect measurements were provided by the customer, an alteration charge may apply based on the required modifications.
                            </li>
                        </ul>

                        <h2 className="policy-heading">3. Important Guidelines for Customers</h2>
                        <p className="policy-intro">
                            To ensure a smooth experience and avoid misunderstandings, we request customers to follow these guidelines :
                        </p>
                        <ul  className="policy-list">
                            <li> 
                                <strong>Provide Accurate Measurements : </strong> 
                                    Since all our garments are custom-stitched, accurate measurements are essential for a perfect fit. Please refer to our measurement guide before placing your order.
                            </li>
                            <li> 
                                <strong>Color & Fabric Disclaimer :</strong> 
                                    Slight variations in fabric color may occur due to different screen resolutions or lighting conditions. We ensure high-quality fabrics, but exact color matching may not always be possible.
                            </li>
                            <li> 
                                <strong>Order Processing & Delivery :</strong> 
                                    Since we create each outfit uniquely, our processing time may vary depending on the customization level. We ensure timely delivery but appreciate patience for intricate designs.
                            </li>
                        </ul>

                        <h2 className="policy-heading">4. Order Cancellation Policy</h2>
                        <ul  className="policy-list">
                            <li>
                                Once an order is placed, we immediately begin the customization process. Due to this, orders cannot be canceled or modified once they are confirmed.
                            </li>
                        </ul>

                        <h2 className="policy-heading">5. Contact Us</h2>
                        <p className="policy-contact">
                            If you have any questions regarding our refund policy or need assistance with a return, feel free to contact us:
                        </p>
                        <p className="policy-contact-info">📧 <strong>Email :</strong> [Insert Your Email]</p>
                        <p className="policy-contact-info">📞 <strong>Phone :</strong> [Insert Your Contact Number]</p>

                        {/* <p className="policy-footer">By using <strong>Taha Fashion</strong>, you agree to this Privacy Policy.</p> */}
                    </div>
                </div>

            <Footer/>
      </>
    );
  }

export default React.memo(RefundPolicy);
