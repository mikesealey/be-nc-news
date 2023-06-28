const express = require('express')
const { getTopics, getApiEndpoints, getArticleById, getArticles, getCommentsByArticleId } = require("./controllers/api.controllers")
const { psqlErrorHandler, customErrorHandler } = require("./errors")

const app = express()

app.get("/api/topics", getTopics) // Ticket2
app.get("/api", getApiEndpoints) // Ticket3
app.get("/api/articles/:article_id", getArticleById) // Ticket4
app.get("/api/articles", getArticles)  // Ticket5
app.get("/api/articles/:article_id/comments", getCommentsByArticleId) // Ticket6

app.use(customErrorHandler)
app.use(psqlErrorHandler)



// Catch-all error handling - Must occur last
app.all("/*", function (req, res, next) { 
    res.status(404).send(({msg: "Not found"}))
})

module.exports = app