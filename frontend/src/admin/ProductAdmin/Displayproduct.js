import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import LeftSide from "../AdminComponent/LeftSide";
import NotifactionAdmin from "../AdminComponent/NotifactionAdmin";

function Displayproduct() {
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const [productdata, Setproductdata] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // New state to hold filtered products
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState(""); // Search term state
    const [filter, setFilter] = useState({
        stockStatus: "",
        bestSeller: "",
      });

      const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
      };

    useEffect(() => {
        const url = new URL(`${apiUrl}/product-api/products`);
        const params = new URLSearchParams();

        if (searchTerm) params.append('search', searchTerm);
        if (filter.stockStatus) params.append('stockStatus', filter.stockStatus);
        if (filter.bestSeller) params.append('bestSeller', filter.bestSeller);

        url.search = params.toString();

        fetch(url, {
            headers: {
                "x-api-key": process.env.REACT_APP_API_KEY,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                Setproductdata(sortedData);
                setFilteredData(sortedData);
            })
            .catch((error) => console.log("Something went wrong", error));
    }, [apiUrl, searchTerm, filter]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            fetch(`${apiUrl}/product-api/products/${id}`, {
                method: "DELETE",
            })
                .then((response) => response.json())
                .then((data) => {
                    alert(data.message); // Show success message
                    // Remove deleted product from state
                    Setproductdata(productdata.filter(product => product._id !== id));
                    setFilteredData(filteredData.filter(product => product._id !== id));
                    window.location.href="/product";
                })
                .catch((error) => {
                    console.error("Error deleting product:", error);
                    alert("Failed to delete the product");
                });
        }
    };

    const navigate = useNavigate();
    const addproduct = () => {
        navigate('/addproduct');
    };

    const handleSearch = (e) => {
        const searchQuery = e.target.value.toLowerCase();
        setSearchTerm(searchQuery);

        let filtered = productdata.filter(product =>
            product.Product_name.toLowerCase().includes(searchQuery)
        );

        setFilteredData(filtered);
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredData.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    // Generate page numbers for pagination
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            pageNumbers.push(i);
        }
    }

    const paginationItems = [];
    for (let i = 0; i < pageNumbers.length; i++) {
        if (i > 0 && pageNumbers[i] - pageNumbers[i - 1] > 1) {
            paginationItems.push("...");
        }
        paginationItems.push(pageNumbers[i]);
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
                                    <h4>Product</h4>
                                    <div className="breadcrumb__links">
                                        <a href="/dashboard">Dashboard</a>
                                        <span>Product Display</span>
                                    </div>
                                </div>
                            </div>
                            <NotifactionAdmin/>
                        </div>
                    </div>
                </section>

                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="col-lg-6">
                                <div className="shop__sidebar__search mt-3 mb-4">
                                    <form className="d-flex align-items-center">
                                        <input
                                            type="text"
                                            placeholder="Search for products..."
                                            value={searchTerm}
                                            onChange={handleSearch}
                                            className="mr-2"
                                        />
                                        <button type="button" onClick={() => setSearchTerm("")} className="refunserbut">
                                            Clear
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 d-flex justify-content-between align-items-center">
                        
                        <select
                            name="stockStatus"
                            value={filter.stockStatus}
                            onChange={handleFilterChange}
                        >
                            <option value="">All</option>
                            <option value="stock">In Stock</option>
                            <option value="out-of-stock">Out of Stock</option>
                        </select>

                        <select
                            name="bestSeller"
                            value={filter.bestSeller}
                            onChange={handleFilterChange}
                        >
                            <option value=""disabled>Please Select</option>
                            <option value="">All</option>
                            <option value="true">Best Seller</option>
                            <option value="false">Not Best Seller</option>
                        </select>


                            {/* Add Product Button */}
                            <button onClick={addproduct} className="btn btn-success mt-3 addbutonpro">
                                Add Product
                            </button>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col"> # </th>
                                    <th scope="col"> Product Name </th>
                                    <th scope="col"> Price </th>
                                    <th scope="col"> Category </th>
                                    <th scope="col"> Size </th>
                                    <th scope="col"> Quantity </th>
                                    <th scope="col"> Best Seller </th>
                                    <th scope="col">Images </th>
                                    <th scope="col"> Action </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentProducts.length > 0 ? (
                                    currentProducts.map((displaydata, index) => (
                                        <tr key={displaydata._id}>
                                            <td> {indexOfFirstProduct + index + 1} </td>
                                            <td className="overhieed"> {displaydata.Product_name} </td>
                                            <td> {displaydata.Product_price} </td>
                                            <td> {displaydata.Product_category?.name || "N/A"} </td>
                                            <td>
                                                {displaydata.Product_sizes && displaydata.Product_sizes.length > 0 ? (
                                                    displaydata.Product_sizes.join(", ")
                                                ) : (
                                                    "N/A"
                                                )}
                                            </td>
                                            <td> 
                                                <ul>
                                                    <li> {displaydata.Product_quantity || "N/A"} </li>
                                                    <li> {displaydata.Product_stock_status || "N/A"} </li>
                                                </ul> 
                                            </td>
                                            <td>
                                                {displaydata.Best_seller ? "Best Seller" : "Not Best Seller"}
                                            </td>
                                            <td>
                                                <img src={displaydata.Product_img[0]} alt="Loading..." className="tbleimgwidt" />
                                            </td>
                                            <td>
                                                <a href={`/edit-product`}
                                                    onClick={() => { 
                                                        sessionStorage.removeItem("productId");
                                                        sessionStorage.setItem("productId", displaydata._id);
                                                        window.location.href = `/edit-product`; // Manually navigate after setting the session storage
                                                    }} >
                                                    <lord-icon src="https://cdn.lordicon.com/fikcyfpp.json" trigger="hover"></lord-icon>
                                                </a>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/hwjcdycb.json"
                                                    trigger="morph"
                                                    state="morph-trash-in"
                                                    onClick={() => handleDelete(displaydata._id)}>
                                                </lord-icon>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center">Product not available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="pagination-container">
                        <div className="pagination-right">
                            <button
                                className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                Prev
                            </button>

                            {/* Page Numbers */}
                            {paginationItems.map((item, index) => (
                                item === "..." ? (
                                    <span key={index} className="pagination-ellipsis">...</span>
                                ) : (
                                    <button
                                        key={index}
                                        className={`pagination-button ${currentPage === item ? "active" : ""}`}
                                        onClick={() => handlePageChange(item)}
                                    >
                                        {item}
                                    </button>
                                )
                            ))}

                            {/* Next Button */}
                            <button
                                className={`pagination-button ${currentPage === totalPages ? "disabled" : ""}`}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                    {/* Pagination End */}
                </div>
            </div>
        </>
    );
}

export default React.memo(Displayproduct);
