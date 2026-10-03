const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
    contactId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
});

module.exports = mongoose.model("Contact", ContactSchema);
