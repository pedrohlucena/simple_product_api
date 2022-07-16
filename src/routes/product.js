const express = require('express')
const { Model } = require('mongoose')

const router = express.Router()

const Product = require('../models/product')

router.get('/', async (req, res) => {
    try {
        const products = await Product.find({})
        res.send(products)
    } catch (error) {
        console.log(error)
    }
})

router.get('/sumPrices', async (req, res) => {
    try {
        let sumPrices = await Product.aggregate([
            { $project: { _id: 0, name: 1, price: 1 } },
            { $group: { _id: null, sumPrices: { $sum: "$price" } } },
            { $project: { _id: 0, sumPrices: 1 } },
        ]);
        sumPrices = sumPrices[0]
        res.send(sumPrices)
    } catch (error) {
        console.log(error)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.send(product)
    } catch (error) {
        console.log(error)
    }
})


router.post('/', async (req, res) => {
    const { name, price } = req.body
    const product = new Product({ name, price })
    try {
        await product.save()
        res.send(product)
    } catch (error) {
        console.log(error)
    }
})


router.put('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id)
    try {
        product.set(req.body)
        await product.save()
        res.send(product)
    } catch (error) {
        console.log(error)
    }
})

router.put('/:id', async (req, res) => {
    let { name } = req.body.checklist
    let checklist = await Checklist.findById(req.params.id)

    try {
        await checklist.update({ name })
        res.redirect('/checklists')
    } catch (error) {
        let errors = error.errors
        res.status(422).render('checklists/edit', { checklist: { ...checklist, errors } })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        res.send(product)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router