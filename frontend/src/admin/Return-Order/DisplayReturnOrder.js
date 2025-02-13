import React, { useEffect, useState } from "react";
import LeftSide from "../AdminComponent/LeftSide";
import NotifactionAdmin from "../AdminComponent/NotifactionAdmin";

function DisplayReturnOrder() {
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const [retorder, Setretunorder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch data
    fetch(`${apiUrl}/returnorder?order_id=${searchTerm}`, {
      headers: {
        "x-api-key": process.env.REACT_APP_API_KEY,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Enter Full ID");
        }
        return response.json();
      })
      .then((data) => {
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        Setretunorder(sortedData);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [apiUrl, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (id, newStatus) => {
    fetch(`${apiUrl}/return-order/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Retunorder_status: newStatus }),
    })
      .then((response) => response.json())
      .then((updatedData) => {
        Setretunorder((prevOrders) =>
          prevOrders.map((order) =>
            order._id === id ? { ...order, Retunorder_status: newStatus } : order
          )
        );
      })
      .catch((error) => console.error('Error updating status:', error));
  };

  // Filter the data based on selected filter
  const filteredReturnData = selectedFilter === "all"
    ? retorder
    : retorder.filter((refund) => refund.Retunorder_status === selectedFilter);

  // Pagination logic
  const totalPages = Math.ceil(filteredReturnData.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredReturnData.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Generate page numbers with ellipses
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
                  <h4>Return Details</h4>
                  <div className="breadcrumb__links">
                    <a href="/dashboard">Dashboard</a>
                    <span>Return</span>
                  </div>
                </div>
              </div>
              <NotifactionAdmin/>
            </div>
          </div>
        </section>
        

        <div className="col-lg-12">
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
          <div className="row mt-3">
            {/* Radio Buttons */}
            <div className="form-check ml-3 mb-4">
              <input
                className="form-check-input"
                type="radio"
                checked={selectedFilter === "all"}
                onChange={() => setSelectedFilter("all")}
              />
              <label className="form-check-label">All Return</label>
            </div>
            <div className="form-check ml-5">
              <input
                className="form-check-input"
                type="radio"
                checked={selectedFilter === "Refund"}
                onChange={() => setSelectedFilter("Refund")}
              />
              <label className="form-check-label"> Refund </label>
            </div>
            <div className="form-check ml-5">
              <input
                className="form-check-input"
                type="radio"
                checked={selectedFilter === "Pending"}
                onChange={() => setSelectedFilter("Pending")}
              />
              <label className="form-check-label">Pending</label>
            </div>
            <div className="form-check ml-5">
              <input
                className="form-check-input"
                type="radio"
                checked={selectedFilter === "Request-Accpet"}
                onChange={() => setSelectedFilter("Request-Accpet")}
              />
              <label className="form-check-label">Request Accepted</label>
            </div>
            <div>
            <div className="shop__sidebar__search serchrefund">
                <form>
                    <input
                      type="text"
                      placeholder="Search by Order ID..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="mr-5"
                    />
                    <button 
                        type="button" 
                        onClick={() => {setSearchTerm('');
                          window.location.reload();
                        }}
                        className="refunserbut"
                    >
                      Clear
                    </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {Array.isArray(filteredReturnData) && filteredReturnData.length === 0 ? (
          <div className="text-center mt-2">No Return details available...!</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">User Name</th>
                  <th scope="col">Order ID</th>
                  <th scope="col">Product</th>
                  <th scope="col">Total Amount</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((displayreturnorderdata, index) => (
                  <tr key={displayreturnorderdata._id}>
                    <td>{indexOfFirstProduct + index + 1}</td>
                    <td className="overhieed">{displayreturnorderdata.UserName}</td>
                    <td>{displayreturnorderdata.order_id}</td>
                    <td>
                      {Array.isArray(displayreturnorderdata.products) ? (
                        <ul>
                          {displayreturnorderdata.products.map((product, i) => (
                            <li key={i}>
                              {product.product_name} - {product.quantity} x {product.price}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "No products"
                      )}
                    </td>
                    <td>{displayreturnorderdata.totalAmount}</td>
                    <td>
                      <select
                        value={displayreturnorderdata.Retunorder_status}
                        onChange={(e) =>
                          handleStatusChange(displayreturnorderdata._id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Request-Accpet">Request Accepted</option>
                        <option value="Refund">Refund</option>
                      </select>
                    </td>
                    <td>
                      <a
                        href={`/returnorderdetils`}
                        className="ordeview"
                        onClick={() => {
                          sessionStorage.removeItem("displayretunorderid");
                          sessionStorage.setItem("displayretunorderid", displayreturnorderdata._id);
                          window.location.href = `/returnorderdetils`;
                        }} >
                        View Details
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
            {paginationItems.map((item, index) =>
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
            )}
            {/* Next Button */}
            <button
              className={`pagination-button ${currentPage === totalPages ? "disabled" : ""}`}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(DisplayReturnOrder);
