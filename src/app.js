const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Contact = require("./models/Contact");

dotenv.config();

const app = express();

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Error:", err.message));

// CREATE
app.post("/contacts", async (req, res) => {
    try {
        const contact = await Contact.create(req.body);
        res.status(201).json(contact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// READ ALL
app.get("/contacts", async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ ONE
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
        res.status(500).json({ message: error.message });
    }
});

// UPDATE
app.put("/contacts/:id", async (req, res) => {
    try {
        const contact = await Contact.findOneAndUpdate(
            { contactId: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({
                message: "Contact not found"
            });
        }

        res.json(contact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE
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
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});