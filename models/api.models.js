const db = require("../db/connection")
const fs = require("fs/promises")
const { checkExists } = require("./checkExists.models")

exports.selectAllTopics = () => {
    let queryString = `
    SELECT * FROM TOPICS;`

    return db.query(queryString)
    .then(({ rows }) => {
        return rows
    })
}

exports.selectApiEndPoints = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`, "utf8")
    .then(fileContents => {
        return fileContents
    })
    .then(fileContents => {
        fileContents = JSON.parse(fileContents)
        const fileKeys = Object.keys(fileContents)
        let apiEndpoints = {}

        fileKeys.forEach(key => {
            apiEndpoints[key] = {
                description: fileContents[key].description,
                acceptedQueries: fileContents[key].queries,
                expectedFormat: fileContents[key].format,
                exampleResponse: fileContents[key].exampleResponse
            }
        })
        return apiEndpoints
    })
}

exports.selectArticleById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({rows}) => {

        return rows
    })
}


