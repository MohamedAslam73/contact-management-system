const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

const Contact = require("./models/Contact");

dotenv.config();

const app = express();

app.use(express.json());

// Home Route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Error:", err.message));

// CREATE - Add a new contact
app.post("/contacts", async (req, res) => {
    try {
        const contact = await Contact.create(req.body);
        res.status(201).json(contact);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// READ - Get all contacts
app.get("/contacts", async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// READ - Get contact by ID
app.get("/contacts/:id", async (req, res) => {
    try {
        const contact = await Contact.findOne({
            contactId: req.params.id
        });

        if (!contact) {
            return res.status(404).json({
                message: "Contact not found"
            });
        }

        res.json(contact);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// UPDATE - Update contact
app.put("/contacts/:id", async (req, res) => {
    try {
        const contact = await Contact.findOneAndUpdate(
            { contactId: req.params.id },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!contact) {
            return res.status(404).json({
                message: "Contact not found"
            });
        }

        res.json(contact);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// DELETE - Delete contact
app.delete("/contacts/:id", async (req, res) => {
    try {
        const contact = await Contact.findOneAndDelete({
            contactId: req.params.id
        });

        if (!contact) {
            return res.status(404).json({
                message: "Contact not found"
            });
        }

        res.json({
            message: "Contact deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});