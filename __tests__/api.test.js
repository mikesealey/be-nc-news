const request = require("supertest")
const app = require("../app")
const db = require("../db/connection")
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data')



beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    return db.end()
})

// Ticket2
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
// Ticket3
describe('GET/api/', () => {
    it("Should respond with status-200 and an object", () => {
        return request(app)
        .get("/api/")
        .expect(200)
        .then(({body}) => {
            expect(typeof body).toBe("object")
        } )
    })
    it("Should respond with an object with values", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
            const apiKeys = Object.keys(body.endpoints)
            expect(apiKeys).not.toHaveLength(0)
            apiKeys.forEach(key => {
                expect(body.endpoints[key]).toHaveProperty("description")
                expect(body.endpoints[key]).toHaveProperty("acceptedQueries")
                expect(body.endpoints[key]).toHaveProperty("expectedFormat")
                expect(body.endpoints[key]).toHaveProperty("exampleResponse")
            })
        } )
    })
})
// Ticket4
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
    it("400 - Not found' when given an invalid article-id query", () => {
        return request(app)
        .get("/api/articles/banana")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request")
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
            expect(body.msg).toBe("Bad request")
        })
    })
})
// Ticket5
describe("GET/api/articles", () => {
    it("Should return an array of all articles", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
            expect(body).toHaveLength(13)
            body.forEach(element => {
                expect(element).toHaveProperty("author")
                expect(element).toHaveProperty("title")
                expect(element).toHaveProperty("article_id")
                expect(element).toHaveProperty("topic")
                expect(element).toHaveProperty("created_at")
                expect(element).toHaveProperty("votes")
                expect(element).toHaveProperty("article_img_url")
                expect(element).not.toHaveProperty("body")
                expect(element).toHaveProperty("comment_count")
            })
        })
    })
    it("Should return an array of all articles ordered by date", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
            expect(body).toBeSortedBy("created_at", {descending: true})
        })
        
    })
})
// Ticket6
describe("GET /api/articles/:article_id/comments", () => {
    it("Should return an array of comments for the given article", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({body}) => {
            expect(body).toHaveLength(11)
            body.forEach(comment => {
                expect(comment).toHaveProperty("comment_id")
                expect(comment).toHaveProperty("votes")
                expect(comment).toHaveProperty("created_at")
                expect(comment).toHaveProperty("author")
                expect(comment).toHaveProperty("body")
                expect(comment).toHaveProperty("article_id")
            })
        })
    })
    it("Should return an array of comments sorted by created_at, newest first", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({body}) => {
            expect(body).toBeSortedBy("created_at", {descending: true})
        })
    })
    it("Should return 400 - Bad request when given an invalid article-id query", () => {
        return request(app)
        .get("/api/articles/banana/comments")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request")
        })
    })
    it("Should return 200 - empty-array when given an article-id that contains no comments", () => {
        return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual([])
        })
    })
})
// Ticket7
describe.skip("POST /api/articles/:article_id/comments", () => {
    it("Should post a simple comment to an article that exists", () => {
        return request(app)
        .post("/api/articles/2/comments")
        .send({user_name: "butter_bridge", body: "TEST POST PLEASE IGNORE"})
        .expect(201)
        .then(({body}) => {
            expect(body).toHaveProperty("article_id")
            expect(body).toHaveProperty("author")
            expect(body).toHaveProperty("body")
            expect(body).toHaveProperty("comment_id")
            expect(body).toHaveProperty("created_at")
            expect(body).toHaveProperty("votes")
        })
    })
    it("Should return an error when given an invalid article-id type", () => {
        return request(app)
        .post("/api/articles/banana/comments")
        .send({user_name: "butter_bridge", body: "Everybody knows bananas can't be PRIMARY SERIAL KEYs"})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request")
        })
    })
    it("Should return an error when given an article_id that does not yet have an article posted to it", () => {
        return request(app)
        .post("/api/articles/9999/comments")
        .send({user_name: "butter_bridge", body: "There's no article there yet, I shouldn't be able to comment on it!"})
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Not found")
        })
    })
    it("Should return a PSQL error when given an user_name that does not exist", () => {
        return request(app)
        .post("/api/articles/2/comments")
        .send({user_name: "Mike", body: "There's no article there yet, I shouldn't be able to comment on it!"})
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Not found")
        })
    })
})
// Ticket 8
describe.skip("PATCH /api/articles/article_id", () => {
    it("Should update the votes property of a given article by id", () => {

    })
})