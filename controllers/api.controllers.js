const { selectAllTopics, selectApiEndPoints } = require("../models/api.models")

const getTopics = (req, res, next) => {
    selectAllTopics(req.query)
    .then((topics) => {
        res.status(200).send({ topics })
    })
    .catch((error) => {
        console.log(error, "<<<<<<<<<<,")
    })
}

const getApi = (req, res) => {
    // selectApiEndPoints(req.query)
    // .then((endpoints) => {
    //     res.status(200).send({endpoints})
    // })
}

module.exports = { getTopics, getApi }