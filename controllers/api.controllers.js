const { selectAllTopics, selectApiEndPoints, selectArticleById, selectArticles, selectCommentsByArticleId, sendComment, updateVotes, removeComment, selectUsers } = require("../models/api.models")


// Ticket2
const getTopics = (req, res, next) => {
    selectAllTopics(req.query)
    .then((topics) => {
        res.status(200).send({ topics })
    })
    .catch(next)
}
// Ticket3
const getApiEndpoints = (req, res) => {
    selectApiEndPoints()
    .then((endpoints) => {
        res.status(200).send({endpoints})
    })
    //.catch(next)
}
// Ticket4
const getArticleById = (req, res, next) => {
    let id = req.params.article_id
    selectArticleById(id)
    .then((rows) => {
            res.status(200).send(rows[0])
        })
    .catch(next)
}
// Ticket5
const getArticles = (req, res, next) => {
    selectArticles()
    .then((rows) => {
        res.status(200).send(rows)
    })
    .catch(next)
}
// Ticket6
const getCommentsByArticleId = (req, res, next) => {
    let id = req.params.article_id
    selectCommentsByArticleId(id)
    .then((rows) => {
        res.status(200).send(rows)
    })
    .catch(next)
}
// Ticket7
const postComment = (req, res, next) => {
    let articleId = req.params.article_id
    let commentObject = req.body
    sendComment(articleId, commentObject)
    .then((body) => {
        res.status(201).send(body[0])
    })
    .catch(next)
}
// Ticket 8
const patchVotes = (req, res, next) => {
    const changeVote = req.body.inc_votes
    const articleId = req.params.article_id
    updateVotes(articleId, changeVote)
    .then((body) => {
        res.status(200).send(body[0])
    })
    .catch(next)
}
// Ticket 9
const deleteComment = (req, res, next) => {
    let id = req.params.comment_id
    removeComment(id)
    .then(() => {
        res.status(204).send()
    })
    .catch(next)
}
// Ticket 10
const getUsers = (req, res, next) => {
    selectUsers()
    .then((rows) => {
        res.status(200).send(rows)
    })
    .catch(next)
}

module.exports = { getTopics, getApiEndpoints, getArticleById, getArticles, getCommentsByArticleId, postComment, patchVotes, deleteComment, getUsers }
