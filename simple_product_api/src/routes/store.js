const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()

const Store = require('../models/store')

router.get('/', async (req, res) => {
    try {
        const stores = await Store.find()
        res.status(200).json({stores: stores})
    } catch (error) {
        console.log(error)
        res.send({ error: 'Erro ao buscar pelas lojas' })
    }
})

router.get('/:id/sumPrices', async (req, res) => {
    const storeId = req.params.id
    try {
        let sumPrices = await Store.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(storeId) } },
            { $project: { _id: 0, name: 1, products: 1 } },
            { $unwind: "$products" },
            { $group: { _id: null, name: { $first: "$name" }, sumPrices: { $sum: "$products.price" } } },
            { $project: { _id: 0, storeName: "$name", sumPrices: 1 } }
        ])
        sumPrices = sumPrices[0]
        res.status(200).json(sumPrices)
    } catch (error) {
        console.log(error)
        res.send({ error: 'Erro ao somar os preços dos produtos da loja' })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const store = await Store.findById(req.params.id)
        res.status(200).json(store)
    } catch (error) {
        console.log(error)
        res.send({ error: 'Erro ao somar buscar pela loja' })
    }
})

router.post('/', async (req, res) => {
    const { name, CNPJ, products } = req.body
    try {
        let store
        if (products) store = await Store.create({ name, CNPJ, products })
        else store = await Store.create({ name, CNPJ })
        res.sendStatus(201)
    } catch (error) {
        console.log(error)
        res.send({ error: 'Erro ao cadastrar loja' })
    }
})

router.post('/:id', async (req, res) => {
    const store = await Store.findById(req.params.id)
    const products = req.body.products

    try {
        products.forEach(product => {
            store.products.push(product)
        });
        await store.save()
        res.sendStatus(201)
    } catch (error) {
        console.log(error)
        res.send({ error: 'Erro ao cadastrar o produto para a loja' })
    }
})

router.put('/:id', async (req, res) => {
    const store = await Store.findById(req.params.id)
    try {
        store.set(req.body)
        await store.save()
        res.sendStatus(204)
    } catch (error) {
        console.log(error)
        res.send({ error: 'Erro ao atualizar loja' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await Store.findByIdAndDelete(req.params.id)
        res.sendStatus(204)
    } catch (error) {
        console.log(error)
        res.send({ error: 'Erro ao deletar loja' })
    }
})

router.delete('/:id/deleteProducts', async (req, res) => {
    try {
        const store = await Store.findById(req.params.id)
        store.products = []
        store.save()
        res.sendStatus(204)
    } catch (error) {
        console.log(error)
        res.send({ error: 'Erro ao deletar os produtos loja' })
    }
})

router.delete('/:storeId/:productId', async (req, res) => {
    try {
        const store = await Store.findById(req.params.storeId)
        const product = store.products.find(product => product._id == req.params.productId)
        const indexOfProduct = store.products.indexOf(product);
        if (indexOfProduct > -1) store.products.splice(indexOfProduct, 1);
        else throw new Error('Erro ao deletar o produto loja')
        store.save()
        res.sendStatus(204)
    } catch (error) {
        console.log(error)
        res.send({ error: 'Erro ao deletar o produto loja' })
    }
})

module.exports = router