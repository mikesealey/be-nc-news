const { selectAllTopics, selectApiEndPoints, selectArticleById, selectArticles, selectCommentsByArticleId, sendComment, updateVotes, removeComment, selectUsers, selectUser, updateCommentVotes, sendArticle } = require("../models/api.models")


// Ticket 2
const getTopics = (req, res, next) => {
    selectAllTopics(req.query)
    .then((topics) => {
        res.status(200).send({ topics })
    })
    .catch(next)
}
// Ticket 3
const getApiEndpoints = (req, res) => {
    selectApiEndPoints()
    .then((endpoints) => {
        res.status(200).send({endpoints})
    })
}
// Ticket 4 & Ticket 12
const getArticleById = (req, res, next) => {
    let id = req.params.article_id
    selectArticleById(id)
    .then((rows) => {
            res.status(200).send(rows[0])
        })
    .catch(next)
}
// Ticket 5 & Ticket 11
const getArticles = (req, res, next) => {
    const topic = req.query.topic
    console.log("TOPIC IS: ", topic)
    const sort_by = req.query.sort_by
    const order = req.query.order
    selectArticles(topic, sort_by, order)
    .then((rows) => {
        res.status(200).send(rows)

    })
    .catch((err) => {
        console.log(err)
        console.log("In the catch block")
    })
}
// Ticket 6
const getCommentsByArticleId = (req, res, next) => {
    let id = req.params.article_id
    selectCommentsByArticleId(id)
    .then((rows) => {
        res.status(200).send(rows)
    })
    .catch(next)
}
// Ticket 7
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
// Ticket 16
const getUser = (req, res, next) => {
    const username = req.params.username
    selectUser(username)
    .then((rows) => {
        res.status(200).send(rows)
    })
    .catch(next)
}
// Ticket 17
const patchCommentVotes = (req, res, next) => {
    const commentId = req.params.comment_id
    const vote = req.body.inc_votes
    updateCommentVotes(commentId, vote)
    .then((rows) =>{
        res.status(200).send(rows)
    })
    .catch(next)
}
// Ticket 18
const postArticle = (req, res, next) => {
    const article = req.body
    sendArticle(article)
    .then((rows) => {
        res.status(200).send(rows)
    })
    .catch(next)
}

module.exports = { getTopics, getApiEndpoints, getArticleById, getArticles, getCommentsByArticleId, postComment, patchVotes, deleteComment, getUsers, getUser, patchCommentVotes, postArticle }
