# Learning React Query

## Contents

📚 [Resources](#resources)

[**Notes - BASICS**](#notes---basics)

🔸 [Setup](#setup)

🔸 [Queries](#queries)

- [`useQuery`](#usequery)

🔸 [Mutations](#mutations)

- [`useMutation`](#usemutation)
- [`mutate` method](#mutate-method)
- [`reset` method](#reset-method)

🔸 [Query Invalidation](#query-invalidation)

- [`QueryClient`](#queryclient)
- [`invalidateQueries` method](#invalidatequeries-method)
- [Other `QueryClient` methods to control query caching](#other-queryclient-methods-to-control-query-caching)

🔸 [Full example from docs](#full-example-from-docs)

[**Notes - ADVANCED**](#notes---advanced)

🔸 [Mutation side effects](#mutation-side-effects)

## Resources

- [React Query in 100 Seconds](https://www.youtube.com/watch?v=novnyCaa7To)
- [React Query Docs: Quick Start](https://tanstack.com/query/v3/docs/react/quick-start)
- [TkDodo's Blog](https://tanstack.com/query/latest/docs/react/community/tkdodos-blog#12-mastering-mutations-in-react-query) - written by a maintainer of the library

## Notes - BASICS

React Query provides a centralized way to manage data fetching.

It also helps manage:

- Caching
- Deduping multiple requests for the same data into a single request
- Updating "out of date" data in the background
- Knowing when data is "out of date"
- Reflecting updates to data as quickly as possible
- Performance optimizations like pagination and lazy loading data
- Managing memory and garbage collection of server state
- Memoizing query results with structural sharing

### Setup

1. Install React Query: `npm npm i react-query`
2. Create a `QueryClient`.
3. Wrap your app in the `QueryClientProvider`, handing in the `QueryClient` with the `client` prop.

```tsx
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )
}
```

### Queries

*Queries* are the operations used to fetch data.

- Used to get data (e.g. GET requests)
- Can automatically retry failed requests
- Gives useful info about the query's state (loading, error, success, etc.)

#### `useQuery`

This is the hook to fetch and manage data.

It takes in:

- *Unique key* for the query (ex - 'todos' for fetching a list of todos) - used for refetching, caching, and sharing query within the application
- *Function* that returns a promise that either resolves with the data or errors

It returns a *result* object that contains:

- State of the query; this can only be in one of these:
  - `isLoading` or `status === 'loading'` - The query has no data and is currently fetching
  - `isError` or `status === 'error'` - The query encountered an error
  - `isSuccess` or `status === 'success'` - The query was successful and data is available
  - `isIdle` or `status === 'idle'` - The query is currently disabled
- More info available depending on state:
  - If in `isError` state: `error` property with error message
  - If in `success` state: `data` property with data
  - `isFetching` -> boolean property; if query is in a state where it's actually fetching (including refetching in the background), this will be true

You can check the state using the boolean or using the status property, and you can use these to show loading mesages, error messages, and success messages in your UI.

Example from [docs](https://tanstack.com/query/v3/docs/react/guides/queries):

```tsx
function Todos() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodoList,
  })

  if (isLoading) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  // We can assume by this point that `isSuccess === true`
  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}
```

### Mutations

*Mutations* are operations used to change (or potentially change) remote data, e.g. POST, PUT, PATCH, or DELETE.

#### `useMutation`

This hook handles mutations. Mutations are usually done manually (like triggering with a function call). This is usually in response to a user action (like a form submission).

Mutations take one argument, a callback function that performs the request. This function needs to take in a parameter that will be the information passed into the request. For example:

```ts
const mutation = useMutation({
    mutationFn: (newTodo) => {
      return axios.post('/todos', newTodo)
    },
})
```

`useMutation` returns an object that contains similar state info and error/data properties to `useQuery`:

- State of the query; this can only be in one of these:
  - `isLoading` or `status === 'loading'` - The mutation is currently running
  - `isError` or `status === 'error'` - The mutation encountered an error
  - `isSuccess` or `status === 'success'` - The mutation was successful and mutation data is available
  - `isIdle` or `status === 'idle'` - The mutation is currently idle or in a fresh/reset state
- More info available depending on state:
  - If in `isError` state: `error` property with error message
  - If in `success` state: `data` property with data
- Methods:
  - `mutate`
  - `reset`

#### `mutate` method

- This is where you invoke the callback function you passed to `useMutation` initially.
- Whatever argument(s) you hand to `mutate` will be passed into the callback function.
- Key difference from `useQuery`: The mutation only happens when `mutate` is called, whereas `useQuery` happens automatically when the component renders.
- `mutate` is async!

```tsx
function App() {
  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return axios.post('/todos', newTodo)
    },
  })

  return (
    <div>
      {mutation.isLoading ? (
        'Adding todo...'
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>Todo added!</div> : null}

          <button
            onClick={() => {
              mutation.mutate({ id: new Date(), title: 'Do Laundry' })
            }}
          >
            Create Todo
          </button>
        </>
      )}
    </div>
  )
}
```

#### `reset` method

This lets you clear the `error` or `data` of a mutation request.

```tsx
const CreateTodo = () => {
  const [title, setTitle] = useState('')
  const mutation = useMutation({ mutationFn: createTodo })

  const onCreateTodo = (e) => {
    e.preventDefault()
    mutation.mutate({ title })
  }

  return (
    <form onSubmit={onCreateTodo}>
      {mutation.error && (
        <h5 onClick={() => mutation.reset()}>{mutation.error}</h5>
      )}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <button type="submit">Create Todo</button>
    </form>
  )
}
```

🧠 [Click here](#mutation-side-effects) for more advanced tools and concepts within mutations.

### Query Invalidation

React Query can cache your data to avoid unnecessary requests, but when something changes on the server, React Query needs to know that the cache is no longer valid.

When you do a mutation that changes data on the server, you can tell React Query that this invalidates some queries. The next time a component uses that query, React Query will know to refetch rather than just using its cache.

#### `QueryClient`

To do things like invalidating queries, you can import the `QueryClient` object from React Query. Via the query provider wrapped around the app with the instance of the `QueryClient` passed into it, this client can automatically access all of the caching and other features from React Query across your whole app. As long as your queries are within the `QueryClientProvider`, the `QueryClient` will manage them.

You can use the `useQueryClient()` hook to get the `QueryClient` from the provider's context.

#### `invalidateQueries` method

The `QueryClient` has an `invalidateQueries` method that lets you mark queries as stale or invalid and refetch where you need to.

When a query is invalidated with `invalidateQueries`:

- It is marked as stale, overwriting any configurations being used in `useQuery` or related hooks.
- If the query is currently being rendered via `useQuery` or related hooks, it will also be refetched in the background.

You can either just call `invalidateQueries` with no arguments, invalidating every cached query, or pass it specific keys (or partial keys or other filtering information) to tell it which queries to invalidate.

🔀 [Click here](https://tanstack.com/query/latest/docs/react/guides/filters#query-filters) for more information on filtering for specific queries.

```tsx
import { useQuery, useQueryClient } from '@tanstack/react-query'

// Get QueryClient from the provider's context
const queryClient = useQueryClient()

// Invalidate every query in the cache
queryClient.invalidateQueries()
// Invalidate every query with a key that starts with `todos`
queryClient.invalidateQueries({ queryKey: ['todos'] })
```

#### Other `QueryClient` methods to control query caching

`QueryClient` has other methods to control what happens to queries, such as:

- `resetQueries` -> Both invalidates and refetches specific queries immediately, rather than waiting for the next time the cached versions are accessed
- `refetchQueries` -> Immediately refetches certain queries, rather than waiting for the next time the cached versions are accessed
- `removeQueries` -> Removes specific queries from the cache (clear cached data no longer needed)
- `cancelQueries` -> Cancel any ongoing queries (useful when you want to cancel a long-running query)
- `prefetchQuery` -> Fetches a query and puts the result into the cache for a specified time, even if no components are actually using it (useful for preloading data you anticipate your user will need in the near future)

### Full example from [docs](https://tanstack.com/query/v3/docs/react/quick-start)

```js
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import { getTodos, postTodo } from '../my-api'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  )
}

function Todos() {
  // Access the client
  const queryClient = useQueryClient()

  // Queries
  const query = useQuery('todos', getTodos)

  // Mutations
  const mutation = useMutation(postTodo, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('todos')
    },
  })

  return (
    <div>
      <ul>
        {query.data.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <button
        onClick={() => {
          mutation.mutate({
            id: Date.now(),
            title: 'Do Laundry',
          })
        }}
      >
        Add Todo
      </button>
    </div>
  )
}

render(<App />, document.getElementById('root'))
```

## Notes - ADVANCED

### Mutation side effects

[TBC - using this info](https://tanstack.com/query/v3/docs/react/guides/mutations#mutation-side-effects)
