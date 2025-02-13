import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import LeftSide from "../AdminComponent/LeftSide";
import NotifactionAdmin from "../AdminComponent/NotifactionAdmin";

function DisplayClients() {
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const [clientData, setClientData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${apiUrl}/displayclient`, {
            headers: {
                "x-api-key": process.env.REACT_APP_API_KEY,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setClientData(sortedData);
            })
            .catch((error) => console.log("Something went wrong", error));
    }, [apiUrl]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this Cilent?")) {
            fetch(`${apiUrl}/displayclient/${id}`, {
                method: "DELETE",
            })
                .then((response) => response.json())
                .then((data) => {
                    alert(data.message);
                    setClientData(clientData.filter(cilent => cilent._id !== id));
                })
                .catch((error) => {
                    console.error("Error deleting cilent:", error);
                    alert("Failed to delete the cilent");
                });
        }
    };

    const handleEditClick = (clientId) => {
        sessionStorage.setItem("clientId", clientId);
        navigate(`/edit-cilent`); 
      };

    const addClient = () => {
        navigate('/addclient');
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
                                    <h4>Cilent</h4>
                                    <div className="breadcrumb__links">
                                        <a href="/dashboard">Dashboard</a>
                                        <span>Client Display</span>
                                    </div>
                                </div>
                            </div>
                            <NotifactionAdmin/>
                        </div>
                    </div>
                </section>

                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                        </div>
                        <div className="col-lg-4">
                            <button onClick={addClient} className="btn btn-success mt-3 addbutonpro">
                                Add Client
                            </button>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Client Name</th>
                                    <th>Images</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientData.length > 0 ? (
                                    clientData.map((displayData, index) => (
                                        <tr key={displayData._id}>
                                            <td>{index + 1}</td>
                                            <td>{displayData.Clients_name}</td>
                                            <td>
                                                {displayData.Clients_img.map((img, imgIndex) => (
                                                    <img
                                                        key={imgIndex}
                                                        src={img}
                                                        alt={`Client ${displayData.Clients_name}`}
                                                        className="tbleimgwidt"
                                                    />
                                                ))}
                                            </td>
                                            <td> 
                                        
                                                <lord-icon 
                                                    src="https://cdn.lordicon.com/fikcyfpp.json" 
                                                    trigger="hover" 
                                                    onClick={() => handleEditClick(displayData._id)}
                                                    >
                                                </lord-icon>
                                                                                            
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/hwjcdycb.json"
                                                    trigger="morph"
                                                    state="morph-trash-in"
                                                    onClick={() => handleDelete(displayData._id)}
                                                ></lord-icon>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">No clients available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default React.memo(DisplayClients);
