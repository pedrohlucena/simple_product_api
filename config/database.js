const mongoose = require('mongoose')
mongoose.Promise = global.Promise


mongoose.connect('mongodb://localhost/simple-product-api', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('Tamo conectado ao MongoDB! ARRRROCHAAAAA') })
    .catch((err) => { console.error(err) })