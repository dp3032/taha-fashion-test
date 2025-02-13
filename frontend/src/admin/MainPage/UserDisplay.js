import React, { useEffect, useState } from 'react'
import LeftSide from '../AdminComponent/LeftSide';
import NotifactionAdmin from '../AdminComponent/NotifactionAdmin';

const UserDisplay = () => {
    
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const [userdata,Setuserdata] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    
    useEffect(() => {
        fetch(`${apiUrl}/user-log-reg/userdisplay`,{
            headers: {
                "x-api-key": process.env.REACT_APP_API_KEY, // Use environment variable
            },
        })
        .then((response) => response.json())
        .then((data) => Setuserdata(data))
        .catch((error) => console.log("Something Wrong",error))
    },[apiUrl])

    // Calculate the total number of pages
  const totalPages = Math.ceil(userdata.length / productsPerPage);

  // Get the products for the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = userdata.slice(indexOfFirstProduct, indexOfLastProduct);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Generate the page numbers to display with ellipses
  const pageNumbers = [];
   // Max number of pages to show in pagination

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pageNumbers.push(i);
    }
  }

  // Add ellipses for pages that are not shown
  const paginationItems = [];
  for (let i = 0; i < pageNumbers.length; i++) {
    if (i > 0 && pageNumbers[i] - pageNumbers[i - 1] > 1) {
      paginationItems.push("...");
    }
    paginationItems.push(pageNumbers[i]);
  }
    return (
    <>
        <LeftSide/>
            <div className="bord">

            
            <section className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__text">
                                <h4> User Detils </h4>
                                <div className="breadcrumb__links">
                                    <a href="/dashboard"> Dashboard </a>
                                    <span>User Display</span>
                                </div>
                            </div>
                        </div>
                        <NotifactionAdmin/>
                    </div>
                </div>
            </section>

            <div className="row-container justify-content-end">
                <div className="item-box"><a href="/displayorder">Total User : {userdata.length}</a></div>
            </div>

            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">User Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Order Count</th>
                            <th scope="col">Registration Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((displayorderdata, index) => (
                            <tr key={displayorderdata._id}>
                                <td>{indexOfFirstProduct + index + 1}</td>
                                <td>{displayorderdata.user_name}</td>
                                <td>{displayorderdata.user_email}</td>
                                <td> {displayorderdata.orderCount} </td>
                                <td>{displayorderdata.registration_date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {/* Pagination Start */}
                <div className="pagination-container">
                    <div className="pagination-right">
                        <button className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
                                onClick={() => handlePageChange(currentPage - 1)}>
                            Prev
                        </button>

                        {/* Page Numbers */}
                        {paginationItems.map((item, index) => (
                            item === "..." ? (
                                <span key={index} className="pagination-ellipsis">...</span>
                            ) : (
                                <button key={index} className={`pagination-button ${currentPage === item ? "active" : ""}`}
                                        onClick={() => handlePageChange(item)} >
                                    {item}
                                </button>
                            )
                        ))}

                        {/* Next Button */}
                        <button
                            className={`pagination-button ${currentPage === totalPages ? "disabled" : ""}`}
                            onClick={() => handlePageChange(currentPage + 1)} >
                            Next
                        </button>
                    </div>
                </div>
    {/* Pagination End */}
            </div>
            </div>
    </>
  )
}

export default React.memo(UserDisplay);