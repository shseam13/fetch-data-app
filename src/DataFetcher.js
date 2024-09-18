// src/DataFetcher.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

const DataFetcher = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState([]);
  const [grossQuantity, setGrossQuantity] = useState(0);
  const [grossPrice, setGrossPrice] = useState(0);
  const [grossTotal, setGrossTotal] = useState(0);

  const fetchDataAndGenerateReport = async () => {
    setLoading(true);
    try {
      // Fetch data from the external API
      const response = await axios.get('https://raw.githubusercontent.com/Bit-Code-Technologies/mockapi/main/purchase.json');
      const data = response.data;
      console.log('Fetched Data:', data);
  
      // Store data in the backend
      const storeResponse = await axios.post('http://localhost:5000/api/storeData', { data });
  
      if (storeResponse.status === 200) {
        // Fetch the report from the backend
        const reportResponse = await axios.get('http://localhost:5000/api/report');
        console.log('Report Data:', reportResponse.data);
        setReport(reportResponse.data.report);

        // Calculate gross totals
        let totalQuantity = 0;
        let totalPrice = 0;
        let totalAmount = 0;
        reportResponse.data.report.forEach(item => {
          totalQuantity += Number(item.quantity);
          totalPrice += Number(item.price);
          totalAmount += Number(item.total);
        });
        setGrossQuantity(totalQuantity);
        setGrossPrice(totalPrice);
        setGrossTotal(totalAmount);

        alert('Data fetched, stored, and report generated successfully!');
      } else {
        console.error('Error response from server:', storeResponse);
        alert('Failed to store data.');
      }
    } catch (error) {
      console.error('Error fetching or storing data:', error);
      alert(`Failed to fetch or store data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Purchase Data</h1>
      <button onClick={fetchDataAndGenerateReport} disabled={loading}>
        {loading ? 'Generating Report...' : 'Generate Report'}
      </button>
      {loading && <p>Loading...</p>}
      {report.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Customer Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {report.map((item, index) => (
              <tr key={index}>
                <td>{item.product_name}</td>
                <td>{item.customer_name}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.total}</td>
              </tr>
            ))}
            <tr className="gross-total">
              <td colSpan="2"><strong>Gross Total</strong></td>
              <td><strong>{grossQuantity}</strong></td>
              <td><strong>{grossPrice}</strong></td>
              <td><strong>{grossTotal}</strong></td>
            </tr>
          </tbody>
        </table>
      )}
      <p> <i>seam.cse.pciu@gmail.com</i></p>
    </div>
  );
};

export default DataFetcher;
