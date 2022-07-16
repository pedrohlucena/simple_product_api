const express = require('express')
const bodyParser = require('body-parser')

const productRouter = require('./src/routes/product')

require('./config/database')

const port = 3003

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use('/products', productRouter)

app.listen(port, () => console.log(`O bixo ta de pé na porta ${port}`))