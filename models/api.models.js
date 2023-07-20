const { type } = require("os")
const db = require("../db/connection")
const fs = require("fs/promises")
const pg = require("pg-format")

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
// Ticket4 & Ticket 12
exports.selectArticleById = (id) => {    
    return db.query(`
    SELECT articles.article_id, articles.author, articles.title, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    ;`, [id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "Not found"})
        }
        return rows
    })
}
// Ticket5 & Ticket 11
exports.selectArticles = (topic, sort_by, order) => {
    console.log("In the model")
    // const greenlistTopic = ["cats", "mitch"]
    const greenlistSortBy = ["articles.author", "articles.title", "articles.article_id", "articles.topic", "articles.created_at", "articles.votes", "comment_count" ]
    const greenlistOrder = ["ASC", "DESC"]
    
    // if (!greenlistTopic.includes(topic)) {
    //     topic = "all"
    // }

    if(!greenlistOrder.includes(order)) {
        order = "DESC"
    }

    if (!greenlistSortBy.includes(sort_by)){
        sort_by = "articles.created_at"
    }

    let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT (comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id `
    const valueArray = []
    if (topic) {
        queryString += `WHERE articles.topic = $1 `
        valueArray.push(topic)
    }
    queryString += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`

    console.log(queryString)

    return db.query(queryString, valueArray)
    .then(({rows}) => {
        return rows
    })

    // return db.query(`
    // SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    // COUNT(comments.article_id) AS comment_count 
    // FROM articles 
    // LEFT JOIN comments ON comments.article_id = articles.article_id
    // GROUP BY articles.article_id 
    // ORDER BY ${sort_by} ${order}
    // ;`, [])
    // .then(({rows}) => {
    //     return rows      
    // })
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
    return this.selectArticleById(article_id)
    .then((rows) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "Not found"})
        }
    })
    .then(() => {
        if (typeof commentObject.user_name !== "string" || commentObject.user_name.length === 0) {
            return Promise.reject({status: 400, msg: "Bad request"})
        }
    })
    .then(() => {
        if (typeof commentObject.body !== "string" || commentObject.body.length === 0) {
            return Promise.reject({status: 400, msg: "Bad request"})
        }
    })
    .then(() => {
        return db.query(`
        SELECT * FROM users WHERE username = $1;`, [commentObject.user_name])
    })
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "Not found"})
        }
    })
    .then(() => {
        return db.query(`
    INSERT INTO comments (body, article_id, author)
    VALUES ($1, $2, $3)
    RETURNING *;`, [commentObject.body, article_id, commentObject.user_name])
    })
    .then(({rows}) => {
        return rows
    })
}
// Ticket 8
exports.updateVotes = (articleId, votesObject) => {
    return this.selectArticleById(articleId)
    .then((rows) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "Not found"})
        }
    })
    .then(() => {
        if (Number.isNaN(votesObject) || !votesObject) {
            return Promise.reject({status: 400, msg: "Bad request"})
        }
    })
    .then(() => {
        return db.query(`
        UPDATE articles
        SET votes = votes + $2
        WHERE article_id = $1
        RETURNING *;`,
        [articleId, votesObject])
    })
    .then(({rows}) => {
        return rows
    })
}
//Ticket 9
exports.removeComment = (id) => {
        return db.query(`
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *;
        `, [id])
        .then(({rows}) => {
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: "Not found"})
            }
        })

}
// Ticket 10
exports.selectUsers = () => {
    return db.query(`
    SELECT * FROM users;`)
    .then(({rows}) => {
        return rows
    })
}
// Ticket 16
exports.selectUser = (username) => {
    return db.query(`
    SELECT * FROM users
    WHERE username = $1`, [username])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "Not found"})
        }
        return rows[0]
    })
}
// Ticket 17 
exports.updateCommentVotes = (commentId, vote) => {
    return db.query(`
    UPDATE comments
    SET votes = votes + $2
    WHERE comment_id = $1
    RETURNING *;
    `, [commentId, vote])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "Not found"})
        }
        return rows[0]
    })
}
// Ticket 18
exports.sendArticle = (article) => {
    console.log(article)
    return db.query(`
    INSERT INTO articles (author, title, body, topic, article_img_url)
    values ($1, $2, $3, $4, $5)
    RETURNING *;
    `, [
        article.author,
        article.title,
        article.body,
        article.topic,
        article.article_img_url
    ])
    .then(({rows}) => {
        console.log(rows)
        return rows[0]
    })
    
}