const { selectAllTopics, selectApiEndPoints, selectArticleById, selectArticles } = require("../models/api.models")


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

const getArticleById = (req, res) => {
    let id = req.params.article_id
    selectArticleById(id)
    .then((rows) => {
        if (rows.length === 0) {
            res.status(404).send({msg: "Not found"})
        } else {
            res.status(200).send(rows[0])
        }
    })
}

const getArticles = (_, res) => {
    selectArticles()
    .then((rows) => {
        if (rows.length === 0) {
            res.status(404).send({msg: "Not found"})
        } else {
            //console.log(rows)
            console.log("In the happy path controller")
            res.status(200).send(rows)
        }
    })
}



module.exports = { getTopics, getApiEndpoints, getArticleById, getArticles }