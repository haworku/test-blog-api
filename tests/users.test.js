const supertest = require("supertest");
const app = require("../server");
const mongooseInstance = require("../config/db");
const User = require("../models/Users");

const request = supertest(app);

beforeAll(async () => {
  // TODO: use a different db for each db model test suite
  await mongooseInstance;
});

afterEach(async () => {
  await User.deleteMany();
});

afterAll(async () => {
  await User.collection.drop();
  await mongooseInstance.connection.close();
});

describe("/users", () => {
  describe("methods", () => {
    it("GET returns empty list", async (done) => {
      const response = await request.get("/users");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      done();
    });

    it("POST adds new user to database", async (done) => {
      const userData = { username: "test1", age: 12 };
      // create user
      await addUserAsync(userData);

      // check db
      const newUserInDb = await User.findOne({ username: "test1" });

      expect(newUserInDb).not.toBe(null);
      expect(newUserInDb.username).toBe(userData.username);
      expect(newUserInDb.age).toBe(userData.age);
      done();
    });

    it("POST returns new user", async (done) => {
      const userData = { username: "test1", age: 12 };
      // create user
      const response = await addUserAsync(userData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(userData));
      expect(response.body).toHaveProperty("createdOn");
      done();
    });
  });

  describe("validations", () => {
    it("username is required ", async (done) => {
      const error = await addUser({})
        .expect(500)
        .expect(function (error) {
          expect(error.body.message).toBe(
            "Users validation failed: username: Path `username` is required."
          );
        });
      done();
    });

    it("username has valid characters", async (done) => {
      const userData = { username: "#@%S123" };

      await addUser(userData)
        .expect(500)
        .expect(function (error) {
          expect(error.body.message).toBe(
            `Users validation failed: username: is invalid`
          );
        });
      done();
    });

    it("username is unique", async (done) => {
      const userData = { username: "test1" };
      await addUser(userData).send(userData).expect(201);

      await addUser(userData)
        .expect(500)
        .expect(function (error) {
          expect(error.body.message).toBe(
            "Users validation failed: username: Error, expected `username` to be unique. Value: `test1`"
          );
        });
      done();
    });

    it("age is a positive number ", async (done) => {
      const userData = { username: "test1", age: -1 };
      await addUser(userData)
        .expect(500)
        .expect(function (error) {
          expect(error.body.message).toBe(
            `Users validation failed: age: Age must be greater than 0.`
          );
        });
      done();
    });

    it("validates multiple fields as expected", async (done) => {
      const userData = { username: "", age: -1 };
      await addUser(userData)
        .expect(500)
        .expect(function (error) {
          expect(error.body.message).toBe(
            "Users validation failed: username: Path `username` is required., age: Age must be greater than 0."
          );
        });
      done();
    });
  });
});

describe("/users/:id", () => {
  describe("methods", () => {
    it("GET returns existing user", async (done) => {
      const userData = { username: "test1", age: 12 };
      // create user
      const newUserResponse = await addUserAsync(userData);

      // request user
      const response = await request.get(`/users/${newUserResponse.body._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining(userData));
      done();
    });

    it("PUT edits existing user in database", async (done) => {
      const userData = { username: "test1", age: 12 };
      const editedUserData = { ...userData, age: 77 };

      await addUserAndEditAsync(userData, editedUserData);

      const userInDb = await User.findOne({ username: "test1" });
      expect(userInDb.age).toBe(77);
      done();
    });

    it("PUT returns edited user", async (done) => {
      const userData = { username: "test1", age: 12 };
      const editedUserData = { ...userData, age: 77 };
      const response = await addUserAndEditAsync(userData, editedUserData);

      expect(response.status).toBe(200);
      expect(response.body.age).toBe(77);
      done();
    });

    it("DELETE deletes user from database", async (done) => {
      const userData = { username: "test1", age: 12 };
      // create user
      await addUserAsync(userData);

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

    it("for each method - 404 not found for resource that does not exist");
  });

  describe("validations", () => {
    it("username is required ", async (done) => {
      const userData = { username: "test1", age: 12 };
      const editedUserData = { username: null };
      const response = await addUserAndEditAsync(userData, editedUserData);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(
        "Validation failed: username: Path `username` is required."
      );
      done();
    });

    it("username has valid characters", async (done) => {
      const userData = { username: "test1", age: 12 };
      const editedUserData = { username: "!!@#" };
      const response = await addUserAndEditAsync(userData, editedUserData);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(
        `Validation failed: username: is invalid`
      );
      done();
    });

    it("username is unique", async (done) => {
      const user1Data = { username: "test1", age: 12 };
      const user2Data = { username: "test2", age: 12 };
      const editedUser2Data = { username: "test1" };

      await addUserAsync(user1Data);
      const response = await addUserAndEditAsync(user2Data, editedUser2Data);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(
        "Validation failed: username: Error, expected `username` to be unique. Value: `test1`"
      );
      done();
    });

    it("age is a positive number ", async (done) => {
      const userData = { username: "test1", age: 12 };
      const editedUserData = { age: -8 };
      const response = await addUserAndEditAsync(userData, editedUserData);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(
        `Validation failed: age: Age must be greater than 0.`
      );
      done();
    });

    it("validates multiple fields as expected", async (done) => {
      const user1Data = { username: "test1", age: 12 };
      const user2Data = { username: "test2", age: 12 };
      const editedUser2Data = { username: "test1", age: -9 };

      await addUserAsync(user1Data);
      const response = await addUserAndEditAsync(user2Data, editedUser2Data);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(
        "Validation failed: age: Age must be greater than 0., username: Error, expected `username` to be unique. Value: `test1`"
      );
      done();
    });
  });
});

const addUser = (data) => request.post("/users").send(data);
const addUserAsync = async (data) => await addUser(data);
const addUserAndEditAsync = async (initialUserData, editedUserData) => {
  const newUser = await addUserAsync(initialUserData);
  return await request.put(`/users/${newUser.body._id}`).send(editedUserData);
};
