const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const vendorRoutes = require('./routes/vendorRoutes');
const firmRoutes=require('./routes/FirmRoutes')
const productRoutes=require('./routes/productRoutes');
const path = require("path");
const cors=require('cors');

require('dotenv').config();

const app = express();
const port =process.env.PORT||4000;
app.use(cors());
// middleware
app.use(bodyParser.json());
app.use('/Firm',firmRoutes)
app.use('/product',productRoutes)
app.use('/uploads',express.static('uploads'))
// routes
app.get('/', (req, res) => {
  res.send('WELCOME TO FIRST');
});

app.use('/vendor', vendorRoutes);

// mongodb (optional for server)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB error:', err.message));

// 🚨 MUST BE LAST
app.listen(port, () => {
  console.log(`Server started and running at ${port}`);
});
