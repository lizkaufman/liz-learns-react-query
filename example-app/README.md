# Quick app to practice using React Query

This is a simple CRUD todo app that talks to a server on localhost:8000. Fetching for all CRUD operations is handled via React Query.

Note: All query/mutation code is in the `List` component. Normally, I'd abstract this away to neaten up the component, but as this app is for learning, I'll leave it all in one place so I can refer to it later!

## To run the server

(Do this first!)

1. `cd` into the `example-app/back-end` folder
2. `npm i`
3. Run `npm start` to start the server on port 8000
4. You can now send requests to <http://localhost:8000/todos>

## To run the front end

1. `cd` into the `example-app/front-end` folder
2. Run `npm start` to start the front end locally on port 3000
3. View the front end on <http://localhost:3000>

Remember, you'll need the server running as well (in a separate terminal) as mentioned above for the front end to work correctly.
