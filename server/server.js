const express = require('express')
const bodyparser = require('body-parser')
const PORT=3000
const cors = require('cors')
const api= require('./routes/api')
const app= express()
app.use(cors())
app.use(bodyparser.json())
app.use('/api', api)
app.get('/', function(req,res)
{
res.send('Hello from server')
})

app.listen(PORT, function()
{
    console.log('server running on localhost:'+PORT)
})