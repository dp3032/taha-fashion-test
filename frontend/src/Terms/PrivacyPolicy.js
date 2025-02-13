import React from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";
function PrivacyPolicy(){
    return (
        <>
            <Header/>
                <section className="breadcrumb-option">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="breadcrumb__text">
                                    <h4>Privacy Policy</h4>
                                        <div className="breadcrumb__links">
                                            <a href="/">Home</a>
                                            <span>Privacy Policy</span>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container">
                    <div className="privacy-policy-container">
                        <h1 className="policy-title mb-3"> <u> Privacy Policy for Taha Fashion </u></h1>
                        <p className="policy-date"><strong>Effective Date:</strong> [01/02/2025]</p>

                        <p className="policy-intro">
                            Welcome to <strong>Taha Fashion</strong>! Your privacy is important to us. This Privacy Policy
                            explains how we collect, use, and protect your personal information when you visit or make a purchase on our website.
                        </p>

                        <h2 className="policy-heading">1. Information We Collect</h2>
                        <ul className="policy-list">
                            <li><strong>Personal Information:</strong> Name, email, phone number, shipping and billing address, and payment details.</li>
                            <li><strong>Account Information:</strong> Login credentials and user preferences.</li>
                            <li><strong>Order Information:</strong> Purchase history, order details, and transaction records.</li>
                            <li><strong>Technical Information:</strong> IP address, browser type, and browsing activity through cookies.</li>
                            <li><strong>Communication Data:</strong> Messages, customer service interactions, and feedback.</li>
                        </ul>

                        <h2 className="policy-heading">2. How We Use Your Information</h2>
                        <p className="policy-use">
                            We use your data to:
                        </p>
                        <ul className="policy-list">
                            <li>Process and fulfill your orders.</li>
                            <li>Provide customer support and respond to inquiries.</li>
                            <li>Improve our Website, services, and user experience.</li>
                            <li>Send promotional offers.</li>
                        </ul>

                        <h2 className="policy-heading">3. Sharing Your Information</h2>
                        <p className="policy-sharing">
                            We do not sell or rent your personal data. However, we may share your information with:
                        </p>
                        <ul className="policy-list">
                            <li><strong>Service Providers:</strong> Payment processors, shipping partners, and marketing agencies.</li>
                            <li><strong>Legal Authorities:</strong> If required by law or to protect our rights.</li>
                            <li><strong>Business Transfers:</strong> In case of a merger, acquisition, or sale of assets.</li>
                        </ul>

                        <h2 className="policy-heading">4. Cookies & Tracking Technologies</h2>
                        <p className="policy-cookies">
                            We use cookies to enhance your browsing experience. You can manage cookie preferences through your browser settings.
                        </p>

                        <h2 className="policy-heading">5. Data Security</h2>
                        <p className="policy-security">
                            We implement industry-standard security measures to protect your personal data. However, no method of transmission over the internet is 99% secure.
                        </p>

                        <h2 className="policy-heading">6. Your Rights & Choices</h2>
                        <p className="policy-rights">
                            You have the right to:
                        </p>
                        <ul className="policy-list">
                            <li>Request data deletion (subject to legal requirements).</li>
                        </ul>

                        <h2 className="policy-heading">7. Third-Party Links</h2>
                        <p className="policy-links">
                            Our Website may contain links to third-party sites. We are not responsible for their privacy practices.
                        </p>

                        <h2 className="policy-heading">8. Contact Us</h2>
                        <p className="policy-contact">
                            For any questions contact us at:
                        </p>
                        <p className="policy-contact-info">📧 <strong>Email:</strong> [Insert Your Email]</p>
                        <p className="policy-contact-info">📞 <strong>Phone:</strong> [Insert Your Contact Number]</p>

                        <p className="policy-footer">By using <strong>Taha Fashion</strong>, you agree to this Privacy Policy.</p>
                    </div>
                </div>

            <Footer/>
      </>
    );
  }
export default React.memo(PrivacyPolicy);
