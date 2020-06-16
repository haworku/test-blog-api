# test-blog-api

Learn about building apis again.

## setup

- Add DB_PASS to `.env` file.
- Add IP address to IP Whitelist in Mongo Cloud Atlas.

## scripts

- `npm run start` to run app

## anticipated work

- [x] Set up Node server using [`expressjs`](https://github.com/expressjs/expressjs.com)
- [x] Set up database using [`mongoose`]() and [MongoAtlas](https://www.mongodb.com/cloud/atlas).
- [x] Add initial data models (users, posts, comments, categories)
- [ ] Write initial documentation of proposed api. **[hw]**
- [ ] Complete Node api work. Write simple api integration tests with Jest/supertest (TDD) first. Make separate PRs for each resource.
  - [ ] Users **[hw]**
  - [ ] Posts
  - [ ] Comments
  - [ ] Categories
- [ ] Set up GraphQL server (use the same database). Use [`express-graphql`](https://github.com/graphql/express-graphql) or Apollo.
- [ ] Write GraphQL queries for the same resources covered by REST api.
