import React, { useState, useEffect } from 'react';
import LeftSide from '../AdminComponent/LeftSide';
import NotifactionAdmin from '../AdminComponent/NotifactionAdmin';

const Infomation = () => {
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [contactInfo, setContactInfo] = useState([]); // State to store API data
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false); // Track form visibility

    // Fetch API data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiUrl}/contact-info-api/contact-info-display`, {
                    headers: {
                        "x-api-key": process.env.REACT_APP_API_KEY,
                    },
                })
                const data = await response.json();
                setContactInfo(data); // Store fetched data
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [apiUrl]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            Info_contact: contact,
            Info_email: email,
            Info_address: address,
        };

        try {
            const response = await fetch(`${apiUrl}/contact-info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                setContact('');
                setEmail('');
                setAddress('');
                setContactInfo((prev) => [...prev, formData]);
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('There was an error with the submission');
        }
    };

    // Toggle the form visibility
    const handleAddButtonClick = () => {
        setIsFormVisible((prev) => !prev);
    };

    return (
        <div className="bord">
            <LeftSide />
            <section className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__text">
                                <h4>Contact Details</h4>
                                <div className="breadcrumb__links">
                                    <a href="/dashboard">Dashboard</a>
                                    <span>Contact Information</span>
                                </div>
                            </div>
                        </div>
                        <NotifactionAdmin/>
                    </div>
                </div>
            </section>

            <button className="btn btn-outline-success mt-4 ml-4" onClick={handleAddButtonClick}>
                    {isFormVisible ? 'Hide Form' : 'Add Information'}
                </button>

            {isFormVisible && (
              <>
                <div className="form-container">
                    <h1 className="form-title">Contact Information</h1>
                    
                        <form className="product-form" onSubmit={handleSubmit}>
                            <div className="form-field">
                                <label htmlFor="contact" className="form-label">
                                    Contact Number
                                </label>
                                <input
                                    type="text"
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
                                    type="text"
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
                                Add Information
                            </button>
                        </form>
                    
                </div>
              </>
            )}
            <div className="table-responsive">
                <p className="anyview mb-5 mt-4">Contact Information</p>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="table table-hover mb-5">
                        <thead>
                            <tr>
                                <th> # </th>
                                <th>Contact</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contactInfo.map((info, index) => (
                                <tr key={index}>
                                    <td> {index + 1} </td>
                                    <td>{info.Info_contact}</td>
                                    <td>{info.Info_email}</td>
                                    <td>{info.Info_address}</td>
                                    <td>
                                        <a href={`/edit-contact-infomation`}
                                            onClick={() => {
                                                sessionStorage.removeItem("infomationId");
                                                sessionStorage.setItem("infomationId", info._id);
                                                window.location.href = `/edit-contact-infomation`;
                                            }} >
                                            <lord-icon src="https://cdn.lordicon.com/fikcyfpp.json" trigger="hover"></lord-icon>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default React.memo(Infomation);