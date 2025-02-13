import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LeftSide from "../AdminComponent/LeftSide";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function EditProduct() {
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const [productData, setProductData] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    productCategory: "",
    productImages: [],
    sizeImages: [],
    productSizes: [],
    productQuality: "",
    productStockStatus: "", 
    productTag: "",
});

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [productId, setProductId] = useState("");

useEffect(() => {
  const storedProductId = sessionStorage.getItem("productId");
  if (storedProductId) {
    setProductId(storedProductId);
  }
}, []);

  useEffect(() => {
    fetch(`${apiUrl}/catgory-api/displaycategory`, {
      headers: {
        "x-api-key": process.env.REACT_APP_API_KEY,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        if (data.length > 0) {
          setProductData((prev) => ({ ...prev, productCategory: data[0]._id }));
        }
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, [apiUrl]);

  useEffect(() => {
    const productId = sessionStorage.getItem("productId");
    if (productId) {
        fetch(`${apiUrl}/product-api/products/${productId}`, {
            headers: {
                "x-api-key": process.env.REACT_APP_API_KEY,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setProductData({
                    productName: data.Product_name || "",
                    productDescription: data.Product_des || "",
                    productPrice: data.Product_price || "",
                    productCategory: data.Product_category?._id || "",
                    productImages: Array.isArray(data.Product_img) ? data.Product_img : [], // Ensure array
                    sizeImages: data.Size_images || [],
                    productSizes: data.Product_sizes || [],
                    productQuantity: data.Product_quantity || "", 
                    productStockStatus: data.Product_stock_status || "", 
                    Best_seller: data.Best_seller || "", 
                    productTag: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
                });
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching product:", error);
                setLoading(false);
            });
    }
}, [apiUrl]);


const handleChange = (e) => {
  const { name, value } = e.target;
  setProductData((prev) => {
    const updatedData = { 
      ...prev, 
      [name]: name === "productTag" ? value.split(',').map(tag => tag.trim()) : value // Split by comma and trim spaces
    };
    return updatedData;
  });
};

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      productSizes: checked
        ? [...prev.productSizes, value]
        : prev.productSizes.filter((size) => size !== value),
    }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    setProductData({ ...productData, productImages: files });
  };

  const handleSizeImageChange = (e) => {
    const { files } = e.target;
    setProductData({ ...productData, sizeImages: [...files] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show confirmation dialog before proceeding
  const confirmUpdate = window.confirm("Are you sure you want to update the product?");
  
  if (!confirmUpdate) {
    return; // If canceled, do nothing
  }

    const formData = new FormData();
    formData.append("product-name", productData.productName);
    formData.append("product-description", productData.productDescription);
    formData.append("product-price", productData.productPrice);
    formData.append("product-category", productData.productCategory);
    formData.append("product-quantity", productData.productQuantity);
    formData.append("product-stock-status", productData.productStockStatus);
    formData.append("Best_seller", productData.Best_seller);
    formData.append("product-tags", productData.productTag); 
    
    productData.productSizes.forEach((size) => {
      formData.append("product-sizes", size);
    });

    if (Array.isArray(productData.productImages) && productData.productImages.length > 0) {
      const existingImages = productData.productImages.filter(
        (img) => typeof img === "string"
      );
      formData.append("existingImages", JSON.stringify(existingImages));
    }

    Array.from(productData.productImages).forEach((file) => {
      if (file instanceof File) {
        formData.append("productimage", file);
      }
    });

    if (Array.isArray(productData.sizeImages) && productData.sizeImages.length > 0) {
      const existingSizeImages = productData.sizeImages.filter((img) => typeof img === "string");
      formData.append("existingSizeImages", JSON.stringify(existingSizeImages));
    }
  
    Array.from(productData.sizeImages).forEach((file) => {
      if (file instanceof File) {
        formData.append("sizeimage", file);
      }
    });

    try {
      const productId = sessionStorage.getItem("productId");
      const response = await fetch(`${apiUrl}/product-api/update-product/${productId}`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Product updated successfully!");
        navigate("/product");
        sessionStorage.removeItem("productId");
      } else {
        alert(result.message || "Error updating product");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error submitting the form.");
    }
  };

  const handleEditorChange = (value) => {
    setProductData({
        ...productData,
        productDescription: value
    });
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


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <LeftSide />
        <div className="bord">
          
          <section className="breadcrumb-option">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="breadcrumb__text">
                    <h4>Edit Product</h4>
                    <div className="breadcrumb__links">
                      <a href="/dashboard">Dashboard</a>
                      <a href="/product">Product</a>
                      <span>Edit Product</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="container">
            <div className="col-lg-12">

              <h1 className="form-title mt-4 mb-4"> Edit Product </h1>
              <p> Product ID : {productId || "N/A"} </p>

                <form className="product-form" onSubmit={handleSubmit} method="POST">
                  <div className="row">
                    
                    <div className="col-lg-5">
                      {/* Name */}
                        <div className="form-field">
                          <label htmlFor="product-name" className="form-label">Product Name</label>
                            <input type="text"
                                id="product-name"
                                name="productName"
                                className="form-input"
                                value={productData.productName}
                                onChange={handleChange}
                                required
                              />
                        </div>

                      {/* Price And  Category*/}
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="form-field">
                              <label htmlFor="product-price" className="form-label">Product Price</label>
                              <input
                                type="number"
                                id="product-price"
                                name="productPrice"
                                className="form-input"
                                value={productData.productPrice}
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
                                    value={productData.productCategory}
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
                            </div>
                          </div>
                        </div>

                      {/* Size */}
                        <div className="form-field">
                          <label className="form-label">Size</label>
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="checkbox-group">
                                  {["S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                                    <label key={size}>
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={size}
                                        checked={productData.productSizes.includes(size)}
                                        onChange={handleSizeChange}
                                      />
                                      <p>{size}</p>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>
                        </div>

                        <div className="mb-3">
                          {Array.isArray(productData.sizeImages) &&
                            productData.sizeImages.map((img, index) => (
                              <img key={index} src={img} alt="Size" className="img-thumbnail me-2" style={{ width: "150px", height: "150px" }} />
                          ))}
                        </div>

                        {/* Upload Size Images */}
                        <div className="form-field">
                          <label htmlFor="size-images" className="form-label">Upload Size Images</label>
                          <input type="file" id="size-images" name="sizeImages" className="form-input" multiple onChange={handleSizeImageChange} />
                        </div>

                      {/* Quantity */}
                        <div className="input-container">
                          <label htmlFor="product-quantity" className="form-label-quality">
                            Product Quantity
                          </label>
                          <input
                              type="number"
                              id="product-quantity"
                              name="productQuantity"
                              className="form-input-quality"
                              value={productData.productQuantity}
                              onChange={handleChange}
                              required
                            />
                            <div className="radio-buttons">
                              <label>
                              <input
                                type="radio"
                                name="productStockStatus"
                                value="stock"
                                className="radio-option mr-2"
                                checked={productData.productStockStatus === "stock"}
                                onChange={handleChange}
                              />
                              Stock
                            </label>
                            <label>
                              <input
                                type="radio"
                                name="productStockStatus"
                                value="out-of-stock"
                                className="radio-option mr-2"
                                checked={productData.productStockStatus === "out-of-stock"}
                                onChange={handleChange}
                              />
                              Out Of Stock
                            </label>
                            </div>
                        </div>

                      {/* Best Seller */}
                        <div className="input-container mb-3 mt-2">
                            <div className="form-field m-0">
                                <label htmlFor="product-bestseller" className="form-label">Product Best Seller</label>
                            </div>

                            <div className="toggle-switch-container ml-3">
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        name="Best_seller"
                                        checked={productData.Best_seller || false}
                                        onChange={(e) =>
                                          setProductData({ ...productData, Best_seller: e.target.checked })
                                        }
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                                <p>{productData.Best_seller ? "Best Seller" : "Not Best Seller"}</p>
                            </div>
                        </div>

                    </div>

                    <div className="col-lg-7">
                      {/* Text Editor Description */}
                        <div className="form-field texteditor">
                            <label htmlFor="product-description" className="form-label">Product Description</label>
                            <ReactQuill
                                modules={modules}
                                value={productData.productDescription}
                                onChange={handleEditorChange}
                                required
                                className="form-input custom-editor"
                            />
                        </div>

                      {/* Tag Edit */}
                        <div className="form-field">
                            <label htmlFor="product-tag" className="form-label">Product Tags</label>
                              <textarea type="text"
                                  id="product-tag"
                                  name="productTag"
                                  value={Array.isArray(productData.productTag) ? productData.productTag.join(', ') : ""}
                                  onChange={handleChange}
                                  className="form-input"
                                  required
                                />
                        </div>

                      {/* Current Img */}
                        <div className="mb-3">
                          {Array.isArray(productData.productImages) &&
                            productData.productImages.map((img, index) => (
                              <img  key={index} src={img} alt="Product" className="img-thumbnail me-2"
                                    style={{ width: "150px", height: "150px" }} />
                          ))}
                        </div>
                        
                      {/* Img Upload */}
                        <div className="form-field">
                          <label htmlFor="product-images" className="form-label">Upload Product Images</label>
                            <input
                              type="file"
                              id="product-images"
                              name="productImages"
                              className="form-input"
                              multiple
                              onChange={handleFileChange}
                            />
                        </div>  

                      <button type="submit" className="submit-btn">Update Product</button>
                    </div> 
                                                           
                  </div>
                </form>
            </div> 
          </div>

        </div>
    </>
  );
}

export default React.memo(EditProduct);
