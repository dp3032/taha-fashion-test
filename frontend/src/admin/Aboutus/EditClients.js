import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LeftSide from "../AdminComponent/LeftSide";

function EditClient() {
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const [clientData, setClientData] = useState({
    Clients_name: "",
    Clients_img: [],
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const navigate = useNavigate();
  const clientId = sessionStorage.getItem("clientId");

  useEffect(() => {
    if (!clientId) {
      alert("No client selected to edit");
      navigate("/displayclient");
      return;
    }
  
    fetch(`${apiUrl}/displayclient/${clientId}`, {
      headers: {
        "x-api-key": process.env.REACT_APP_API_KEY,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setClientData(data);
      })
      .catch((error) => {
        console.error("Failed to fetch client data:", error);
        alert("Client not found or server error");
        navigate("/displayclient");
      });
  }, [clientId, apiUrl, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData({ ...clientData, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedImages(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("cilents-name", clientData.Clients_name);

    selectedImages.forEach((file) => {
      formData.append("cilentsimage", file);
    });

    fetch(`${apiUrl}/editclient/${clientId}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Client updated successfully!");
        navigate("/displayclient");
      })
      .catch((error) => {
        console.error("Failed to update client:", error);
        alert("Failed to update client");
      });
  };

  return (
    <>

    <LeftSide/>
        <div className="bord">
            <section className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__text">
                                <h4> Edit Client </h4>
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

                <h1 className="form-title"> Edit Client </h1>

                <form className="product-form" onSubmit={handleSubmit} method="POST">

                    <div className="form-field">
                        <label htmlFor="clientName" className="form-label">Client Name</label>
                            <input
                                type="text"
                                className="form-input"
                                id="clientName"
                                name="Clients_name"
                                value={clientData.Clients_name}
                                onChange={handleInputChange}
                                required
                            />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="currentImages" className="form-label">
                            Current Images
                        </label>

                        <div>
                            {clientData.Clients_img.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt="Client"
                                    className="img-thumbnail me-2"
                                    style={{ width: "100px", height: "100px" }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="form-field">

                        <label htmlFor="newImages" className="form-label">
                            Upload New Clients Images
                        </label>
                        
                        <input
                            type="file"
                            className="form-input"
                            id="newImages"
                            name="cilentsimage"
                            onChange={handleFileChange}
                            multiple
                        />

                    </div>

                    <button type="submit" className="submit-edit-cilent-btn">
                        Update Client
                    </button>

                </form>
            </div>
        
        </div>
    </>
  );
}

export default EditClient;