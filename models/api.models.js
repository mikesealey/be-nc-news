const db = require("../db/connection")
const fs = require("fs")

exports.selectAllTopics = () => {
    let queryString = `
    SELECT * FROM TOPICS;`

    return db.query(queryString)
    .then(({ rows }) => {
        return rows
    })
}
