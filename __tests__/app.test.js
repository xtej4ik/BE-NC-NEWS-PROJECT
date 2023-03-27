const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

afterAll(() => {
    if (db.end) db.end()
});

beforeEach(() =>{
    return seed(data)
});

describe("GET/api/", () => {
    it("GET 200: responds with a message saying the server is running.", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {
          const { body } = res;
          const { msg } = body;
          expect(msg).toBe("Server is up and running.");
        });
    });
  });
  describe("GET/api/topics", () => {
    it("GET 200: responds with all of the treasures.", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          const { body } = res;  
          const { topics } = body;
          expect(topics).toHaveLength(data.topicData.length);
          topics.forEach((topic) => {
            expect(topic).toMatchObject({
             description: expect.any(String),
             slug: expect.any(String),
            });
          });
        });
    });
    describe('GET/not-a-route', () => {
      it('responds with status 404', () => {
          return request(app)
          .get('/not-a-route')
          .expect(404)
      });
  });
});