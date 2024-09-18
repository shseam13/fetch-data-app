# FETCH DATA APP

This project is a React application that fetches purchase data from an external API, stores it in a MySQL database, and generates a report based on the stored data. The backend is built using Node.js and Express.

## Features

- Fetches purchase data from an external API.
- Stores the fetched data in a MySQL database.
- Generates a report based on the stored data.
- Displays the report in a tabular format with a gross total.

## Technologies Used

- **Frontend**: React, Axios
- **Backend**: Node.js, Express, MySQL
- **Database**: MySQL
- **Styling**: CSS

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/fetch-data-app.git
    cd fetch-data-app
    ```

2. **Install dependencies**:
    ```bash
    # For the frontend
    cd src
    npm install

    # For the backend
    cd ..
    npm install
    ```

3. **Set up the MySQL database**:
    - Create a MySQL database named `bitcode_test_db`.
    - Update the `dbConfig` in `server.js` with your MySQL credentials.

4. **Run the backend server**:
    ```bash
    node server.js
    ```

5. **Run the frontend application**:
    ```bash
    cd src
    npm start
    ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Click the "Generate Report" button to fetch data, store it in the database, and generate the report.
3. The report will be displayed in a table with the gross total for quantity, price, and total.

## Project Structure

```plaintext
fetch-data-app/
├── src/                    # React frontend
│   ├── App.css
│   ├── App.js
│   ├── DataFetcher.js
│   └── index.js
├── server.js               # Node.js backend
└── README.md

## Contact
**seam.cse.pciu@gmai.com**
**+8801626014236**
