import { useEffect, useState } from "react";
import React from "react";
import LeftSide from "../AdminComponent/LeftSide";
import NotifactionAdmin from "../AdminComponent/NotifactionAdmin";

function AdminContact(){
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const [contactdata,Setcontactdata] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    
    useEffect( () => {
        fetch(`${apiUrl}/contact-form-api/displaycontactform`,{
            headers: {
                "x-api-key": process.env.REACT_APP_API_KEY, // Use environment variable
            },
        })
        .then((response) => response.json())
        .then((data) =>{
            Setcontactdata(data);})
        .catch((error) => console.log("Something Wrong",error));
    });

    // Calculate the total number of pages
  const totalPages = Math.ceil(contactdata.length / productsPerPage);

  // Get the products for the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = contactdata.slice(indexOfFirstProduct, indexOfLastProduct);

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
    
    return(
        <>
            <LeftSide/>
            <div className="bord">

            
                <section className="breadcrumb-option">
                  <div className="container">
                      <div className="row">
                          <div className="col-lg-12">
                              <div className="breadcrumb__text">
                                  <h4> Contact Detils </h4>
                                  <div className="breadcrumb__links">
                                      <a href="/dashboard"> Dashboard </a>
                                      <span>Contact Display</span>
                                  </div>
                              </div>
                          </div>
                          <NotifactionAdmin/>
                      </div>
                  </div>
                </section>

            <div className="row-container justify-content-end">
                <div className="item-box"><a href="/admincontact"> Total Contact : {contactdata.length} </a> </div> 
            </div>

            
                <div className="table-responsive">
                <table className="table table-hover">
                
                <thead>
                
                    <tr>
                        <th scope="col" > # </th>
                        <th scope="col"> Name </th>
                        <th scope="col"> Email </th>
                        <th scope="col"> Contact Number </th>
                        <th scope="col"> Message </th>
                        <th scope="col"> Time </th>
                    </tr>
                </thead>
                <tbody>
                {currentProducts.map((displaycondata, index) => (
                    <tr key={displaycondata._id}>
                        <td> {indexOfFirstProduct + index + 1} </td>
                        <td> {displaycondata.Contact_name} </td>
                        <td> {displaycondata.Contact_email} </td>
                        <td> {displaycondata.Contact_number} </td>
                        <td> {displaycondata.Contact_msg} </td>
                        <td> {displaycondata.contact_time} </td>
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

export default React.memo(AdminContact);