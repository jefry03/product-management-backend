const Product = require("../models/Product");
const router = require("express").Router();
const {standardLimiter} = require('../middleware/rateLimiter')
const mongoose = require('mongoose')
router.post("/", async (req, res) => {
    try {
        const { title, description, category, price, quantity } = req.body;
        const creatproduct = await Product.create({
            title,
            description,
            category,
            price,
            quantity
        });
        res.status(201).json(creatproduct);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "Product with this name already exists" });
        }
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/", async (req , res) => {
    try {
        const allProducts = await Product.find();
        res.status(200).json(allProducts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const foundProduct = await Product.findById(req.params.id);
        if (!foundProduct) {
            return res.status(404).json({ message: "product not found" });
        }
        res.status(200).json(foundProduct);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { title, description, category, price, quantity } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { title, description, category, price, quantity },
            { new: true, runValidators: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product Not Found" });
        }
        res.status(200).json(updatedProduct);
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: err.message });
        }
        if (err.code === 11000) {
            return res.status(409).json({ message: "Product with this name already exists" });
        }
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product Not Found" });
        }
        res.sendStatus(204);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;