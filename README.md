# test-blog-api

Learn about building apis again.

## setup

- Add DB_PASS to `.env` file.
- Add IP address to IP Whitelist in Mongo Cloud Atlas.

## scripts

- `npm install` install dependencies
- `npm run start` run api server with validator (based on OpenApi 3.0 spec)
- `npm run start-no-validate` run server without validations

## anticipated work

### Setup

- [x] Set up Node server using [`expressjs`](https://github.com/expressjs/expressjs.com)
- [x] Set up database using [`mongoose`]() and [MongoAtlas](https://www.mongodb.com/cloud/atlas).
- [x] Add initial data models (users, posts, comments, categories)
  - [ ] Users
  - [ ] Posts
  - [ ] Comments
  - [ ] Categories

### REST API

Make separate PRs for each resource. For each data model:

1. Write initial OpenApi 3.0 docs
2. Write simple api integration tests with Jest/supertest (TDD).
3. Complete Node api work.

### GRAPHQL

- [ ] Set up GraphQL server (use the same database). Use [`express-graphql`](https://github.com/graphql/express-graphql) or Apollo.
- [ ] Write GraphQL queries for the same resources covered by REST api.
