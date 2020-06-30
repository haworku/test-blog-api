const supertest = require("supertest");
const app = require("../server");
const mongooseInstance = require("../config/db");
const User = require("../models/Users");

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
  it("GET /users returns empty list on success", async (done) => {
    const response = await request.get("/users");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    done();
  });

  it("POST /users adds new user to database", async (done) => {
    const userData = { username: "test1", age: 12 };
    // create user
    await request.post("/users").send(userData);

    // check db
    const newUserInDb = await User.findOne({ username: "test1" });

    expect(newUserInDb).toBeTruthy;
    expect(newUserInDb.username).toBeTruthy;
    expect(newUserInDb.age).toBeTruthy;
    done();
  });

  it("POST /users returns new user", async (done) => {
    const userData = { username: "test1", age: 12 };
    // create user
    const response = await request.post("/users").send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining(userData));
    expect(response.body).toHaveProperty("createdOn");
    done();
  });

  it("PUT /users/id edits existing user in database", async (done) => {
    const userData = { username: "test1", age: 12 };
    // create user
    const newUser = await request.post("/users").send(userData);

    // edit user
    await request
      .put(`/users/${newUser.body._id}`)
      .send({ ...userData, age: 77 });

    // check db
    const userInDb = await User.findOne({ username: "test1" });

    expect(userInDb.age).toBe(77);
    done();
  });

  it("PUT /users/id returns edited user", async (done) => {
    const userData = { username: "test1", age: 12 };
    // create user
    const newUserResponse = await request.post("/users").send(userData);

    // edit user
    const response = await request
      .put(`/users/${newUserResponse.body._id}`)
      .send({ ...userData, age: 77 });

    expect(response.status).toBe(200);
    expect(response.body.age).toBe(77);
    done();
  });

  it("DELETE /users/id deletes user from database", async (done) => {
    const userData = { username: "test1", age: 12 };
    // create user
    await request.post("/users").send(userData);

    // check db
    const userInDb = await User.findOne({ username: "test1" });
    expect(userInDb).toBeTruthy();

    //delete user
    const response = await request.delete(`/users/${userInDb._id}`);

    // check db
    const deletedUser = await User.findOne({ _id: userInDb._id });
    expect(deletedUser).toBeFalsy();

    expect(response.status).toBe(204);
    done();
  });

  it("GET /users/id returns existing user", async (done) => {
    const userData = { username: "test1", age: 12 };
    // create user
    const newUserResponse = await request.post("/users").send(userData);

    // request user
    const response = await request.get(`/users/${newUserResponse.body._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining(userData));
    done();
  });
});
