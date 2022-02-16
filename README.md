# Authentication Extension: Cinema Domain

This extension requires completion of the [cinema-booking-api](https://github.com/boolean-uk/cinema-booking-api) repo of the API module.

## Set up

- Fork this repository and clone the fork to your machine.
- Choose Option 1 **or** Option 2 below to copy your existing work over:

### Option 1 - Copy / paste

1. Copy all of the files and folders **except** `README.md` and `./node_modules/` into this new repo
2. Run `npm ci` to install dependencies

### Option 2 - Use git

1. Add a new remote to your local repo that points to your `cinema-booking-api` repository, giving it the name *upstream*: `git remote add upstream THE_URL_TO_THE_REPO`
2. Fetch data from the upstream repo: `git fetch upstream`
3. Merge in the code from upstream: `git rebase upstream/main`
4. Copy over your `.env` file from your local cinema-booking-api repo
5. Run `npm ci` to install dependencies

## Requirements

1. Change the `Customer` model to have a password and a username field.
    - Remember to create a new migration, update the seed file and apply the migration with the new seed data

2. Create a route to allow customers to create their account.
    - Passwords must be hashed

3. Create a route to allow customers to login.
    - The route should create a JSON web token which is sent back to the client in the response.

4. Create an express middleware function that checks and validates a JSON web token from the request's `authorization` header and attach this to every route that creates, updates or deletes data.
    - If the token is invalid or not present, a response with a 401 status code should be sent back to the client
    - If the token is valid, you should add it to the `req` object (e.g. `req.token = token`) before `next()` is called. This will make sure the token is attached to the request object in every function that gets called after your middleware, which will be useful later.

5. Now that you have authentication hooked up, it's time to consider *permissions*. Should a customer be able to create new screenings for movies, or is that the role of a manager? This will require some refactoring, a very common part of development!
    1. Rename the `Customer` model to `User` and update every reference appropriately. e.g. relations that rely on a `customerId` should become `userId`, prisma queries should be updated to use `user` instead of `customer`. Remember to create a new migration and re-seed your database!
    2. [Use this documentation on Prisma Enums](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#enum) to add a `role` field to the `User` model. Instead of `USER` and `ADMIN`, the enum values should be `CUSTOMER` and `MANAGER`. Remember to migrate!
    3. Update your `login` route so it adds the users role to the payload of the JWT.
    4. Create a new express middleware function that decodes the token attached to the request object and checks whether the users role is `MANAGER`.
        1. If the user is a `MANAGER`, call the next function to move the request forward.
        2. If not, send a 401 status response.
    5. Attach this new middleware to any routes that a customer should not have access to (anything that deletes, creates or updates movie / screening / screen data). This middleware should be placed *after* the JWT checking middleware and *before* the route's controller. Example:

    ```js
    router.post('/movie', checkToken, checkIsManager, createMovieController);
    ```
