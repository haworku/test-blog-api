const supertest = require("supertest");
const app = require("../../server");
const mongooseInstance = require("../../config/db");
const User = require("../../models/Users");

const request = supertest(app);

beforeAll(async () => {
  await mongooseInstance;
});

afterEach(async () => {
  await User.deleteMany();
});

afterAll(async () => {
  await User.collection.drop();
  await mongooseInstance.connection.close();
});

describe("Users", () => {
  it("GET / should succeed and return empty list", async (done) => {
    const response = await request.get("/users");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    done();
  });

  it("POST / should add new user to the database on success", async (done) => {
    await request.post("/users").send({ username: "test1", age: 12 });

    const newUserInDb = await User.findOne({ username: "test1" });

    expect(newUserInDb).toBeTruthy;
    expect(newUserInDb.username).toBeTruthy;
    expect(newUserInDb.age).toBeTruthy;
    done();
  });

  it("POST / should return newly created user on success", async (done) => {
    const userData = { username: "test1", age: 12 };
    const response = await request.post("/users").send(userData);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining(userData));
    done();
  });
});
