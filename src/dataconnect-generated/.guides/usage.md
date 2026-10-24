# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useInsertUser, useUpdateUser, useDeleteUser, useGetUser, useListUsers, useCreateCompany, useUpdateCompany, useDeleteCompany, useGetCompany, useListCompanies } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useInsertUser(insertUserVars);

const { data, isPending, isSuccess, isError, error } = useUpdateUser(updateUserVars);

const { data, isPending, isSuccess, isError, error } = useDeleteUser();

const { data, isPending, isSuccess, isError, error } = useGetUser();

const { data, isPending, isSuccess, isError, error } = useListUsers();

const { data, isPending, isSuccess, isError, error } = useCreateCompany(createCompanyVars);

const { data, isPending, isSuccess, isError, error } = useUpdateCompany(updateCompanyVars);

const { data, isPending, isSuccess, isError, error } = useDeleteCompany(deleteCompanyVars);

const { data, isPending, isSuccess, isError, error } = useGetCompany(getCompanyVars);

const { data, isPending, isSuccess, isError, error } = useListCompanies();

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { insertUser, updateUser, deleteUser, getUser, listUsers, createCompany, updateCompany, deleteCompany, getCompany, listCompanies } from '@dataconnect/generated';


// Operation InsertUser:  For variables, look at type InsertUserVars in ../index.d.ts
const { data } = await InsertUser(dataConnect, insertUserVars);

// Operation UpdateUser:  For variables, look at type UpdateUserVars in ../index.d.ts
const { data } = await UpdateUser(dataConnect, updateUserVars);

// Operation DeleteUser: 
const { data } = await DeleteUser(dataConnect);

// Operation GetUser: 
const { data } = await GetUser(dataConnect);

// Operation ListUsers: 
const { data } = await ListUsers(dataConnect);

// Operation CreateCompany:  For variables, look at type CreateCompanyVars in ../index.d.ts
const { data } = await CreateCompany(dataConnect, createCompanyVars);

// Operation UpdateCompany:  For variables, look at type UpdateCompanyVars in ../index.d.ts
const { data } = await UpdateCompany(dataConnect, updateCompanyVars);

// Operation DeleteCompany:  For variables, look at type DeleteCompanyVars in ../index.d.ts
const { data } = await DeleteCompany(dataConnect, deleteCompanyVars);

// Operation GetCompany:  For variables, look at type GetCompanyVars in ../index.d.ts
const { data } = await GetCompany(dataConnect, getCompanyVars);

// Operation ListCompanies: 
const { data } = await ListCompanies(dataConnect);


```