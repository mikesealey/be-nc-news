const { type } = require("os")
const db = require("../db/connection")
const fs = require("fs/promises")

// Ticket2
exports.selectAllTopics = () => {
    let queryString = `
    SELECT * FROM TOPICS;`

    return db.query(queryString)
    .then(({ rows }) => {
        return rows
    })
}
// Ticket3
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
// Ticket4
exports.selectArticleById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "Not found"})
        }
        return rows
    })
}
// Ticket5
exports.selectArticles = () => {
    return db.query(`
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`)
    .then(({rows}) => {
        if (rows.length === 0) {
            res.status(404).send({msg: "Not found"})
        }
        return rows
    })
}
// Ticket6
exports.selectCommentsByArticleId = (id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [id])
    .then(({rows}) => {
        return rows
    })
}

// Ticket7
exports.sendComment = (article_id, commentObject) => {
    console.log("In the model")
    return db.query(`
    INSERT INTO comments (body, article_id, author)
    VALUES ($1, $2, $3)
    RETURNING *;`, [commentObject.body, article_id, commentObject.user_name])
    .then(({rows}) => {
        console.log(rows)
        return rows[0]
    })
    
}
