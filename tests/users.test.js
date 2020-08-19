const supertest = require("supertest");
const app = require("../server");
const mongooseInstance = require("../config/db");
const User = require("../models/Users");

const request = supertest(app);

beforeAll(async () => {
  // TODO: use a different db for each db model test suite
  await mongooseInstance;
  await User.collection.drop();
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
    it("GET returns empty list on success", async (done) => {
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

    it("POST returns new user with 201 on success", async (done) => {
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
    it("GET returns existing user on success", async (done) => {
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

    it("PUT returns edited user on success", async (done) => {
      const userData = { username: "test1", age: 12 };
      const editedUserData = { ...userData, age: 77 };
      const response = await addUserAndEditAsync(userData, editedUserData);

      expect(response.status).toBe(200);
      expect(response.body.age).toBe(77);
      done();
    });

    it("DELETE deletes user from database and returns 204", async (done) => {
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

    it.each([
      ["GET", () => request.get("/users/5f15c2dbf9fe694626a42edf")],
      [
        "PUT",
        () => request.put("/users/5f15c2dbf9fe694626a42edf").send({ age: 88 }),
      ],
      ["DELETE", () => request.delete("/users/5f15c2dbf9fe694626a42edf")],
    ])(
      "%s returns 404 when :userid does not exist",
      async (method, request, done) => {
        const response = await request();
        expect(response.status).toBe(404);
        done();
      }
    );

    it("GET /comments returns empty array when valid user has no comments", async (done) => {
      // create user
      const userResponse = await addUserAsync({ username: "test1", age: 7 });

      // request user comments
      const response = await request.get(
        `/users/${userResponse.body._id}/comments`
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      done();
    });

    it("GET /comments return user comments when they exist", async (done) => {
      // create user
      const userResponse = await addUserAsync({ username: "test1", age: 7 });

      // create comment authored by user
      const commentData = { title: "A comment", author: userResponse.body._id };
      const commentResponse = await request
        .post("/comments")
        .send({ commentData });

      // request user comments
      const response = await request.get(
        `/users/${userResponse.body._id}/comments`
      );

      expect(response.status).toBe(200);
      console.log(response.body);
      expect(response.body.length).toEqual(1);
      // expect(response.body.length).toEqual(
      //   expect.arrayContaining(expect.objectContaining(commentData))
      // );
      done();
    });
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
