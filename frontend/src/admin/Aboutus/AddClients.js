import { useState } from "react";
import '../adminstyle.css';
import React from "react";
import { useNavigate } from "react-router-dom";
import LeftSide from "../AdminComponent/LeftSide";

function AddClients() {
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const [formData, setFormData] = useState({
        cilentsName: "",
        cilentsImage: ""
    });

    const  navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            cilentsImage: e.target.files // Store the selected files directly
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a FormData object to send the data as multipart/form-data
        const data = new FormData();
        data.append("cilents-name", formData.cilentsName);
        
        // Append the 3 product images
        Array.from(formData.cilentsImage).forEach((file, index) => {
            data.append("cilentsimage", file);
        });

        try {
            const response = await fetch(`${apiUrl}/add-clients`, {
                method: "POST",
                body: data
            });

            const result = await response.json();

            if (response.ok) {
                alert("Client added successfully!");
                navigate('/displayclient');
            } else {
                alert(result.message || "Error adding Client");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("There was an error submitting the form.");
        }
    };

    return (
        <>
            <LeftSide />
                <div className="bord">

                    <section className="breadcrumb-option">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="breadcrumb__text">
                                        <h4> Add Client </h4>
                                        <div className="breadcrumb__links">
                                            <a href="/dashboard"> Dashboard </a>
                                            <span>Client</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    <div className="form-container">
                        <h1 className="form-title">Add Client</h1>
                        <form className="product-form" onSubmit={handleSubmit} method="POST">
                            <div className="form-field">
                                <label htmlFor="product-name" className="form-label">Client Name</label>
                                <input
                                    type="text"
                                    id="product-name"
                                    name="cilentsName"
                                    className="form-input"
                                    value={formData.cilentsName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="product-images" className="form-label">Upload Clients Images (3 images required)</label>
                                <input
                                    type="file"
                                    id="product-images"
                                    name="cilentsImage"
                                    className="form-input"
                                    multiple
                                    onChange={handleFileChange}
                                    required
                                />
                            </div>

                            <button type="submit" className="submit-btn">Add Client</button>
                        </form>
                    </div>
                    
                </div>
        </>
    );
}

export default React.memo(AddClients);
