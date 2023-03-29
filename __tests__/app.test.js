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
    it("GET 200: responds with a message saying the server is running", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {
          const { body } = res;
          const { msg } = body;
          expect(msg).toBe("Server is up and running");
        });
    });
  });
describe("GET/api/topics", () => {
    it("GET 200: responds with all of the treasures", () => {
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
  });
describe('GET/not-a-route', () => {
      it('404: responds with an error', () => {
          return request(app)
          .get('/not-a-route')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Route not found');
          });
      });
  });
describe('GET/api/articles/:article_id', () => {
    it('200: responds with requested article', () => {
        const articleId = 1;
        return request(app)
        .get(`/api/articles/${articleId}`)
        .expect(200)
        .then((res) => {
            const { body } = res;
            const { article } = body;
            expect(article).toHaveProperty('author', expect.any(String));
            expect(article).toHaveProperty('title', expect.any(String));
            expect(article).toHaveProperty('article_id', articleId);
            expect(article).toHaveProperty('body', expect.any(String));
            expect(article).toHaveProperty('topic', expect.any(String));
            expect(article).toHaveProperty('created_at', expect.any(String));
            expect(article).toHaveProperty('votes', expect.any(Number));
            expect(article).toHaveProperty('article_img_url', expect.any(String));
        });
    });
    it('404: responds with an error if article_id is not found', () => {
      const article_id = 0;
      return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(404)
      .then((res) => {
          expect(res.body.msg).toBe(`Article ${article_id} not found`);
      });
    });
    it('400: respond with an error if the id given is not a number', () => {
      return request(app)
      .get('/api/articles/article_id')
      .expect(400)
      .then(({body}) => {
              expect(body.msg).toBe('Invalid id')
      });
    });
  });
