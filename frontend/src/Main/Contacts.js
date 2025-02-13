import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

function Contacts() {
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const recaptchaSiteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
  const [is_user_login, setIsUserLogin] = useState(false); 
  const [info, Setinfo] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactnumber: "",
    message: "",
  });
  const [captchaToken, setCaptchaToken] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,14}$/;
    if (!formData.name.trim()) {
      alert("Name is required");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return false;
    }
    if (!phoneRegex.test(formData.contactnumber)) {
      alert("Please enter a valid contact number (10-14 digits)");
      return false;
    }
    if (!formData.message.trim()) {
      alert("Message is required");
      return false;
    }
    if (!captchaToken) {
      alert("Please verify that you are not a robot");
      return false;
    }
    return true;
  };

  const handleCaptcha = (token) => {
    setCaptchaToken(token);
  };

  const contactFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    axios
      .post(`${apiUrl}/contact-form-api/contactformdata`, { ...formData, captchaToken })
      .then((res) => {
        if (res.data.flag === 1) {
          alert("Message sent successfully. We will respond soon!");
          window.location.href="/";
        } else {
          alert("Message not sent. Please try again later.");
        }
      })
      .catch((err) => {
        alert("An error occurred while sending the message.",err);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/contact-info-api/contact-info-display-limit`, {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
        });
        const data = await response.json();
        Setinfo(data[0] || {}); // Set the first item if available, else an empty object
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [apiUrl]);

  useEffect(() => {
      // Check if the user is logged in by checking the localStorage value
      const userLoginStatus = sessionStorage.getItem('is_user_login');
      if (userLoginStatus === 'true') {
          setIsUserLogin(true);
      } else {
          setIsUserLogin(false);
      }
    }, []); 

        const loginredirt = () => {
          window.location.href="/login";
        }

  return (
    <>
      <Header />
      {/* Breadcrumb Start */}
      <section className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4>Contact</h4>
                <div className="breadcrumb__links">
                  <a href="/"> Home </a>
                  <span>Contact Us</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Breadcrumb End */}

      <div className="map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d459.0138682122999!2d72.6197225088352!3d23.019698282469918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e867e6f063347%3A0xf5605f75ffa87b1a!2sTaha%20Fashion%20Studio!5e0!3m2!1sen!2sin!4v1738386613453!5m2!1sen!2sin" 
          className="imap"
          title="map"
        ></iframe>
      </div>

      <section className="contact spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <div className="contact__text">
                <div className="section-title">
                  <span>Information</span>
                  <h2>Contact Us</h2>
                  <p>
                  Have a question or need more information? Feel free to reach out, and we'll get back to you as soon as possible!
                  </p>
                </div>
                <ul>
                  <li>
                    <h4>Address</h4>
                    <p>{info.Info_address || 'N/A'}</p>
                  </li>
                  <li>
                    <h4>Email</h4>
                    <p>{info.Info_email || 'N/A'}</p>
                  </li>
                  <li>
                    <h4>Contact Number</h4>
                    <p>{info.Info_contact || 'N/A'}</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="contact__form">
                <form onSubmit={contactFormSubmit} method="POST">
                  <div className="row">
                    <div className="col-lg-12">
                      <label className="inpulable">Name :</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-lg-6">
                      <label className="inpulable">Email :</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-lg-6">
                      <label className="inpulable">Contact Number :</label>
                      <input
                        type="tel"
                        name="contactnumber"
                        placeholder="Contact Number"
                        value={formData.contactnumber}
                        onChange={handleChange}
                        maxLength={14}
                        required
                      />
                    </div>
                    <div className="col-lg-12">
                      <label className="inpulable">Message :</label>
                      <textarea
                        name="message"
                        placeholder="Message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                    <div className="col-lg-12">
                      <ReCAPTCHA
                        sitekey={recaptchaSiteKey}
                        onChange={handleCaptcha}
                      />
                    </div>
                    {is_user_login ? ( 
                      <>
                      <div className="col-lg-12 mt-4">
                      <button type="submit" className="site-btn">
                        Send Message
                      </button>
                    </div>
                      </>
                    ) : ( 
                      <>
                        <div className="col-lg-12 mt-4">
                          <button onClick={loginredirt} className="site-btn">
                              Please Login
                          </button>
                        </div>
                      </>
                    )}
                    
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default React.memo(Contacts);