const { selectAllTopics, selectApiEndPoints, selectArticleById, selectArticles, selectArticleComments } = require("../models/api.models")


const getTopics = (req, res, next) => {
    selectAllTopics(req.query)
    .then((topics) => {
        res.status(200).send({ topics })
    })
}

const getApiEndpoints = (req, res) => {
    selectApiEndPoints(req.query)
    .then((endpoints) => {
        res.status(200).send({endpoints})
    })
}

const getArticleById = (req, res, next) => {
    let id = req.params.article_id
    selectArticleById(id)
    .then((rows) => {
            res.status(200).send(rows[0])
        })
    .catch(next)
}

const getArticles = (_, res, next) => {
    selectArticles()
    .then((rows) => {
        res.status(200).send(rows)
    })
    .catch(next)
}

module.exports = { getTopics, getApiEndpoints, getArticleById, getArticles, }