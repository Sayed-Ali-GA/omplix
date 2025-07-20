const express = require('express')
const app = express()
















const port = process.env.PORT ? process.env.PORT : "3000"
app.listen(port, () => {
    console.log(`The express app is ready on port ${port}`)
})