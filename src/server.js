const express = require('express')
const database = require('./database')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

const port = 3003

app.get('/products', (req, res) => {
    const productsList = database.getProducts()
    res.send(productsList)
})

app.get('/products/:id', (req, res) => {
    const product = database.getProduct(req.params.id)
    res.send(product)
})

app.post('/products', (req, res) => {
    const { name, price } = req.body
    const product = database.saveProduct({ name, price })
    res.send(product)
})

app.put('/products/:id', (req, res) => {
    const { name, price } = req.body
    const product = database.saveProduct({ id: req.params.id, name, price })
    res.send(product)
})

app.delete('/products/:id', (req, res) => {
    const product = database.deleteProduct(req.params.id)
    res.send(product)
})

app.listen(port, () => console.log(`O bixo ta de pé na porta ${port}`))