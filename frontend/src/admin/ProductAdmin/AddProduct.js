import { useEffect, useState } from "react";
import '../adminstyle.css';
import React from "react";
import { useNavigate } from "react-router-dom";
import LeftSide from "../AdminComponent/LeftSide";
import ReactQuill from "react-quill";  
import 'react-quill/dist/quill.snow.css';  

function AddProduct() {
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        productName: "",
        productDescription: "",
        productPrice: "",
        productCategory: "",
        productImages: [],
        sizeImage:[],
        productSizes: [],
        productQuality: "", 
        productStockStatus: "", 
        Best_seller: false,
        tags: "",
    });
    const [categoryError, setCategoryError] = useState(false); 
    const navigate = useNavigate();

    // Fetch categories from API
    useEffect(() => {
        fetch(`${apiUrl}/catgory-api/displaycategory`, {
            headers: {
                "x-api-key": process.env.REACT_APP_API_KEY,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setCategories(data);
            })
            .catch((error) => console.error("Error fetching categories:", error));
    }, [apiUrl]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "productName" ? value.charAt(0).toUpperCase() + value.slice(1) : value
        });
        if (name === "productCategory") {
            setCategoryError(false);  
        }
    };

    // Handle size checkbox change
    const handleSizeChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevFormData) => {
            let updatedSizes = [...prevFormData.productSizes];
            if (checked) {
                updatedSizes.push(value);  // Add size to array if checked
            } else {
                updatedSizes = updatedSizes.filter((size) => size !== value);  // Remove size if unchecked
            }
            return {
                ...prevFormData,
                productSizes: updatedSizes
            };
        });
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: [...files] // Convert FileList to an array
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.productCategory) {
            setCategoryError(true);
            return;
        }
    
        const data = new FormData();
        data.append("product-name", formData.productName);
        data.append("product-description", formData.productDescription);
        data.append("product-price", formData.productPrice);
        data.append("product-category", formData.productCategory);
        data.append("product-quantity", formData.productQuantity);
        data.append("product-stock-status", formData.productStockStatus);
        data.append("Best_seller", formData.Best_seller);
        data.append("tags", formData.tags);
    
        formData.productSizes.forEach((size) => {
            data.append("product-sizes", size);
        });
    
        // Append Product Images
        formData.productImages.forEach((file) => {
            data.append("productimage", file);
        });
    
        // Append Size Images
        formData.sizeImage.forEach((file) => {
            data.append("sizeimage", file);
        });
    
        try {
            const response = await fetch(`${apiUrl}/product-api/add-product`, {
                method: "POST",
                body: data
            });
    
            const result = await response.json();
    
            if (response.ok) {
                alert("Product added successfully!");
                navigate('/product');
            } else {
                alert(result.message || "Error adding product");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("There was an error submitting the form.");
        }
    };

    // Define the Quill toolbar options
    const modules = {
        toolbar: [
            [{
                'header': [1, 2, 3, 4, 5, 6, false], 
                'font': ['serif', 'monospace', 'arial', 'times new roman', 'georgia', 'courier new', 'verdana', 'comic sans ms', 'helvetica', 'tahoma']
            }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline'],
            ['link'],
            [{ 'align': [] }],
            ['blockquote', 'code-block'],
            [{ 'direction': 'rtl' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            ['clean'],
        ],  
      };

    const handleEditorChange = (value) => {
        setFormData({
            ...formData,
            productDescription: value
        });
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
                                    <h4> Add Product </h4>
                                    <div className="breadcrumb__links">
                                        <a href="/dashboard"> Dashboard </a>
                                        <a href="/product"> Product </a>
                                        <span>Add Product</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                    <div className="container">
                        <div className="col-lg-12">
                            <h1 className="form-title mt-4 mb-4"> Add Product </h1>
                                <form className="product-form" onSubmit={handleSubmit} method="POST">
                                    <div className="row">
                                        <div className="col-lg-5">
                                            <div className="form-field">
                                                <label htmlFor="product-name" className="form-label">Product Name</label>
                                                <input
                                                    type="text"
                                                    id="product-name"
                                                    name="productName"
                                                    className="form-input"
                                                    value={formData.productName}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="form-field">
                                                        <label htmlFor="product-price" className="form-label">Product Price</label>
                                                        <input
                                                            type="number"
                                                            id="product-price"
                                                            name="productPrice"
                                                            className="form-input"
                                                            value={formData.productPrice}
                                                            onChange={handleChange}
                                                            step="0.01"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="form-field">
                                                        <label htmlFor="product-category" className="form-label">Category</label>
                                                        <select
                                                            id="product-category"
                                                            name="productCategory"
                                                            className="form-input"
                                                            value={formData.productCategory}
                                                            onChange={handleChange}
                                                            required
                                                        >
                                                            <option value="" disabled>
                                                                Please Select Category
                                                            </option>

                                                            {categories.map((category) => (
                                                                <option key={category._id} value={category._id}>
                                                                    {category.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {categoryError && (
                                                            <div style={{ color: "red", fontSize: "12px" }}>
                                                                Please select a category.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-field">
                                                    <label className="form-label">Size</label>
                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            <div className="checkbox-group">
                                                                {['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => (
                                                                    <label key={size}>
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="checkbox"
                                                                            value={size}
                                                                            onChange={handleSizeChange}
                                                                        />
                                                                        <p>{size}</p>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                            <div className="form-field">
                                                                <label htmlFor="size-images" className="form-label">Upload Size Images</label>
                                                                <input
                                                                    type="file"
                                                                    id="size-images"
                                                                    name="sizeImage"
                                                                    className="form-input"
                                                                    multiple
                                                                    onChange={handleFileChange}
                                                                />
                                                            </div>  

                                                        </div>
                                                    </div>
                                            </div>

                                            <div className="input-container">
                                                <div className="form-field">
                                                    <label htmlFor="product-quantity" className="form-label">Product Quantity</label>
                                                    <input
                                                        type="number"
                                                        id="product-quantity"
                                                        name="productQuantity"
                                                        className="form-input"
                                                        value={formData.productQuantity}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                <div className="radio-buttons">
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name="productStockStatus" 
                                                            value="stock"
                                                            className="radio-option mr-2"
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                        Stock
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name="productStockStatus" 
                                                            value="out-of-stock"
                                                            className="radio-option mr-2"
                                                            onChange={handleChange} 
                                                            required
                                                        />
                                                        Out Of Stock
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="input-container mb-3 mt-2">
                                                <div className="form-field m-0">
                                                    <label htmlFor="product-bestseller" className="form-label">Product Best Seller</label>
                                                </div>

                                                <div className="toggle-switch-container ml-3">
                                                    <label className="toggle-switch">
                                                        <input
                                                            type="checkbox"
                                                            name="Best_seller"
                                                            checked={formData.Best_seller}
                                                            onChange={(e) => {
                                                                setFormData((prevFormData) => ({
                                                                    ...prevFormData,
                                                                    Best_seller: e.target.checked, // Save as boolean
                                                                }));
                                                            }}
                                                        />
                                                        <span className="toggle-slider"></span>
                                                    </label>
                                                    <p>{formData.Best_seller ? "Best Seller" : "Not Best Seller"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-7">
                                            <div className="form-field texteditor">
                                                <label htmlFor="product-description" className="form-label">Product Description</label>
                                                <ReactQuill
                                                    modules={modules}
                                                    value={formData.productDescription}
                                                    onChange={handleEditorChange}
                                                    required
                                                    className="form-input custom-editor"
                                                />
                                            </div>

                                            <div className="form-field">
                                                <label htmlFor="product-tags" className="form-label">Product Tags</label>
                                                <textarea
                                                    type="text"
                                                    id="product-tags"
                                                    name="tags"
                                                    className="form-input"
                                                    value={formData.tags}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="form-field">
                                                    <label htmlFor="product-images" className="form-label">Upload Product Images</label>
                                                    <input
                                                        type="file"
                                                        id="product-images"
                                                        name="productImages"
                                                        className="form-input"
                                                        multiple
                                                        onChange={handleFileChange}
                                                        required
                                                    />
                                            </div>  
                                        
                                            <button type="submit" className="submit-btn">Add Product</button>

                                        </div>                                        
                                    </div>

                                </form>
                        </div> 
                    </div>
            </div>
        </>
    );
}

export default React.memo(AddProduct);
