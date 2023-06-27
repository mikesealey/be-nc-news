const { selectAllTopics, selectApiEndPoints } = require("../models/api.models")

const getTopics = (req, res, next) => {
    selectAllTopics(req.query)
    .then((topics) => {
        res.status(200).send({ topics })
    })
}

const getApiEndpoints = (req, res) => {
    selectApiEndPoints(req.query)
    .then((endpoints) => {
        console.log(endpoints)
        res.status(200).send({endpoints})
    })
}



module.exports = { getTopics, getApiEndpoints}