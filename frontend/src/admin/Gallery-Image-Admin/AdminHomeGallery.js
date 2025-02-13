import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LeftSide from '../AdminComponent/LeftSide';
import NotifactionAdmin from '../AdminComponent/NotifactionAdmin';

const AdminHomeGallery = () => {
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const [galleryName, setGalleryName] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [Displaygallery, setDisplaygallery] = useState([]);
  const [galleryDes, setGalleryDes] = useState('');
  const [galleryPrice, setGalleryPrice] = useState('');
  const [ProductIdRef, setProductIdRef] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editGalleryId, setEditGalleryId] = useState(null);

  // Display Gallery
  useEffect(() => {
    fetch(`${apiUrl}/product-banner-api/display-gallery-homepage-admin`, {
      headers: {
        'x-api-key': process.env.REACT_APP_API_KEY,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDisplaygallery(data);
      })
      .catch((error) => console.log('Something went wrong', error));
  }, [apiUrl]);

  // Handle File Change
  const handleFileChange = (e) => {
    setGalleryImages(e.target.files);
  };

  // Show Form for Adding a New Gallery
  const handleAddClick = () => {
    setIsFormVisible(true);
    setIsEditing(false);
    setGalleryName('');
    setGalleryImages([]);
  };

  // Show Form for Editing an Existing Gallery
  const handleEditClick = (gallery) => {
    setIsFormVisible(true);
    setIsEditing(true);
    setEditGalleryId(gallery._id);
    setGalleryName(gallery.Gallery_name);
    setProductIdRef(gallery.Gallery_Product_ID ? gallery.Gallery_Product_ID._id : '');
    setGalleryDes(gallery.Gallery_des); // Load description
    setGalleryPrice(gallery.Gallery_price); // Load price
    setGalleryImages([]);
  };

  // Handle Delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this gallery?')) {
      fetch(`${apiUrl}/product-banner-api/gallery-homepage-admin/${id}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          setDisplaygallery(Displaygallery.filter((gallery) => gallery._id !== id));
        })
        .catch((error) => {
          console.error('Error deleting gallery:', error);
          alert('Failed to delete the gallery');
        });
    }
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('galleryName', galleryName);
    formData.append('galleryDes', galleryDes);
    formData.append('galleryPrice', galleryPrice);
    formData.append('ProductIdRef', ProductIdRef); // Include Product ID
    Array.from(galleryImages).forEach((image) => formData.append('galleryImages', image));
  
    try {
      if (isEditing) {
        const response = await axios.put(`${apiUrl}/product-banner-api/edit-gallery-homepage-admin/${editGalleryId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert(response.data.message);
      } else {
        const response = await axios.post(`${apiUrl}/product-banner-api/add-gallery-homepage-admin`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert(response.data.message);
      }
      window.location.reload();
    } catch (error) {
      console.error('Error uploading gallery:', error);
      alert('Failed to process the gallery.');
    }
  };

  return (
    <div className="bord">
      <LeftSide />

      <section className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4>Manage Gallery</h4>
                <div className="breadcrumb__links">
                  <a href="/dashboard">Dashboard</a>
                  <span>Gallery</span>
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
              Add Gallery
            </button>
          </div>
        </div>

        <div className="table-responsive mt-4">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Product ID Reference </th>
                <th>Description</th>
                <th>Price</th>
                <th>Images</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Displaygallery.length > 0 ? (
                Displaygallery.map((gallery, index) => (
                  <tr key={gallery._id}>
                    <td>{index + 1}</td>
                    <td>{gallery.Gallery_name}</td>
                    <td>{gallery.Gallery_Product_ID._id || 'N/A'}</td>
                    <td className="overhieed">{gallery.Gallery_des}</td>
                    <td>{gallery.Gallery_price}</td>
                    <td>
                      {gallery.Gallery_img.map((img, imgIndex) => (
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
                    No Gallery available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormVisible && (
        <div className="form-container mt-4">
          <h1 className="form-title">{isEditing ? 'Edit Gallery' : 'Add Home Page Gallery'}</h1>
          <form className="product-form" onSubmit={handleSubmit}>
            
            <div className="form-field">
              <label className="form-label">Gallery Name</label>
              <input
                type="text"
                name="galleryName"
                className="form-input"
                value={galleryName}
                onChange={(e) => setGalleryName(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Product ID Reference</label>
              <input
                type="text"
                name="ProductIdRef"
                className="form-input"
                value={ProductIdRef}
                onChange={(e) => setProductIdRef(e.target.value)}
                required 
              />
            </div>

            <div className="form-field">
              <label className="form-label">Gallery Description</label>
              <input
                type="text"
                name="galleryDes"
                className="form-input"
                value={galleryDes}
                onChange={(e) => setGalleryDes(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Gallery Price</label>
              <input
                type="number"
                name="galleryPrice"
                className="form-input"
                value={galleryPrice}
                onChange={(e) => setGalleryPrice(e.target.value)}
                required
              />
            </div>
            
            {isEditing && (
                <div className="mb-3">
                    <label htmlFor="currentImages" className="form-label">
                        Current Images
                    </label>

                    <div>
                        {Displaygallery.find((gallery) => gallery._id === editGalleryId)?.Gallery_img.map((img, index) => (
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
                name="galleryImages"
                className="form-input"
                multiple
                onChange={handleFileChange}
                required={!isEditing}
              />
            </div>

            <button type="submit" className="submit-btn">
              {isEditing ? 'Update Gallery' : 'Add Gallery'}
            </button>
            
          </form>
        </div>
      )}
    </div>
  );
};

export default React.memo(AdminHomeGallery);
