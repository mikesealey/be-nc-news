const express = require('express')
const { getTopics, getApiEndpoints, getArticleById, getArticles, getCommentsByArticleId, postComment, patchVotes, deleteComment, getUsers, getUser, patchCommentVotes, postArticle } = require("./controllers/api.controllers")
const { psqlErrorHandler, customErrorHandler } = require("./errors")

const app = express()
app.use(express.json())

app.get("/api/topics", getTopics) // Ticket2
app.get("/api", getApiEndpoints) // Ticket3
app.get("/api/articles/:article_id", getArticleById) // Ticket4 AND Ticket 12
app.get("/api/articles", getArticles)  // Ticket5 AND Ticket 11
app.get("/api/articles/:article_id/comments", getCommentsByArticleId) // Ticket6

app.post("/api/articles/:article_id/comments", postComment)// Ticket 7

app.patch("/api/articles/:article_id", patchVotes)//Ticket 8

app.delete("/api/comments/:comment_id", deleteComment)//Ticket 9

app.get("/api/users", getUsers) // Ticket 10

app.get("/api/users/:username", getUser) // Ticket 16

app.patch("/api/comments/:comment_id", patchCommentVotes) // Ticket 17

app.post("/api/articles", postArticle) // Ticket 18

app.use(psqlErrorHandler)
app.use(customErrorHandler)

// Catch-all error handling - Must occur last
app.all("/*", function (req, res, next) { 
    res.status(404).send(({msg: "Not found"}))
})



module.exports = app