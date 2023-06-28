const express = require('express')
const { getTopics, getApiEndpoints, getArticleById, getArticles } = require("./controllers/api.controllers")
const { psqlErrorHandler, customErrorHandler } = require("./errors")

const app = express()

app.get("/api/topics", getTopics)
app.get("/api", getApiEndpoints)
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles", getArticles)

app.use(customErrorHandler)
app.use(psqlErrorHandler)



// Catch-all error handling - Must occur last
app.all("/*", function (req, res, next) { 
    res.status(404).send(({msg: "Not found"}))
})

module.exports = app