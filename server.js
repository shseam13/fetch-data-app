// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const moment = require('moment');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'your_password', // Replace with your MySQL root password
  database: 'bitcode_test_db'
};

app.post('/api/storeData', async (req, res) => {
  const data = req.body.data;

  const connection = await mysql.createConnection(dbConfig);
  await connection.beginTransaction();

  try {
    // Clear existing data
    await connection.execute('DELETE FROM PurchaseHistory');
    await connection.execute('DELETE FROM Users');
    await connection.execute('DELETE FROM Products');

    for (const item of data) {
      // Validate and truncate phone number if necessary
      const phone = item.user_phone.length > 15 ? item.user_phone.substring(0, 15) : item.user_phone;

      const [userResult] = await connection.execute(
        'INSERT INTO Users (name, phone) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), phone = VALUES(phone)',
        [item.name, phone]
      );

      const userId = userResult.insertId || (await connection.execute(
        'SELECT user_id FROM Users WHERE phone = ?',
        [phone]
      ))[0][0].user_id;

      const [productResult] = await connection.execute(
        'INSERT INTO Products (product_code, product_name, price) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE product_name = VALUES(product_name), price = VALUES(price)',
        [item.product_code, item.product_name, item.product_price]
      );

      const productId = productResult.insertId || (await connection.execute(
        'SELECT product_id FROM Products WHERE product_code = ?',
        [item.product_code]
      ))[0][0].product_id;

      const formattedDate = moment(item.created_at).format('YYYY-MM-DD HH:mm:ss');

      await connection.execute(
        'INSERT INTO PurchaseHistory (user_id, product_id, order_no, quantity, purchase_date) VALUES (?, ?, ?, ?, ?)',
        [userId, productId, item.order_no, item.purchase_quantity, formattedDate]
      );
    }

    await connection.commit();
    res.send('Data stored successfully!');
  } catch (error) {
    await connection.rollback();
    console.error('Error storing data:', error);
    res.status(500).send(`Failed to store data: ${error.message}`);
  } finally {
    await connection.end();
  }
});

app.get('/api/report', async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);

  try {
    const [rows] = await connection.execute(`
      SELECT 
        Users.name AS customer_name,
        Products.product_name,
        SUM(PurchaseHistory.quantity) AS quantity,
        Products.price,
        (SUM(PurchaseHistory.quantity) * Products.price) AS total
      FROM 
        PurchaseHistory
      JOIN 
        Users ON PurchaseHistory.user_id = Users.user_id
      JOIN 
        Products ON PurchaseHistory.product_id = Products.product_id
      GROUP BY 
        Users.name, Products.product_name, Products.price
      ORDER BY 
        total DESC
    `);

    console.log('Report Rows:', rows);

    let grossTotal = 0;
    rows.forEach(row => {
      grossTotal += row.total;
    });

    res.json({
      report: rows,
      grossTotal: grossTotal
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).send(`Failed to generate report: ${error.message}`);
  } finally {
    await connection.end();
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
