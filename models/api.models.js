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
    console.log(id)


    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({rows}) => {
        console.log(">>>>>>>>>>>",rows)
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "Not found"})
        } else {
            console.log(rows)
            return rows[0]
        }
        
    })
}


