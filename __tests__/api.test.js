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

// Ticket 2
describe('Ticket 2 - GET/api/topics', () => {
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
describe('Ticket 3 - GET/api/', () => {
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
// Ticket 4
describe("Ticket 4 - GET/api/articles/:article_id", () => {
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
describe("Ticket 5 - GET/api/articles", () => {
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
// Ticket 6
describe("Ticket 6 - GET /api/articles/:article_id/comments", () => {
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
// Ticket 7
describe("Ticket 7 - POST /api/articles/:article_id/comments", () => {
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
    it("Should return an error when given a comment with empty username field", () => {
        return request(app)
        .post("/api/articles/2/comments")
        .send({username: "", body: "Can't post this without a username!"})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request")
        })
    })
    it("Should return an error when given a comment with empty body field", () => {
        return request(app)
        .post("/api/articles/2/comments")
        .send({user_name: "butter_bridge", body: ""})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request")
        })
    })
    it("Should return an error when given a username that doesn't exist", () => {
        return request(app)
        .post("/api/articles/2/comments")
        .send({user_name: "obviously_invalid_username", body: "invalid usernames can't make comments? Pah!"})
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Not found")
        })
    })
    it("Should ignore additional properties when sent an object with more than just user_name and body", () => {
        return request(app)
        .post("/api/articles/2/comments")
        .send({user_name: "butter_bridge", body: "This is the comment body", additionalProperty: "This is totally unnecessary third KVP that should have no effect on the query at all!"})
        .expect(201)
        .then(({body}) => {
            expect(body).toHaveProperty("article_id")
            expect(body).toHaveProperty("author")
            expect(body).toHaveProperty("body")
            expect(body).toHaveProperty("comment_id")
            expect(body).toHaveProperty("created_at")
            expect(body).toHaveProperty("votes")
            expect(body.author).toBe("butter_bridge")
            expect(body.body).toBe("This is the comment body")
            expect(body).not.toHaveProperty("additionalProperty")
        })
            
    })
})
// Ticket 8
describe("Ticket 8 - PATCH /api/articles/article_id", () => {
    it("Should increase the votes property of a given article by id", () => {
        return request(app)
        .patch("/api/articles/1")
        .send({inc_votes: 1})
        .expect(200)
        .then(({body}) => {
            expect(body).toHaveProperty("article_id")
            expect(body).toHaveProperty("title")
            expect(body).toHaveProperty("topic")
            expect(body).toHaveProperty("author")
            expect(body).toHaveProperty("body")
            expect(body).toHaveProperty("created_at")
            expect(body).toHaveProperty("votes")
            expect(body.votes).toEqual(101)
        })
    })
    it("Should update the votes property of a given article by id", () => {
        return request(app)
        .patch("/api/articles/1")
        .send({inc_votes: -1})
        .expect(200)
        .then(({body}) => {
            expect(body).toHaveProperty("article_id")
            expect(body).toHaveProperty("title")
            expect(body).toHaveProperty("topic")
            expect(body).toHaveProperty("author")
            expect(body).toHaveProperty("body")
            expect(body).toHaveProperty("created_at")
            expect(body).toHaveProperty("votes")
            expect(body.votes).toEqual(99)
        })
    })
    it("Should return 404-not found when article does not yet exist at that id", () => {
        return request(app)
        .patch("/api/articles/9999")
        .send({inc_votes: 1})
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Not found")
        })
    })
    it("Should return 400-bad request when given given invalid article_id", () => {
        return request(app)
        .patch("/api/articles/banana")
        .send({inc_votes: 1})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request")
        })
    })
    it("Should return 400-bad request when request body does not contain votes-key", () => {
        return request(app)
        .patch("/api/articles/1")
        .send({wrongKeyProvided: 1})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request")
        })
    })
    it("Should return 400-bad request when request body does not contain votes-key", () => {
        return request(app)
        .patch("/api/articles/1")
        .send({inc_votes: "banana"})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request")
        })
    })
})
// Ticket 9
describe("Ticket 9 - DELETE /api/comments/:comment_id", () => {
    it("Should respond with 204 - no content when given a valid comment id to delete", () => {
        return request(app)
        .delete("/api/comments/1")
        .expect(204)
    })
    it("Should respond with 404 - Not found when given an id of a comment that doesn't exist", () => {
        return request(app)
        .delete("/api/comments/9999")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Not found")
        })
    })
    it("Should respond with a 400 - Bad request when given an invalid comment_id", () => {
        return request(app)
        .delete("/api/comments/banana")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request")
        })
    })
})
// Ticket 10
describe("Ticket 10 - GET /api/users" , ()=> {
    it("Should respond with an array of all users", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({body}) => {
            expect(body).toHaveLength(4)
            body.forEach(user => {
                expect(user).toHaveProperty("username")
                expect(user).toHaveProperty("name")
                expect(user).toHaveProperty("avatar_url")
            })
        })
    })
})
// Ticket 11
describe("Ticket 11 - GET /api/articles (queries)", () => {
    it("Should respond with status200 and an array of articles matching the query topic", () => {
        return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({body}) => {
            expect(body).toHaveLength(12)
        })
    })
    it("Should respond with status200 and an array of articles matching the query topic", () => {
        return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({body}) => {
            expect(body).toHaveLength(1)
        })
    })
    it("Should respond with status200 and an array of articles matching the query topic", () => {
        return request(app)
        .get("/api/articles?topic=nonexistantTopic")
        .expect(200)
        .then(({body}) => {
            expect(body).toHaveLength(13)
        })
    })
    it("Should respond with status200 and an array of articles filtered by topic-mitch, sorted by comment_count-ascending", () => {
        return request(app)
        .get("/api/articles?topic=mitch&sort_by=comment_count&order=ASC")
        .expect(200)
        .then(({body}) => {
            expect(body).toHaveLength(12)
            expect(body).toBeSortedBy(Number("comment_count"), {ascending: true})
        })
    })
    it("Should respond with a status200 and an array of 1 article when given a topic-cats and sorted_by articles.author-ASC", () => {
        return request(app)
        .get("/api/articles?topic=cats&sort_by=articles.author&order=ASC")
        .expect(200)
        .then(({body}) => {
            expect(body).toHaveLength(1)
            expect(body).toBeSortedBy("articles.author", {ascending: true})
        })
    })
    it("Should respond with status200 and an array of all 13 articles ordered by created at descending, when given invalid params", () => {
        return request(app)
        .get("/api/articles?topic=NOTATOPIC&sort_by=NOTACOLUMN&order=NOTANORDER")
        .expect(200)
        .then(({body}) => {
            expect(body).toHaveLength(13)
            expect(body).toBeSortedBy("created_at", {descending: true})
        })
    })
})
//Ticket 12
describe("Ticket 12 - GET/api/articles/:article_id", () => {
    it("Should return an object of one article now including comment_count property", () => {
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
            expect(body).toHaveProperty("comment_count")
        })
    })
    it("Should return an object of one article now including comment_count property", () => {
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
            expect(body).toHaveProperty("comment_count")
        })
    })
    // Need to test for sadpath
    it("Should return 400-Bad request when given an invalid query", () => {
        return request(app)
        .get("/api/articles/banana")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request")
        })
    })
    it("Should return 404-Not found when querying an article that doesn't yet exist", () => {
        return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Not found")
        })
    })
})
// Ticket 16
describe("Ticket 16 - GET/api/users/:username", () => {
    it("Should return an object of one user according to the username", () => {
        return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({body}) => {
            expect(body).toHaveProperty("username")
            expect(body).toHaveProperty("avatar_url")
            expect(body).toHaveProperty("name")
        })
    })
    it("Should return 404-not found when given a valid-but-non-existant username", () => {
        return request(app)
        .get("/api/users/valid_but_non_existant_username")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Not found")
        })
    })
    // Is there a 400 - Bad Request sad-path case here?
    // I don't know what specifics were set out - allowable/forbidden characters in username fields
})
// Ticket 17
describe("Ticket 17 - PATCH/api/comments/:comment_id", () => {
    it("Should return a single comment with a votes count increased by 1", () => {
        return request(app)
        .patch("/api/comments/1")
        .send({inc_votes: 1})
        .expect(200)
        .then(({body}) => {
            expect(body).toHaveProperty("article_id")
            expect(body).toHaveProperty("author")
            expect(body).toHaveProperty("body")
            expect(body).toHaveProperty("comment_id")
            expect(body).toHaveProperty("created_at")
            expect(body).toHaveProperty("votes")
            expect(body.votes).toBe(17)
        })
    })
    it("Should return a single comment with a votes count decreased by 1", () => {
        return request(app)
        .patch("/api/comments/1")
        .send({inc_votes: -1})
        .expect(200)
        .then(({body}) => {
            expect(body).toHaveProperty("article_id")
            expect(body).toHaveProperty("author")
            expect(body).toHaveProperty("body")
            expect(body).toHaveProperty("comment_id")
            expect(body).toHaveProperty("created_at")
            expect(body).toHaveProperty("votes")
            expect(body.votes).toBe(15)
        })
    })
    it("Should return a single comment with a votes count increased by 100", () => {
        return request(app)
        .patch("/api/comments/1")
        .send({inc_votes: 100})
        .expect(200)
        .then(({body}) => {
            expect(body).toHaveProperty("article_id")
            expect(body).toHaveProperty("author")
            expect(body).toHaveProperty("body")
            expect(body).toHaveProperty("comment_id")
            expect(body).toHaveProperty("created_at")
            expect(body).toHaveProperty("votes")
            expect(body.votes).toBe(116)
        })
    })
    it("Should return 404 - Not found when given a valid-but-non-existant comment_id", () => {
        return request(app)
        .patch("/api/comments/9999")
        .send({inc_votes: 100})
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Not found")

        })
    })
    it("Should return 400 - Bad request when given an invalid comment_id", () => {
        return request(app)
        .patch("/api/comments/banana")
        .send({inc_votes: 100})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request")

        })
    })
})
// Ticket 18
describe("Ticket 18 - POST/api/articles", () => {
    it("Should respond with the newly created article", () => {
        return request(app)
        .post("/api/articles")
        .send({
            author: "butter_bridge",
            title: "Test Article Title",
            body: "Test Article Body",
            topic: "cats", // Test to see if more topics are allowed
            article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        })
        .expect(200)
        .then(({body}) => {
            expect(body).toHaveProperty("author")
            expect(body).toHaveProperty("title")
            expect(body).toHaveProperty("body")
            expect(body).toHaveProperty("topic")
            expect(body).toHaveProperty("article_img_url")
            expect(body).toHaveProperty("article_id")
            expect(body).toHaveProperty("votes")
            expect(body).toHaveProperty("created_at")
            //expect(body).toHaveProperty("comment_count")

            // Signing off 2130 12/7 
            // This article response must have a comment count,
            // which means querying the comments table and summing however many 
            // Have the same article_id as this article, which is none, 
            // Because I've only just posted it.
        })
    })
})

