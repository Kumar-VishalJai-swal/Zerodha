require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');

const { HoldingModel } = require('./model/HoldingModel');
const { PositionModel } = require('./model/PositionModel');
const { OrderModel } = require('./model/OrderModel');
const User = require('./model/UserModel');

const cookieParser = require("cookie-parser");
const { Signup, Login } = require('./controllers/AuthController');

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/allHoldings", async (req, res) => {
    let allHoldings = await HoldingModel.find({});
    res.json(allHoldings);
});
app.get("/allPosition", async (req, res) => {
    let allPosition = await PositionModel.find({});
    res.json(allPosition);
});
app.get("/allOrders", async (req, res) => {
    let allOrders = await OrderModel.find({});
    res.json(allOrders);
});

const path = require('path');
app.use(express.static(path.join(__dirname, '../dashboard/build')));

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../dashboard/build', 'index.html'));
});

app.get("/user", async (req, res) => {
    try {
        const user = await User.findOne(); // Adjust query as needed
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.post("/signup", Signup);
app.post("/login", Login);

app.listen(PORT, () => {
    console.log("App is starting");
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("DataBase connected!");
});
