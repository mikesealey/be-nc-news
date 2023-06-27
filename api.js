const express = require('express')
const { getTopics, getApiEndpoints, getArticleById } = require("./controllers/api.controllers")

const app = express()
app.use(express.json())

app.get("/api/topics", getTopics)
app.get("/api", getApiEndpoints)
app.get("/api/articles/:article_id", getArticleById)

// Catch-all error handling - Must occur last
app.get("/*", function (req, res, next) { 
    res.status(404).send(({msg: "Not found"}))
})

module.exports = app