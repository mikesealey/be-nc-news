const express = require('express')
const { getTopics, getApi } = require("./controllers/api.controllers")

const app = express()
app.use(express.json())

app.get("/api/topics", getTopics)



// Catch-all error handling - Must occur last
app.get("/*", function (req, res, next) { 
    res.status(404).send(({msg: "Not found"}))
})

module.exports = app