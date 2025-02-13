import React, { useEffect, useState } from 'react';
import LeftSide from '../AdminComponent/LeftSide';
import NotifactionAdmin from '../AdminComponent/NotifactionAdmin';
import axios from 'axios';

const MainBannerAdmin = () => {
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [mainBannerName, setMainBannerName] = useState('');
    const [mainBannerImg, setMainBannerImg] = useState([]);
    const [displayMainBanners, setDisplayMainBanners] = useState([]);
    const [editMainBannerId, setEditMainBannerId] = useState(null);

    // Fetch Existing Main Banners
    useEffect(() => {
        fetch(`${apiUrl}/main-banner-api/display-admin-main-banner`, {
            headers: { 'x-api-key': process.env.REACT_APP_API_KEY },
        })
            .then(response => response.json())
            .then(data => setDisplayMainBanners(data))
            .catch(error => console.log('Something went wrong', error));
    }, [apiUrl]);

    // Handle File Selection
    const handleFileChange = (e) => {
        setMainBannerImg(e.target.files);
    };

    // Show Form for Adding a New Banner
    const handleAddClick = () => {
        setIsFormVisible(true);
        setIsEditing(false);
        setMainBannerName('');
        setMainBannerImg([]);
    };

    // Handle New Banner Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!mainBannerName || mainBannerImg.length === 0) {
            alert("Please provide a banner name and select at least one image.");
            return;
        }

        const formData = new FormData();
        formData.append('mainBannerName', mainBannerName);
        for (let i = 0; i < mainBannerImg.length; i++) {
            formData.append('mainBannerImg', mainBannerImg[i]);
        }

        try {
            const response = await axios.post(`${apiUrl}/main-banner-api/add-admin-main-banner`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert(response.data.message);
            window.location.reload();
            setMainBannerName('');
            setMainBannerImg([]);
            setIsFormVisible(false);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload the main banner.');
        }
    };

    // Show Form for Editing an Existing Banner
    const handleEditClick = (banner) => {
        setIsFormVisible(true);
        setIsEditing(true);
        setEditMainBannerId(banner._id);
        setMainBannerName(banner.MainBanner_name);
        setMainBannerImg([]); 
    };

    // Handle Banner Update Submission
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!mainBannerName) {
            alert("Please provide a banner name.");
            return;
        }

        const formData = new FormData();
        formData.append('mainBannerName', mainBannerName);
        Array.from(mainBannerImg).forEach((image) => formData.append('mainBannerImg', image));

        try {
            const response = await axios.put(`${apiUrl}/main-banner-api/edit-admin-main-banner/${editMainBannerId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert(response.data.message);
            window.location.reload();
            setIsFormVisible(false);
        } catch (error) {
            console.error('Edit error:', error);
            alert('Failed to update the main banner.');
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this gallery?')) {
          fetch(`${apiUrl}/main-banner-api/delete-main-banner/${id}`, {
            method: 'DELETE',
          })
            .then((response) => response.json())
            .then((data) => {
              alert(data.message);
              window.location.reload();
              setDisplayMainBanners(displayMainBanners.filter((gallery) => gallery._id !== id));
            })
            .catch((error) => {
              console.error('Error deleting gallery:', error);
              alert('Failed to delete the gallery');
            });
        }
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
                                    <h4>Manage Gallery</h4>
                                    <div className="breadcrumb__links">
                                        <a href="/dashboard">Dashboard</a>
                                        <span>Main Banner</span>
                                    </div>
                                </div>
                            </div>
                            <NotifactionAdmin/>
                        </div>
                    </div>
                </section>

                <div className="container">
                    <div className="row">
                    <div className="col-lg-2 text-end">
                        <button className="btn btn-success mt-3" onClick={handleAddClick}>
                            Add Main Banner
                        </button>
                    </div>
                    </div>

                    <div className="table-responsive mt-4">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Images</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                            {displayMainBanners.length > 0 ? (
                                displayMainBanners.map((gallery, index) => (
                                <tr key={gallery._id}>
                                    <td>{index + 1}</td>
                                    <td>{gallery.MainBanner_name}</td>
                                    <td>
                                        {gallery.MainBanner_img.map((img, imgIndex) => (
                                            <img key={imgIndex} src={img} alt="Loading.." className="tbleimgwidt" />
                                        ))}
                                    </td>
                                    <td>
                                        <lord-icon 
                                                src="https://cdn.lordicon.com/fikcyfpp.json" 
                                                trigger="hover" 
                                                onClick={() => handleEditClick(gallery)}
                                            >
                                        </lord-icon>
                                                                                                                
                                        <lord-icon
                                                src="https://cdn.lordicon.com/hwjcdycb.json"
                                                trigger="morph"
                                                state="morph-trash-in"
                                                onClick={() => handleDelete(gallery._id)}
                                            >
                                        </lord-icon>
                                    </td>
                                </tr>
                                ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">
                                            No Main Banner available
                                        </td>
                                    </tr>
                            )}
                        </tbody>
                    </table>
                    </div>
                </div>

                {isFormVisible && (
                    <div className="form-container mt-4">
                        <h1 className="form-title">Add Main Banner</h1>
                        <form onSubmit={isEditing ? handleEditSubmit : handleSubmit}>
                            <div className="form-field">
                                <label className="form-label">Banner Name</label>
                                <input
                                    type="text"
                                    name="mainBannerName"
                                    className="form-input"
                                    value={mainBannerName}
                                    onChange={(e) => setMainBannerName(e.target.value)}
                                    required
                                />
                            </div>

                            {isEditing && (
                                <div className="mb-3">
                                    <label htmlFor="currentImages" className="form-label">
                                        Current Images
                                    </label>

                                    <div>
                                        {displayMainBanners.find((gallery) => gallery._id === editMainBannerId)?.MainBanner_img.map((img, index) => (
                                            <img key={index} src={img}
                                                alt="Loading..."
                                                className="img-thumbnail me-2"
                                                style={{ width: "100px", height: "100px" }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="form-field">
                                <label className="form-label">Upload Images</label>
                                <input
                                    type="file"
                                    name="mainBannerImg"
                                    className="form-input"
                                    multiple
                                    onChange={handleFileChange}
                                />
                            </div>

                            <button type="submit" className="submit-btn">
                                {isEditing ? "Update Banner" : "Add Banner"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
};

export default React.memo(MainBannerAdmin);