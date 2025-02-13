import React, { useState } from 'react';
import axios from 'axios';
import LeftSide from '../AdminComponent/LeftSide';
import { jsPDF } from 'jspdf';

const ProductReport = () => {
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  const fetchReport = async () => {
    if (!month || !year) {
      setError('Please select both month and year');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.get(`${apiUrl}/all-report/report/monthly/product?month=${month}&year=${year}`,{
        headers: {
            "x-api-key": process.env.REACT_APP_API_KEY, 
        },
    });
        setReport(response.data.products);
    } catch (err) {
      console.error('Error fetching report:', err);
      setError('Failed to fetch report. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
      const doc = new jsPDF();
      const header = ['No.', 'Product ID' ,'Product Name', 'Price', 'Category' , 'Date'];
    const columnWidths = [15, 50 , 40, 20, 30 , 30]; 
    
      const headerRowHeight = 10; 
      const baseRowHeight = 10; 
      let yPosition = 20;
      const lineHeight = 5; 
    
      // Add the report title
      doc.setFontSize(14);
      doc.text(`Monthly Product Report: ${months.find((m) => m.value === month)?.label} ${year}`, 20, 10);
    
      // Draw the table header
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      header.forEach((headerText, index) => {
        const xPos = columnWidths.slice(0, index).reduce((acc, width) => acc + width, 10);
        doc.text(headerText, xPos + 2, yPosition + 5);
        doc.rect(xPos, yPosition, columnWidths[index], headerRowHeight);
      });
    
      yPosition += headerRowHeight;
    
      // Draw the table rows
      doc.setFont('helvetica', 'normal');
      report.forEach((product, index) => {
        const rowData = [
          `${index + 1}`,  
          product._id,
          product.Product_name,
          String(product.Product_price),
          product.Product_category?.name || "N/A",
          new Date(product.createdAt).toLocaleDateString()
        ];
    
        // Calculate row height based on the tallest cell in the row
        const rowHeights = rowData.map((data, columnIndex) => {
          const lines = doc.splitTextToSize(data, columnWidths[columnIndex] - 5);
          return lines.length * lineHeight;
        });
        const rowHeight = Math.max(baseRowHeight, ...rowHeights);
    
        // Add the row content
        rowData.forEach((data, columnIndex) => {
          const xPos = columnWidths.slice(0, columnIndex).reduce((acc, width) => acc + width, 10);
          const lines = doc.splitTextToSize(data, columnWidths[columnIndex] - 5);
    
          lines.forEach((line, lineIndex) => {
            doc.text(line, xPos + 2, yPosition + lineIndex * lineHeight + 4);
          });
    
          doc.rect(xPos, yPosition, columnWidths[columnIndex], rowHeight);
        });
    
        yPosition += rowHeight;
    
        // Check if the page height is exceeded, and create a new page if needed
        if (yPosition + rowHeight > doc.internal.pageSize.height - 10) {
          doc.addPage();
          yPosition = 20; // Reset yPosition for the new page
        }
      });
    
      // Save the PDF
      doc.save(`Product_Report_${month}_${year}.pdf`);
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
                    <h4> Report Detils </h4>
                    <div className="breadcrumb__links">
                      <a href="/report"> Report </a>
                      <span>Product Report</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        <div className="user-report">
          <h2 className="user-report__title">Monthly Product Report</h2>
          <div className="user-report__controls">
            <label className="user-report__label">
              Select Month:
              <select
                className="user-report__dropdown"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">-- Select Month --</option>
                {months.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="user-report__label user-report__label--year">
              Select Year:
              <select
                className="user-report__dropdown"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">-- Select Year --</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>

            <button className="user-report__button" onClick={fetchReport}>
              Generate Report
            </button>
            <button className="user-report__button" onClick={generatePDF} disabled={report.length === 0}>
              Download PDF
            </button>
          </div>

          {error && <p className="user-report__error">{error}</p>}
          {loading ? (
            <p className="user-report__loading">Loading...</p>
          ) : (
            report.length > 0 && (
              <table className="user-report__table">
                <thead>
                  <tr>
                    <th> # </th>
                    <th> Product ID </th>
                    <th> Product Name </th>
                    <th> Price </th>
                    <th> Category </th>
                    <th> Image </th>
                    <th> Insert Date </th>
                  </tr>
                </thead>
                <tbody>
                  {report.slice().reverse().map((product, index) => (
                    <>
                        <tr key={product._id}>
                            <td> {index + 1} </td>
                            <td className="overhieed"> {product._id} </td>
                            <td className="overhieed"> {product.Product_name} </td>
                            <td> {product.Product_price} </td>
                            <td> {product.Product_category?.name || "N/A"} </td>
                            <td>
                                <img src={product.Product_img[0]} alt="Loading..." className="tbleimgwidt" />
                            </td>
                            <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                        </tr>
                    </>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(ProductReport);