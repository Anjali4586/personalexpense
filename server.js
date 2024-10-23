const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/database');
const transactionRoutes = require('./routes/transactions');

const app = express();
app.use(bodyParser.json());

app.use('/transactions', transactionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
