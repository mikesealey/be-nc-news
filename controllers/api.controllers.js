const { selectAllTopics, selectApiEndPoints } = require("../models/api.models")

const getTopics = (req, res, next) => {
    selectAllTopics(req.query)
    .then((topics) => {
        res.status(200).send({ topics })
    })

}



module.exports = { getTopics}