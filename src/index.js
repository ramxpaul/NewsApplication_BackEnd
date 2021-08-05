const express = require('express')
const app = express()
const port = 3000 || process.env.PORT
require('./db/mongoose')

//link angular with nodes
const cors=require('cors')
app.use(cors())


app.use(express.json())

const repoterRouter = require('./routers/reporters')
app.use(repoterRouter)

const newsRouter = require('./routers/news')
app.use(newsRouter)



app.listen(port, () => {
    console.log('Server Loading success')
})