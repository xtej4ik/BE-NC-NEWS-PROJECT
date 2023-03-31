const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
require('jest-sorted');

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
describe("GET/not-a-route", () => {
  it("404: responds with an error", () => {
    return request(app)
          .get('/not-a-route')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Route not found');
          });
      });
    });
describe("GET/api/articles/:article_id", () => {
      it("200: responds with requested article", () => {
        const articleId = 1;
        return request(app)
        .get(`/api/articles/${articleId}`)
        .expect(200)
        .then((res) => {
          const { body } = res;
          const { article } = body;
          expect(article).toEqual(expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: articleId,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String)
          }));
          });
    });
    it("404: responds with an error if article_id is not found", () => {
      const article_id = 0;
      return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe(`Article ${article_id} not found`);
      });
    });
    it("400: respond with an error if the id given is not a number", () => {
      return request(app)
      .get('/api/articles/article_id')
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe('Invalid article ID')
      });
    });
  });
describe("GET/api/articles", () => {
    it("200: responds with array of articles", () => {
      return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const { body } = res;
        const { articles } = body;
          expect(articles.length).toBe(data.articleData.length);
          articles.forEach((article) => {
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("article_id", expect.any(Number));
            expect(article).toHaveProperty("body", expect.any(String));
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty("article_img_url", expect.any(String));
            expect(article).toHaveProperty("comment_count", expect.any(Number));
          });
        });
      });  
    });
describe("GET /api/articles/:article_id/comments", () => {
    it("responds with an array of comments for the given article_id of which each comment should have the correct properties", () => {
        const articleId = 1
        return request(app)
            .get(`/api/articles/${articleId}/comments`)
            .expect(200)
            .then((res) => {
                const { body } = res;
                const { comments } = body;
                expect(comments.length).toBeGreaterThan(0);
                comments.forEach((comment) => {
                    expect(comment).toHaveProperty("comment_id", expect.any(Number));
                    expect(comment).toHaveProperty("votes", expect.any(Number));
                    expect(comment).toHaveProperty("created_at", expect.any(String));
                    expect(comment).toHaveProperty("author", expect.any(String));
                    expect(comment).toHaveProperty("body", expect.any(String));
                    expect(comment).toHaveProperty("article_id", expect.any(Number));
                });
                expect(comments).toBeSortedBy("created_at", { descending: true });
              
            });
    });
    it("404: responds with an error if article_id is not found", () => {
        const articleId = 0;
        return request(app)
            .get(`/api/articles/${articleId}/comments`)
            .expect(404)
            .then((res) => {
                const { body } = res;
                expect(body.msg).toBe(`Article ${articleId} not found`);
            });
    });
    it("400: responds with an error if article_id is not a number", () => {
        const articleId = 'not_a_number';
        return request(app)
            .get(`/api/articles/${articleId}/comments`)
            .expect(400)
            .then((res) => {
                const { body } = res;
                const { msg } = body;
                expect(msg).toBe('Invalid article ID');
            });
    });
    it("200: responds with an empty array if article_id is valid but has no comments", () => {
        const articleId = 2;
        return request(app)
            .get(`/api/articles/${articleId}/comments`)
            .expect(200)
            .then((res) => {
                const { body } = res;
                const { comments } = body;
                expect(comments.length).toBe(0);
            });
    });
});
describe("POST /api/articles/:article_id/comments", () => {
  it("responds with the posted comment", () => {
      const articleId = 1;
      const newComment = {
          username: data.userData[0].username,
          body: 'This is a test comment.'
      };
      return request(app)
          .post(`/api/articles/${articleId}/comments`)
          .send(newComment)
          .expect(201)
          .then((res) => {
              const { body } = res;
              expect(body).toHaveProperty('comment');
              const { comment } = body;
              expect(comment).toEqual(expect.objectContaining({
                  comment_id: expect.any(Number),
                  author: newComment.username,
                  body: newComment.body,
                  article_id: articleId,
                  created_at: expect.any(String)
              }));

          });
  });
  it("responds with the posted comment, ignoring unnecessary property", () => {
    const articleId = 1;
    const newComment = {
        username: data.userData[0].username,
        body: 'This is a test comment.',
        unnecessaryProperty: 'This should be ignored.'
    };
    return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(newComment)
        .expect(201)
        .then((res) => {
            const { body } = res;
            expect(body).toHaveProperty('comment');
            const { comment } = body;
            expect(comment).toEqual(expect.objectContaining({
                comment_id: expect.any(Number),
                author: newComment.username,
                body: newComment.body,
                article_id: articleId,
                created_at: expect.any(String)
            }));
        });
});
  it("404: responds an error if article_id is not found", () => {
      const articleId = 0;
      const newComment = {
          username: 'testuser',
          body: 'This is a test comment.'
      };
      return request(app)
          .post(`/api/articles/${articleId}/comments`)
          .send(newComment)
          .expect(404)
          .then((res) => {
              const { body } = res;
              expect(body.msg).toBe(`Article ${articleId} not found`);
          });
  });

  it("400: responds with an error if article_id is not a number", () => {
      const articleId = 'not_a_number';
      const newComment = {
          username: 'testuser',
          body: 'This is a test comment.'
      };
      return request(app)
          .post(`/api/articles/${articleId}/comments`)
          .send(newComment)
          .expect(400)
          .then((res) => {
              const { body } = res;
              const { msg } = body;
              expect(msg).toBe('Invalid article ID');
          });
  });
  it("400: responds with an error if request body is missing required properties", () => {
      const articleId = 1;
      const invalidComment = {
          username: 'testuser'
      };
      return request(app)
          .post(`/api/articles/${articleId}/comments`)
          .send(invalidComment)
          .expect(400)
          .then((res) => {
              const { body } = res;
              const { msg } = body;
              expect(msg).toBe('Invalid request body');
          });
  });
  it("400:responds with an error if username does not exist", () => {
      const articleId = 1;
      const newComment = {
          username: 'thisusernamedoesnotexist',
          body: 'This is a test comment.'
      };
      return request(app)
          .post(`/api/articles/${articleId}/comments`)
          .send(newComment)
          .expect(400)
          .then((res) => {
              const { body } = res;
              const { msg } = body;
              expect(msg).toBe('Invalid username');
          });
  });

});