// 1. Import all necessary packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Loads environment variables from .env file

// 2. Import your Product model
const Product = require('./models/Product');

// 3. Initialize the app
const app = express();
const PORT = process.env.PORT || 5000;

// 4. Use middleware
app.use(cors()); 
app.use(express.json()); 

// 5. Connect to your MongoDB database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- API ROUTES ---

/*
 * @route   POST /api/products
 * @desc    Add a new product to the database (UPDATED)
 */
app.post('/api/products', async (req, res) => {
    try {
        // --- UPDATED ---
        const { barcode, name, quantity, expiryDate } = req.body;

        // Check if required fields are missing
        if (!barcode || !name || !expiryDate) {
            return res.status(400).json({ message: 'Barcode, Name, and Expiry Date are required.' });
        }

        // Check if a product with this barcode already exists
        const existingProduct = await Product.findOne({ barcode: barcode });
        if (existingProduct) {
            return res.status(409).json({ message: 'A product with this barcode already exists.' });
        }

        // Create and save the new product (UPDATED)
        const newProduct = new Product({
            barcode,
            name,
            quantity,
            expiryDate
        });

        await newProduct.save();
        res.status(201).json(newProduct); 

    // --- THIS BLOCK IS NOW FIXED ---
    } catch (error) { 
        console.error(error);
        res.status(500).json({ message: 'Server error while adding product.' });
    }
    // ---------------------------------
});

/*
 * @route   GET /api/products/:barcode
 * @desc    Get a product's info by its barcode
 */
app.get('/api/products/:barcode', async (req, res) => {
    try {
        const barcode = req.params.barcode;
        const product = await Product.findOne({ barcode: barcode });

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(200).json(product);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching product.' });
    }
});

/*
 * @route   GET /api/products
 * @desc    Get ALL products from the database
 */
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ expiryDate: 1 });
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching all products.' });
    }
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});