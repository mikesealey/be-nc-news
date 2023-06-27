const request = require("supertest")
const app = require("../api")
const db = require("../db/connection")
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data')


//const expectExport = require("expect")


beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    return db.end()
})

describe('GET/api/topics', () => {
    it("Should respond with an array of topic objects containing the following properties -slug -description ", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
            expect(body.topics.length).toEqual(3)
            body.topics.forEach(topicObject => {
                expect(topicObject).toHaveProperty("slug")
                expect(topicObject).toHaveProperty("description")
            })
        } )
    })

    it("Should respond with an appropriate error", () => {
        return request(app)
        .get("/api/nonexistantendpoint")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("Not found")
        })
    })
})

describe('GET/api/', () => {
    it("Should respond with status-200 and an object", () => {
        return request(app)
        .get("/api/")
        .expect(200)
        .then(({ body }) => {
            expect(typeof body).toBe("object")
        } )
    })
    it("Should respond with an object with values", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
            const apiKeys = Object.keys(body.endpoints)
            // MUST CHECK ARRAY HAS LENGTH BEFORE forEach loop****************************************
            apiKeys.forEach(key => {
                expect(body.endpoints[key]).toHaveProperty("description")
                expect(body.endpoints[key]).toHaveProperty("acceptedQueries")
                expect(body.endpoints[key]).toHaveProperty("expectedFormat")
                expect(body.endpoints[key]).toHaveProperty("exampleResponse")
            })
        } )
    })
})

describe("GET/api/articles/:article_id", () => {
    it("Should return an object of one article", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({body}) => {
            expect(body.article_id).toBe(1)
            expect(body).toHaveProperty("author")
            expect(body).toHaveProperty("title")
            expect(body).toHaveProperty("body")
            expect(body).toHaveProperty("topic")
            expect(body).toHaveProperty("created_at")
            expect(body).toHaveProperty("votes")
            expect(body).toHaveProperty("article_img_url")
        })
    })
    it("Should return an object of one article", () => {
        return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({body}) => {
            expect(body.article_id).toBe(2)
            expect(body).toHaveProperty("author")
            expect(body).toHaveProperty("title")
            expect(body).toHaveProperty("body")
            expect(body).toHaveProperty("topic")
            expect(body).toHaveProperty("created_at")
            expect(body).toHaveProperty("votes")
            expect(body).toHaveProperty("article_img_url")
        })
    })
    it("404 - Not found' when given an invalid article-id", () => {
        return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Not found")
        })
    })
    it("400 - Bad request", () => {
        return request(app)
        .get("/api/articles/stephen")
        .expect(400)
        .then(({body}) => {
            console.log(body)
            expect(body.msg).toBe("Bad Request")
        })
    })
})



