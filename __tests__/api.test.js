const request = require("supertest")
const app = require("../api")
const db = require("../db/connection")
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data')

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
            console.log(response)
            console.log(response.body.msg)
            // console.log(response.statusCode)
            expect(response.body.msg).toBe("Not found")
        })
    })
})



