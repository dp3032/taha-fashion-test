import React, { useState, useEffect } from 'react';
import LeftSide from '../AdminComponent/LeftSide';

const EditInfo = () => {
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const infomationId = sessionStorage.getItem('infomationId');
  
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true); // Loading state to handle async fetching

  // Fetch the contact information when the component mounts
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch(`${apiUrl}/contact-info-api/contact-info/${infomationId}`, {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
        })
        const data = await response.json();

        if (response.ok) {
          setContact(data.Info_contact);
          setEmail(data.Info_email);
          setAddress(data.Info_address);
        } else {
          alert('Error fetching contact information');
        }
      } catch (error) {
        console.error('Error fetching contact information:', error);
        alert('Error fetching data');
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    if (infomationId) {
      fetchContactInfo();
    }
  }, [apiUrl, infomationId]);

  // Handle form submission for editing
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      Info_contact: contact,
      Info_email: email,
      Info_address: address,
    };

    try {
      const response = await fetch(`${apiUrl}/contact-info-api/contact-info/edit/${infomationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "x-api-key": process.env.REACT_APP_API_KEY,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        window.location.href = "/contactinfomation";
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('There was an error with the submission');
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Show loading message while data is being fetched
  }

  return (
    <div className="bord">
      <LeftSide />
      <section className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4>Edit Contact Information</h4>
                <div className="breadcrumb__links">
                  <a href="/dashboard">Dashboard</a>
                  <a href="/contactinfomation">Contact Infomation</a>
                  <span>Edit Contact Information</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="form-container">
        <h1 className="form-title">Edit Information</h1>

        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="contact" className="form-label">
              Contact Number
            </label>
            <input
              type="number"
              id="contact"
              className="form-input"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <textarea
              id="address"
              className="form-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Update Information
          </button>
        </form>
      </div>
    </div>
  );
};

export default React.memo(EditInfo);
