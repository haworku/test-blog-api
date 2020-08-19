const supertest = require("supertest");
const app = require("../server");
const mongooseInstance = require("../config/db");
const Comment = require("../models/Comments");

const request = supertest(app);

beforeAll(async () => {
  // TODO: use a different db for each db model test suite
  await mongooseInstance;
  await Comment.collection.drop();
});

afterEach(async () => {
  await Comment.deleteMany();
});

afterAll(async () => {
  await Comment.collection.drop();
  await mongooseInstance.connection.close();
});

describe("/comments", () => {
  describe("methods", () => {
    fit("GET returns empty list on success", async (done) => {
      const response = await request.get("/comments");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      done();
    });
  });
});
