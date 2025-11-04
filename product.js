const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the structure of a product in the database
const ProductSchema = new Schema({
    barcode: {
        type: String,
        required: true,
        unique: true // No two products can have the same barcode
    },
    // --- NEW FIELD ---
    name: {
        type: String,
        required: true
    },
    // --- NEW FIELD ---
    quantity: {
        type: String, // e.g., "1 Litre", "500g", "12-pack"
        required: false 
    },
    expiryDate: {
        type: Date,
        required: true
    }
});

// Export the model
module.exports = mongoose.model('Product', ProductSchema);