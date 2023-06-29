const express = require('express')
const { getTopics, getApiEndpoints, getArticleById,  postComment } = require("./controllers/api.controllers")
const { psqlErrorHandler, customErrorHandler } = require("./errors")

const app = express()
app.use(express.json())

app.get("/api/topics", getTopics)
app.get("/api", getApiEndpoints)
app.get("/api/articles/:article_id", getArticleById)



app.post("/api/articles/:article_id/comments", postComment)


app.use(customErrorHandler)
app.use(psqlErrorHandler)



// Catch-all error handling - Must occur last
app.all("/*", function (req, res, next) { 
    res.status(404).send(({msg: "Not found"}))
})

module.exports = app