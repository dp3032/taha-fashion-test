import React, { useEffect, useState } from 'react';
import LeftSide from '../AdminComponent/LeftSide';
import NotifactionAdmin from '../AdminComponent/NotifactionAdmin';

const Transactions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_BASE_URL;
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${apiUrl}/order-api/transactions`, {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY, 
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const data = await response.json();
        setTransactions(data.transactions); // Update the state with all transactions
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTransactions();
  }, [apiUrl]);

  // Calculate the total number of pages
  const totalPages = Math.ceil(transactions.length / productsPerPage);

  // Get the products for the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = transactions.slice(indexOfFirstProduct, indexOfLastProduct);

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
        <div>
            
            <LeftSide/>

            <div className="bord">
                <section className="breadcrumb-option">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="breadcrumb__text">
                                    <h4> Transactions Detils </h4>
                                    <div className="breadcrumb__links">
                                        <a href="/dashboard"> Dashboard </a>
                                        <span>Transactions Display</span>
                                    </div>
                                </div>
                            </div>
                            <NotifactionAdmin/>
                        </div>
                    </div>
                </section>

                <br/> <br/>

                <div>
                  <p className="ml-3"> *Note : Recent Transaction Data Display Some Time Please Wait...! </p>
                </div>
                
              <div className="table-responsive">
                {loading ? (
                  <div>Loading transactions...</div>
                ) : error ? (
                  <div className="error-message">Error: {error}</div>
                ) : (
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th> # </th>
                        <th> Transaction ID </th>
                        <th> Order ID </th>
                        <th> Amount </th>
                        <th> Status </th>
                        <th> Date & Time </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentProducts.map((transaction, index) => (
                        <tr key={transaction.id}>
                          <td>{indexOfFirstProduct + index + 1}</td>
                          <td>{transaction.id}</td>
                          <td>{transaction.order_id}</td> {/* Show the order ID */}
                          <td>{transaction.amount / 100} INR</td>
                          <td>{transaction.status}</td>
                          <td>{new Date(transaction.created_at * 1000).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
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
        </div>
    </>
  );
};

export default React.memo(Transactions);
