# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetUser*](#getuser)
  - [*ListUsers*](#listusers)
  - [*GetCompany*](#getcompany)
  - [*ListCompanies*](#listcompanies)
  - [*GetJobPosting*](#getjobposting)
  - [*ListJobPostings*](#listjobpostings)
  - [*GetContact*](#getcontact)
  - [*ListContacts*](#listcontacts)
  - [*GetApplicationNote*](#getapplicationnote)
  - [*ListApplicationNotes*](#listapplicationnotes)
- [**Mutations**](#mutations)
  - [*InsertUser*](#insertuser)
  - [*UpdateUser*](#updateuser)
  - [*DeleteUser*](#deleteuser)
  - [*CreateCompany*](#createcompany)
  - [*UpdateCompany*](#updatecompany)
  - [*DeleteCompany*](#deletecompany)
  - [*CreateJobPosting*](#createjobposting)
  - [*UpdateJobPosting*](#updatejobposting)
  - [*DeleteJobPosting*](#deletejobposting)
  - [*CreateContact*](#createcontact)
  - [*UpdateContact*](#updatecontact)
  - [*DeleteContact*](#deletecontact)
  - [*CreateApplicationNote*](#createapplicationnote)
  - [*UpdateApplicationNote*](#updateapplicationnote)
  - [*DeleteApplicationNote*](#deleteapplicationnote)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetUser
You can execute the `GetUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUser(options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;

interface GetUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserData, undefined>;
}
export const getUserRef: GetUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;

interface GetUserRef {
  ...
  (dc: DataConnect): QueryRef<GetUserData, undefined>;
}
export const getUserRef: GetUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserRef:
```typescript
const name = getUserRef.operationName;
console.log(name);
```

### Variables
The `GetUser` query has no variables.
### Return Type
Recall that executing the `GetUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserData {
  user?: {
    name: string;
    email: string;
    profileSummary?: string | null;
  };
}
```
### Using `GetUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUser } from '@dataconnect/generated';


// Call the `getUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUser(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getUser().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserRef } from '@dataconnect/generated';


// Call the `getUserRef()` function to get a reference to the query.
const ref = getUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListUsers
You can execute the `ListUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUsersRef:
```typescript
const name = listUsersRef.operationName;
console.log(name);
```

### Variables
The `ListUsers` query has no variables.
### Return Type
Recall that executing the `ListUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUsersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUsersData {
  users: ({
    name: string;
    email: string;
  })[];
}
```
### Using `ListUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUsers } from '@dataconnect/generated';


// Call the `listUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUsers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
listUsers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `ListUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUsersRef } from '@dataconnect/generated';


// Call the `listUsersRef()` function to get a reference to the query.
const ref = listUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUsersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## GetCompany
You can execute the `GetCompany` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getCompany(vars: GetCompanyVariables, options?: ExecuteQueryOptions): QueryPromise<GetCompanyData, GetCompanyVariables>;

interface GetCompanyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCompanyVariables): QueryRef<GetCompanyData, GetCompanyVariables>;
}
export const getCompanyRef: GetCompanyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCompany(dc: DataConnect, vars: GetCompanyVariables, options?: ExecuteQueryOptions): QueryPromise<GetCompanyData, GetCompanyVariables>;

interface GetCompanyRef {
  ...
  (dc: DataConnect, vars: GetCompanyVariables): QueryRef<GetCompanyData, GetCompanyVariables>;
}
export const getCompanyRef: GetCompanyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCompanyRef:
```typescript
const name = getCompanyRef.operationName;
console.log(name);
```

### Variables
The `GetCompany` query requires an argument of type `GetCompanyVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCompanyVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetCompany` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCompanyData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCompanyData {
  company?: {
    name: string;
    industry?: string | null;
    websiteUrl?: string | null;
  };
}
```
### Using `GetCompany`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCompany, GetCompanyVariables } from '@dataconnect/generated';

// The `GetCompany` query requires an argument of type `GetCompanyVariables`:
const getCompanyVars: GetCompanyVariables = {
  id: ..., 
};

// Call the `getCompany()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCompany(getCompanyVars);
// Variables can be defined inline as well.
const { data } = await getCompany({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCompany(dataConnect, getCompanyVars);

console.log(data.company);

// Or, you can use the `Promise` API.
getCompany(getCompanyVars).then((response) => {
  const data = response.data;
  console.log(data.company);
});
```

### Using `GetCompany`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCompanyRef, GetCompanyVariables } from '@dataconnect/generated';

// The `GetCompany` query requires an argument of type `GetCompanyVariables`:
const getCompanyVars: GetCompanyVariables = {
  id: ..., 
};

// Call the `getCompanyRef()` function to get a reference to the query.
const ref = getCompanyRef(getCompanyVars);
// Variables can be defined inline as well.
const ref = getCompanyRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCompanyRef(dataConnect, getCompanyVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.company);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.company);
});
```

## ListCompanies
You can execute the `ListCompanies` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listCompanies(options?: ExecuteQueryOptions): QueryPromise<ListCompaniesData, undefined>;

interface ListCompaniesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCompaniesData, undefined>;
}
export const listCompaniesRef: ListCompaniesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCompanies(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListCompaniesData, undefined>;

interface ListCompaniesRef {
  ...
  (dc: DataConnect): QueryRef<ListCompaniesData, undefined>;
}
export const listCompaniesRef: ListCompaniesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCompaniesRef:
```typescript
const name = listCompaniesRef.operationName;
console.log(name);
```

### Variables
The `ListCompanies` query has no variables.
### Return Type
Recall that executing the `ListCompanies` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCompaniesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCompaniesData {
  companies: ({
    name: string;
    industry?: string | null;
  })[];
}
```
### Using `ListCompanies`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCompanies } from '@dataconnect/generated';


// Call the `listCompanies()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCompanies();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCompanies(dataConnect);

console.log(data.companies);

// Or, you can use the `Promise` API.
listCompanies().then((response) => {
  const data = response.data;
  console.log(data.companies);
});
```

### Using `ListCompanies`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCompaniesRef } from '@dataconnect/generated';


// Call the `listCompaniesRef()` function to get a reference to the query.
const ref = listCompaniesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCompaniesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.companies);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.companies);
});
```

## GetJobPosting
You can execute the `GetJobPosting` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getJobPosting(vars: GetJobPostingVariables, options?: ExecuteQueryOptions): QueryPromise<GetJobPostingData, GetJobPostingVariables>;

interface GetJobPostingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetJobPostingVariables): QueryRef<GetJobPostingData, GetJobPostingVariables>;
}
export const getJobPostingRef: GetJobPostingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getJobPosting(dc: DataConnect, vars: GetJobPostingVariables, options?: ExecuteQueryOptions): QueryPromise<GetJobPostingData, GetJobPostingVariables>;

interface GetJobPostingRef {
  ...
  (dc: DataConnect, vars: GetJobPostingVariables): QueryRef<GetJobPostingData, GetJobPostingVariables>;
}
export const getJobPostingRef: GetJobPostingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getJobPostingRef:
```typescript
const name = getJobPostingRef.operationName;
console.log(name);
```

### Variables
The `GetJobPosting` query requires an argument of type `GetJobPostingVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetJobPostingVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetJobPosting` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetJobPostingData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetJobPostingData {
  jobPosting?: {
    title: string;
    status: string;
    salaryRange?: string | null;
    description?: string | null;
  };
}
```
### Using `GetJobPosting`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getJobPosting, GetJobPostingVariables } from '@dataconnect/generated';

// The `GetJobPosting` query requires an argument of type `GetJobPostingVariables`:
const getJobPostingVars: GetJobPostingVariables = {
  id: ..., 
};

// Call the `getJobPosting()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getJobPosting(getJobPostingVars);
// Variables can be defined inline as well.
const { data } = await getJobPosting({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getJobPosting(dataConnect, getJobPostingVars);

console.log(data.jobPosting);

// Or, you can use the `Promise` API.
getJobPosting(getJobPostingVars).then((response) => {
  const data = response.data;
  console.log(data.jobPosting);
});
```

### Using `GetJobPosting`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getJobPostingRef, GetJobPostingVariables } from '@dataconnect/generated';

// The `GetJobPosting` query requires an argument of type `GetJobPostingVariables`:
const getJobPostingVars: GetJobPostingVariables = {
  id: ..., 
};

// Call the `getJobPostingRef()` function to get a reference to the query.
const ref = getJobPostingRef(getJobPostingVars);
// Variables can be defined inline as well.
const ref = getJobPostingRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getJobPostingRef(dataConnect, getJobPostingVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.jobPosting);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.jobPosting);
});
```

## ListJobPostings
You can execute the `ListJobPostings` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listJobPostings(options?: ExecuteQueryOptions): QueryPromise<ListJobPostingsData, undefined>;

interface ListJobPostingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListJobPostingsData, undefined>;
}
export const listJobPostingsRef: ListJobPostingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listJobPostings(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListJobPostingsData, undefined>;

interface ListJobPostingsRef {
  ...
  (dc: DataConnect): QueryRef<ListJobPostingsData, undefined>;
}
export const listJobPostingsRef: ListJobPostingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listJobPostingsRef:
```typescript
const name = listJobPostingsRef.operationName;
console.log(name);
```

### Variables
The `ListJobPostings` query has no variables.
### Return Type
Recall that executing the `ListJobPostings` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListJobPostingsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListJobPostingsData {
  jobPostings: ({
    title: string;
    status: string;
    company: {
      name: string;
    };
  })[];
}
```
### Using `ListJobPostings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listJobPostings } from '@dataconnect/generated';


// Call the `listJobPostings()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listJobPostings();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listJobPostings(dataConnect);

console.log(data.jobPostings);

// Or, you can use the `Promise` API.
listJobPostings().then((response) => {
  const data = response.data;
  console.log(data.jobPostings);
});
```

### Using `ListJobPostings`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listJobPostingsRef } from '@dataconnect/generated';


// Call the `listJobPostingsRef()` function to get a reference to the query.
const ref = listJobPostingsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listJobPostingsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.jobPostings);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.jobPostings);
});
```

## GetContact
You can execute the `GetContact` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getContact(vars: GetContactVariables, options?: ExecuteQueryOptions): QueryPromise<GetContactData, GetContactVariables>;

interface GetContactRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetContactVariables): QueryRef<GetContactData, GetContactVariables>;
}
export const getContactRef: GetContactRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getContact(dc: DataConnect, vars: GetContactVariables, options?: ExecuteQueryOptions): QueryPromise<GetContactData, GetContactVariables>;

interface GetContactRef {
  ...
  (dc: DataConnect, vars: GetContactVariables): QueryRef<GetContactData, GetContactVariables>;
}
export const getContactRef: GetContactRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getContactRef:
```typescript
const name = getContactRef.operationName;
console.log(name);
```

### Variables
The `GetContact` query requires an argument of type `GetContactVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetContactVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetContact` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetContactData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetContactData {
  contact?: {
    name: string;
    email?: string | null;
    role?: string | null;
  };
}
```
### Using `GetContact`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getContact, GetContactVariables } from '@dataconnect/generated';

// The `GetContact` query requires an argument of type `GetContactVariables`:
const getContactVars: GetContactVariables = {
  id: ..., 
};

// Call the `getContact()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getContact(getContactVars);
// Variables can be defined inline as well.
const { data } = await getContact({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getContact(dataConnect, getContactVars);

console.log(data.contact);

// Or, you can use the `Promise` API.
getContact(getContactVars).then((response) => {
  const data = response.data;
  console.log(data.contact);
});
```

### Using `GetContact`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getContactRef, GetContactVariables } from '@dataconnect/generated';

// The `GetContact` query requires an argument of type `GetContactVariables`:
const getContactVars: GetContactVariables = {
  id: ..., 
};

// Call the `getContactRef()` function to get a reference to the query.
const ref = getContactRef(getContactVars);
// Variables can be defined inline as well.
const ref = getContactRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getContactRef(dataConnect, getContactVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.contact);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.contact);
});
```

## ListContacts
You can execute the `ListContacts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listContacts(options?: ExecuteQueryOptions): QueryPromise<ListContactsData, undefined>;

interface ListContactsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListContactsData, undefined>;
}
export const listContactsRef: ListContactsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listContacts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListContactsData, undefined>;

interface ListContactsRef {
  ...
  (dc: DataConnect): QueryRef<ListContactsData, undefined>;
}
export const listContactsRef: ListContactsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listContactsRef:
```typescript
const name = listContactsRef.operationName;
console.log(name);
```

### Variables
The `ListContacts` query has no variables.
### Return Type
Recall that executing the `ListContacts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListContactsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListContactsData {
  contacts: ({
    name: string;
    role?: string | null;
    job: {
      title: string;
    };
  })[];
}
```
### Using `ListContacts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listContacts } from '@dataconnect/generated';


// Call the `listContacts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listContacts();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listContacts(dataConnect);

console.log(data.contacts);

// Or, you can use the `Promise` API.
listContacts().then((response) => {
  const data = response.data;
  console.log(data.contacts);
});
```

### Using `ListContacts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listContactsRef } from '@dataconnect/generated';


// Call the `listContactsRef()` function to get a reference to the query.
const ref = listContactsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listContactsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.contacts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.contacts);
});
```

## GetApplicationNote
You can execute the `GetApplicationNote` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getApplicationNote(vars: GetApplicationNoteVariables, options?: ExecuteQueryOptions): QueryPromise<GetApplicationNoteData, GetApplicationNoteVariables>;

interface GetApplicationNoteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetApplicationNoteVariables): QueryRef<GetApplicationNoteData, GetApplicationNoteVariables>;
}
export const getApplicationNoteRef: GetApplicationNoteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getApplicationNote(dc: DataConnect, vars: GetApplicationNoteVariables, options?: ExecuteQueryOptions): QueryPromise<GetApplicationNoteData, GetApplicationNoteVariables>;

interface GetApplicationNoteRef {
  ...
  (dc: DataConnect, vars: GetApplicationNoteVariables): QueryRef<GetApplicationNoteData, GetApplicationNoteVariables>;
}
export const getApplicationNoteRef: GetApplicationNoteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getApplicationNoteRef:
```typescript
const name = getApplicationNoteRef.operationName;
console.log(name);
```

### Variables
The `GetApplicationNote` query requires an argument of type `GetApplicationNoteVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetApplicationNoteVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetApplicationNote` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetApplicationNoteData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetApplicationNoteData {
  applicationNote?: {
    content: string;
    createdAt?: TimestampString | null;
  };
}
```
### Using `GetApplicationNote`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getApplicationNote, GetApplicationNoteVariables } from '@dataconnect/generated';

// The `GetApplicationNote` query requires an argument of type `GetApplicationNoteVariables`:
const getApplicationNoteVars: GetApplicationNoteVariables = {
  id: ..., 
};

// Call the `getApplicationNote()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getApplicationNote(getApplicationNoteVars);
// Variables can be defined inline as well.
const { data } = await getApplicationNote({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getApplicationNote(dataConnect, getApplicationNoteVars);

console.log(data.applicationNote);

// Or, you can use the `Promise` API.
getApplicationNote(getApplicationNoteVars).then((response) => {
  const data = response.data;
  console.log(data.applicationNote);
});
```

### Using `GetApplicationNote`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getApplicationNoteRef, GetApplicationNoteVariables } from '@dataconnect/generated';

// The `GetApplicationNote` query requires an argument of type `GetApplicationNoteVariables`:
const getApplicationNoteVars: GetApplicationNoteVariables = {
  id: ..., 
};

// Call the `getApplicationNoteRef()` function to get a reference to the query.
const ref = getApplicationNoteRef(getApplicationNoteVars);
// Variables can be defined inline as well.
const ref = getApplicationNoteRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getApplicationNoteRef(dataConnect, getApplicationNoteVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.applicationNote);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.applicationNote);
});
```

## ListApplicationNotes
You can execute the `ListApplicationNotes` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listApplicationNotes(options?: ExecuteQueryOptions): QueryPromise<ListApplicationNotesData, undefined>;

interface ListApplicationNotesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListApplicationNotesData, undefined>;
}
export const listApplicationNotesRef: ListApplicationNotesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listApplicationNotes(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListApplicationNotesData, undefined>;

interface ListApplicationNotesRef {
  ...
  (dc: DataConnect): QueryRef<ListApplicationNotesData, undefined>;
}
export const listApplicationNotesRef: ListApplicationNotesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listApplicationNotesRef:
```typescript
const name = listApplicationNotesRef.operationName;
console.log(name);
```

### Variables
The `ListApplicationNotes` query has no variables.
### Return Type
Recall that executing the `ListApplicationNotes` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListApplicationNotesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListApplicationNotesData {
  applicationNotes: ({
    content: string;
    job: {
      title: string;
    };
  })[];
}
```
### Using `ListApplicationNotes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listApplicationNotes } from '@dataconnect/generated';


// Call the `listApplicationNotes()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listApplicationNotes();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listApplicationNotes(dataConnect);

console.log(data.applicationNotes);

// Or, you can use the `Promise` API.
listApplicationNotes().then((response) => {
  const data = response.data;
  console.log(data.applicationNotes);
});
```

### Using `ListApplicationNotes`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listApplicationNotesRef } from '@dataconnect/generated';


// Call the `listApplicationNotesRef()` function to get a reference to the query.
const ref = listApplicationNotesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listApplicationNotesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.applicationNotes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.applicationNotes);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## InsertUser
You can execute the `InsertUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
insertUser(vars: InsertUserVariables): MutationPromise<InsertUserData, InsertUserVariables>;

interface InsertUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertUserVariables): MutationRef<InsertUserData, InsertUserVariables>;
}
export const insertUserRef: InsertUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
insertUser(dc: DataConnect, vars: InsertUserVariables): MutationPromise<InsertUserData, InsertUserVariables>;

interface InsertUserRef {
  ...
  (dc: DataConnect, vars: InsertUserVariables): MutationRef<InsertUserData, InsertUserVariables>;
}
export const insertUserRef: InsertUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the insertUserRef:
```typescript
const name = insertUserRef.operationName;
console.log(name);
```

### Variables
The `InsertUser` mutation requires an argument of type `InsertUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface InsertUserVariables {
  name: string;
  email: string;
}
```
### Return Type
Recall that executing the `InsertUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `InsertUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface InsertUserData {
  user_insert: User_Key;
}
```
### Using `InsertUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, insertUser, InsertUserVariables } from '@dataconnect/generated';

// The `InsertUser` mutation requires an argument of type `InsertUserVariables`:
const insertUserVars: InsertUserVariables = {
  name: ..., 
  email: ..., 
};

// Call the `insertUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await insertUser(insertUserVars);
// Variables can be defined inline as well.
const { data } = await insertUser({ name: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await insertUser(dataConnect, insertUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
insertUser(insertUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `InsertUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, insertUserRef, InsertUserVariables } from '@dataconnect/generated';

// The `InsertUser` mutation requires an argument of type `InsertUserVariables`:
const insertUserVars: InsertUserVariables = {
  name: ..., 
  email: ..., 
};

// Call the `insertUserRef()` function to get a reference to the mutation.
const ref = insertUserRef(insertUserVars);
// Variables can be defined inline as well.
const ref = insertUserRef({ name: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = insertUserRef(dataConnect, insertUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdateUser
You can execute the `UpdateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUser(vars: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface UpdateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
}
export const updateUserRef: UpdateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUser(dc: DataConnect, vars: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface UpdateUserRef {
  ...
  (dc: DataConnect, vars: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
}
export const updateUserRef: UpdateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserRef:
```typescript
const name = updateUserRef.operationName;
console.log(name);
```

### Variables
The `UpdateUser` mutation requires an argument of type `UpdateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserVariables {
  name: string;
}
```
### Return Type
Recall that executing the `UpdateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUser, UpdateUserVariables } from '@dataconnect/generated';

// The `UpdateUser` mutation requires an argument of type `UpdateUserVariables`:
const updateUserVars: UpdateUserVariables = {
  name: ..., 
};

// Call the `updateUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUser(updateUserVars);
// Variables can be defined inline as well.
const { data } = await updateUser({ name: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUser(dataConnect, updateUserVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUser(updateUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserRef, UpdateUserVariables } from '@dataconnect/generated';

// The `UpdateUser` mutation requires an argument of type `UpdateUserVariables`:
const updateUserVars: UpdateUserVariables = {
  name: ..., 
};

// Call the `updateUserRef()` function to get a reference to the mutation.
const ref = updateUserRef(updateUserVars);
// Variables can be defined inline as well.
const ref = updateUserRef({ name: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserRef(dataConnect, updateUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## DeleteUser
You can execute the `DeleteUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteUser(): MutationPromise<DeleteUserData, undefined>;

interface DeleteUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
}
export const deleteUserRef: DeleteUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

interface DeleteUserRef {
  ...
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
}
export const deleteUserRef: DeleteUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserRef:
```typescript
const name = deleteUserRef.operationName;
console.log(name);
```

### Variables
The `DeleteUser` mutation has no variables.
### Return Type
Recall that executing the `DeleteUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserData {
  user_delete?: User_Key | null;
}
```
### Using `DeleteUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUser } from '@dataconnect/generated';


// Call the `deleteUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUser(dataConnect);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
deleteUser().then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

### Using `DeleteUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserRef } from '@dataconnect/generated';


// Call the `deleteUserRef()` function to get a reference to the mutation.
const ref = deleteUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

## CreateCompany
You can execute the `CreateCompany` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createCompany(vars: CreateCompanyVariables): MutationPromise<CreateCompanyData, CreateCompanyVariables>;

interface CreateCompanyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCompanyVariables): MutationRef<CreateCompanyData, CreateCompanyVariables>;
}
export const createCompanyRef: CreateCompanyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCompany(dc: DataConnect, vars: CreateCompanyVariables): MutationPromise<CreateCompanyData, CreateCompanyVariables>;

interface CreateCompanyRef {
  ...
  (dc: DataConnect, vars: CreateCompanyVariables): MutationRef<CreateCompanyData, CreateCompanyVariables>;
}
export const createCompanyRef: CreateCompanyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCompanyRef:
```typescript
const name = createCompanyRef.operationName;
console.log(name);
```

### Variables
The `CreateCompany` mutation requires an argument of type `CreateCompanyVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCompanyVariables {
  name: string;
  industry?: string | null;
}
```
### Return Type
Recall that executing the `CreateCompany` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCompanyData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCompanyData {
  company_insert: Company_Key;
}
```
### Using `CreateCompany`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCompany, CreateCompanyVariables } from '@dataconnect/generated';

// The `CreateCompany` mutation requires an argument of type `CreateCompanyVariables`:
const createCompanyVars: CreateCompanyVariables = {
  name: ..., 
  industry: ..., // optional
};

// Call the `createCompany()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCompany(createCompanyVars);
// Variables can be defined inline as well.
const { data } = await createCompany({ name: ..., industry: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCompany(dataConnect, createCompanyVars);

console.log(data.company_insert);

// Or, you can use the `Promise` API.
createCompany(createCompanyVars).then((response) => {
  const data = response.data;
  console.log(data.company_insert);
});
```

### Using `CreateCompany`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCompanyRef, CreateCompanyVariables } from '@dataconnect/generated';

// The `CreateCompany` mutation requires an argument of type `CreateCompanyVariables`:
const createCompanyVars: CreateCompanyVariables = {
  name: ..., 
  industry: ..., // optional
};

// Call the `createCompanyRef()` function to get a reference to the mutation.
const ref = createCompanyRef(createCompanyVars);
// Variables can be defined inline as well.
const ref = createCompanyRef({ name: ..., industry: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCompanyRef(dataConnect, createCompanyVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.company_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.company_insert);
});
```

## UpdateCompany
You can execute the `UpdateCompany` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateCompany(vars: UpdateCompanyVariables): MutationPromise<UpdateCompanyData, UpdateCompanyVariables>;

interface UpdateCompanyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCompanyVariables): MutationRef<UpdateCompanyData, UpdateCompanyVariables>;
}
export const updateCompanyRef: UpdateCompanyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateCompany(dc: DataConnect, vars: UpdateCompanyVariables): MutationPromise<UpdateCompanyData, UpdateCompanyVariables>;

interface UpdateCompanyRef {
  ...
  (dc: DataConnect, vars: UpdateCompanyVariables): MutationRef<UpdateCompanyData, UpdateCompanyVariables>;
}
export const updateCompanyRef: UpdateCompanyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateCompanyRef:
```typescript
const name = updateCompanyRef.operationName;
console.log(name);
```

### Variables
The `UpdateCompany` mutation requires an argument of type `UpdateCompanyVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateCompanyVariables {
  id: UUIDString;
  name?: string | null;
}
```
### Return Type
Recall that executing the `UpdateCompany` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateCompanyData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateCompanyData {
  company_update?: Company_Key | null;
}
```
### Using `UpdateCompany`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateCompany, UpdateCompanyVariables } from '@dataconnect/generated';

// The `UpdateCompany` mutation requires an argument of type `UpdateCompanyVariables`:
const updateCompanyVars: UpdateCompanyVariables = {
  id: ..., 
  name: ..., // optional
};

// Call the `updateCompany()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateCompany(updateCompanyVars);
// Variables can be defined inline as well.
const { data } = await updateCompany({ id: ..., name: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateCompany(dataConnect, updateCompanyVars);

console.log(data.company_update);

// Or, you can use the `Promise` API.
updateCompany(updateCompanyVars).then((response) => {
  const data = response.data;
  console.log(data.company_update);
});
```

### Using `UpdateCompany`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateCompanyRef, UpdateCompanyVariables } from '@dataconnect/generated';

// The `UpdateCompany` mutation requires an argument of type `UpdateCompanyVariables`:
const updateCompanyVars: UpdateCompanyVariables = {
  id: ..., 
  name: ..., // optional
};

// Call the `updateCompanyRef()` function to get a reference to the mutation.
const ref = updateCompanyRef(updateCompanyVars);
// Variables can be defined inline as well.
const ref = updateCompanyRef({ id: ..., name: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateCompanyRef(dataConnect, updateCompanyVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.company_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.company_update);
});
```

## DeleteCompany
You can execute the `DeleteCompany` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteCompany(vars: DeleteCompanyVariables): MutationPromise<DeleteCompanyData, DeleteCompanyVariables>;

interface DeleteCompanyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCompanyVariables): MutationRef<DeleteCompanyData, DeleteCompanyVariables>;
}
export const deleteCompanyRef: DeleteCompanyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteCompany(dc: DataConnect, vars: DeleteCompanyVariables): MutationPromise<DeleteCompanyData, DeleteCompanyVariables>;

interface DeleteCompanyRef {
  ...
  (dc: DataConnect, vars: DeleteCompanyVariables): MutationRef<DeleteCompanyData, DeleteCompanyVariables>;
}
export const deleteCompanyRef: DeleteCompanyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteCompanyRef:
```typescript
const name = deleteCompanyRef.operationName;
console.log(name);
```

### Variables
The `DeleteCompany` mutation requires an argument of type `DeleteCompanyVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteCompanyVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteCompany` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteCompanyData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteCompanyData {
  company_delete?: Company_Key | null;
}
```
### Using `DeleteCompany`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteCompany, DeleteCompanyVariables } from '@dataconnect/generated';

// The `DeleteCompany` mutation requires an argument of type `DeleteCompanyVariables`:
const deleteCompanyVars: DeleteCompanyVariables = {
  id: ..., 
};

// Call the `deleteCompany()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteCompany(deleteCompanyVars);
// Variables can be defined inline as well.
const { data } = await deleteCompany({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteCompany(dataConnect, deleteCompanyVars);

console.log(data.company_delete);

// Or, you can use the `Promise` API.
deleteCompany(deleteCompanyVars).then((response) => {
  const data = response.data;
  console.log(data.company_delete);
});
```

### Using `DeleteCompany`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteCompanyRef, DeleteCompanyVariables } from '@dataconnect/generated';

// The `DeleteCompany` mutation requires an argument of type `DeleteCompanyVariables`:
const deleteCompanyVars: DeleteCompanyVariables = {
  id: ..., 
};

// Call the `deleteCompanyRef()` function to get a reference to the mutation.
const ref = deleteCompanyRef(deleteCompanyVars);
// Variables can be defined inline as well.
const ref = deleteCompanyRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteCompanyRef(dataConnect, deleteCompanyVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.company_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.company_delete);
});
```

## CreateJobPosting
You can execute the `CreateJobPosting` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createJobPosting(vars: CreateJobPostingVariables): MutationPromise<CreateJobPostingData, CreateJobPostingVariables>;

interface CreateJobPostingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateJobPostingVariables): MutationRef<CreateJobPostingData, CreateJobPostingVariables>;
}
export const createJobPostingRef: CreateJobPostingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createJobPosting(dc: DataConnect, vars: CreateJobPostingVariables): MutationPromise<CreateJobPostingData, CreateJobPostingVariables>;

interface CreateJobPostingRef {
  ...
  (dc: DataConnect, vars: CreateJobPostingVariables): MutationRef<CreateJobPostingData, CreateJobPostingVariables>;
}
export const createJobPostingRef: CreateJobPostingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createJobPostingRef:
```typescript
const name = createJobPostingRef.operationName;
console.log(name);
```

### Variables
The `CreateJobPosting` mutation requires an argument of type `CreateJobPostingVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateJobPostingVariables {
  title: string;
  status: string;
  companyId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateJobPosting` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateJobPostingData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateJobPostingData {
  jobPosting_insert: JobPosting_Key;
}
```
### Using `CreateJobPosting`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createJobPosting, CreateJobPostingVariables } from '@dataconnect/generated';

// The `CreateJobPosting` mutation requires an argument of type `CreateJobPostingVariables`:
const createJobPostingVars: CreateJobPostingVariables = {
  title: ..., 
  status: ..., 
  companyId: ..., 
};

// Call the `createJobPosting()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createJobPosting(createJobPostingVars);
// Variables can be defined inline as well.
const { data } = await createJobPosting({ title: ..., status: ..., companyId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createJobPosting(dataConnect, createJobPostingVars);

console.log(data.jobPosting_insert);

// Or, you can use the `Promise` API.
createJobPosting(createJobPostingVars).then((response) => {
  const data = response.data;
  console.log(data.jobPosting_insert);
});
```

### Using `CreateJobPosting`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createJobPostingRef, CreateJobPostingVariables } from '@dataconnect/generated';

// The `CreateJobPosting` mutation requires an argument of type `CreateJobPostingVariables`:
const createJobPostingVars: CreateJobPostingVariables = {
  title: ..., 
  status: ..., 
  companyId: ..., 
};

// Call the `createJobPostingRef()` function to get a reference to the mutation.
const ref = createJobPostingRef(createJobPostingVars);
// Variables can be defined inline as well.
const ref = createJobPostingRef({ title: ..., status: ..., companyId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createJobPostingRef(dataConnect, createJobPostingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.jobPosting_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.jobPosting_insert);
});
```

## UpdateJobPosting
You can execute the `UpdateJobPosting` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateJobPosting(vars: UpdateJobPostingVariables): MutationPromise<UpdateJobPostingData, UpdateJobPostingVariables>;

interface UpdateJobPostingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateJobPostingVariables): MutationRef<UpdateJobPostingData, UpdateJobPostingVariables>;
}
export const updateJobPostingRef: UpdateJobPostingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateJobPosting(dc: DataConnect, vars: UpdateJobPostingVariables): MutationPromise<UpdateJobPostingData, UpdateJobPostingVariables>;

interface UpdateJobPostingRef {
  ...
  (dc: DataConnect, vars: UpdateJobPostingVariables): MutationRef<UpdateJobPostingData, UpdateJobPostingVariables>;
}
export const updateJobPostingRef: UpdateJobPostingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateJobPostingRef:
```typescript
const name = updateJobPostingRef.operationName;
console.log(name);
```

### Variables
The `UpdateJobPosting` mutation requires an argument of type `UpdateJobPostingVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateJobPostingVariables {
  id: UUIDString;
  status?: string | null;
}
```
### Return Type
Recall that executing the `UpdateJobPosting` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateJobPostingData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateJobPostingData {
  jobPosting_update?: JobPosting_Key | null;
}
```
### Using `UpdateJobPosting`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateJobPosting, UpdateJobPostingVariables } from '@dataconnect/generated';

// The `UpdateJobPosting` mutation requires an argument of type `UpdateJobPostingVariables`:
const updateJobPostingVars: UpdateJobPostingVariables = {
  id: ..., 
  status: ..., // optional
};

// Call the `updateJobPosting()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateJobPosting(updateJobPostingVars);
// Variables can be defined inline as well.
const { data } = await updateJobPosting({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateJobPosting(dataConnect, updateJobPostingVars);

console.log(data.jobPosting_update);

// Or, you can use the `Promise` API.
updateJobPosting(updateJobPostingVars).then((response) => {
  const data = response.data;
  console.log(data.jobPosting_update);
});
```

### Using `UpdateJobPosting`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateJobPostingRef, UpdateJobPostingVariables } from '@dataconnect/generated';

// The `UpdateJobPosting` mutation requires an argument of type `UpdateJobPostingVariables`:
const updateJobPostingVars: UpdateJobPostingVariables = {
  id: ..., 
  status: ..., // optional
};

// Call the `updateJobPostingRef()` function to get a reference to the mutation.
const ref = updateJobPostingRef(updateJobPostingVars);
// Variables can be defined inline as well.
const ref = updateJobPostingRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateJobPostingRef(dataConnect, updateJobPostingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.jobPosting_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.jobPosting_update);
});
```

## DeleteJobPosting
You can execute the `DeleteJobPosting` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteJobPosting(vars: DeleteJobPostingVariables): MutationPromise<DeleteJobPostingData, DeleteJobPostingVariables>;

interface DeleteJobPostingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteJobPostingVariables): MutationRef<DeleteJobPostingData, DeleteJobPostingVariables>;
}
export const deleteJobPostingRef: DeleteJobPostingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteJobPosting(dc: DataConnect, vars: DeleteJobPostingVariables): MutationPromise<DeleteJobPostingData, DeleteJobPostingVariables>;

interface DeleteJobPostingRef {
  ...
  (dc: DataConnect, vars: DeleteJobPostingVariables): MutationRef<DeleteJobPostingData, DeleteJobPostingVariables>;
}
export const deleteJobPostingRef: DeleteJobPostingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteJobPostingRef:
```typescript
const name = deleteJobPostingRef.operationName;
console.log(name);
```

### Variables
The `DeleteJobPosting` mutation requires an argument of type `DeleteJobPostingVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteJobPostingVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteJobPosting` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteJobPostingData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteJobPostingData {
  jobPosting_delete?: JobPosting_Key | null;
}
```
### Using `DeleteJobPosting`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteJobPosting, DeleteJobPostingVariables } from '@dataconnect/generated';

// The `DeleteJobPosting` mutation requires an argument of type `DeleteJobPostingVariables`:
const deleteJobPostingVars: DeleteJobPostingVariables = {
  id: ..., 
};

// Call the `deleteJobPosting()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteJobPosting(deleteJobPostingVars);
// Variables can be defined inline as well.
const { data } = await deleteJobPosting({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteJobPosting(dataConnect, deleteJobPostingVars);

console.log(data.jobPosting_delete);

// Or, you can use the `Promise` API.
deleteJobPosting(deleteJobPostingVars).then((response) => {
  const data = response.data;
  console.log(data.jobPosting_delete);
});
```

### Using `DeleteJobPosting`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteJobPostingRef, DeleteJobPostingVariables } from '@dataconnect/generated';

// The `DeleteJobPosting` mutation requires an argument of type `DeleteJobPostingVariables`:
const deleteJobPostingVars: DeleteJobPostingVariables = {
  id: ..., 
};

// Call the `deleteJobPostingRef()` function to get a reference to the mutation.
const ref = deleteJobPostingRef(deleteJobPostingVars);
// Variables can be defined inline as well.
const ref = deleteJobPostingRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteJobPostingRef(dataConnect, deleteJobPostingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.jobPosting_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.jobPosting_delete);
});
```

## CreateContact
You can execute the `CreateContact` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createContact(vars: CreateContactVariables): MutationPromise<CreateContactData, CreateContactVariables>;

interface CreateContactRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateContactVariables): MutationRef<CreateContactData, CreateContactVariables>;
}
export const createContactRef: CreateContactRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createContact(dc: DataConnect, vars: CreateContactVariables): MutationPromise<CreateContactData, CreateContactVariables>;

interface CreateContactRef {
  ...
  (dc: DataConnect, vars: CreateContactVariables): MutationRef<CreateContactData, CreateContactVariables>;
}
export const createContactRef: CreateContactRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createContactRef:
```typescript
const name = createContactRef.operationName;
console.log(name);
```

### Variables
The `CreateContact` mutation requires an argument of type `CreateContactVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateContactVariables {
  name: string;
  jobId: UUIDString;
  email?: string | null;
}
```
### Return Type
Recall that executing the `CreateContact` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateContactData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateContactData {
  contact_insert: Contact_Key;
}
```
### Using `CreateContact`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createContact, CreateContactVariables } from '@dataconnect/generated';

// The `CreateContact` mutation requires an argument of type `CreateContactVariables`:
const createContactVars: CreateContactVariables = {
  name: ..., 
  jobId: ..., 
  email: ..., // optional
};

// Call the `createContact()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createContact(createContactVars);
// Variables can be defined inline as well.
const { data } = await createContact({ name: ..., jobId: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createContact(dataConnect, createContactVars);

console.log(data.contact_insert);

// Or, you can use the `Promise` API.
createContact(createContactVars).then((response) => {
  const data = response.data;
  console.log(data.contact_insert);
});
```

### Using `CreateContact`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createContactRef, CreateContactVariables } from '@dataconnect/generated';

// The `CreateContact` mutation requires an argument of type `CreateContactVariables`:
const createContactVars: CreateContactVariables = {
  name: ..., 
  jobId: ..., 
  email: ..., // optional
};

// Call the `createContactRef()` function to get a reference to the mutation.
const ref = createContactRef(createContactVars);
// Variables can be defined inline as well.
const ref = createContactRef({ name: ..., jobId: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createContactRef(dataConnect, createContactVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.contact_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.contact_insert);
});
```

## UpdateContact
You can execute the `UpdateContact` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateContact(vars: UpdateContactVariables): MutationPromise<UpdateContactData, UpdateContactVariables>;

interface UpdateContactRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateContactVariables): MutationRef<UpdateContactData, UpdateContactVariables>;
}
export const updateContactRef: UpdateContactRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateContact(dc: DataConnect, vars: UpdateContactVariables): MutationPromise<UpdateContactData, UpdateContactVariables>;

interface UpdateContactRef {
  ...
  (dc: DataConnect, vars: UpdateContactVariables): MutationRef<UpdateContactData, UpdateContactVariables>;
}
export const updateContactRef: UpdateContactRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateContactRef:
```typescript
const name = updateContactRef.operationName;
console.log(name);
```

### Variables
The `UpdateContact` mutation requires an argument of type `UpdateContactVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateContactVariables {
  id: UUIDString;
  role?: string | null;
}
```
### Return Type
Recall that executing the `UpdateContact` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateContactData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateContactData {
  contact_update?: Contact_Key | null;
}
```
### Using `UpdateContact`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateContact, UpdateContactVariables } from '@dataconnect/generated';

// The `UpdateContact` mutation requires an argument of type `UpdateContactVariables`:
const updateContactVars: UpdateContactVariables = {
  id: ..., 
  role: ..., // optional
};

// Call the `updateContact()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateContact(updateContactVars);
// Variables can be defined inline as well.
const { data } = await updateContact({ id: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateContact(dataConnect, updateContactVars);

console.log(data.contact_update);

// Or, you can use the `Promise` API.
updateContact(updateContactVars).then((response) => {
  const data = response.data;
  console.log(data.contact_update);
});
```

### Using `UpdateContact`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateContactRef, UpdateContactVariables } from '@dataconnect/generated';

// The `UpdateContact` mutation requires an argument of type `UpdateContactVariables`:
const updateContactVars: UpdateContactVariables = {
  id: ..., 
  role: ..., // optional
};

// Call the `updateContactRef()` function to get a reference to the mutation.
const ref = updateContactRef(updateContactVars);
// Variables can be defined inline as well.
const ref = updateContactRef({ id: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateContactRef(dataConnect, updateContactVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.contact_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.contact_update);
});
```

## DeleteContact
You can execute the `DeleteContact` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteContact(vars: DeleteContactVariables): MutationPromise<DeleteContactData, DeleteContactVariables>;

interface DeleteContactRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteContactVariables): MutationRef<DeleteContactData, DeleteContactVariables>;
}
export const deleteContactRef: DeleteContactRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteContact(dc: DataConnect, vars: DeleteContactVariables): MutationPromise<DeleteContactData, DeleteContactVariables>;

interface DeleteContactRef {
  ...
  (dc: DataConnect, vars: DeleteContactVariables): MutationRef<DeleteContactData, DeleteContactVariables>;
}
export const deleteContactRef: DeleteContactRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteContactRef:
```typescript
const name = deleteContactRef.operationName;
console.log(name);
```

### Variables
The `DeleteContact` mutation requires an argument of type `DeleteContactVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteContactVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteContact` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteContactData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteContactData {
  contact_delete?: Contact_Key | null;
}
```
### Using `DeleteContact`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteContact, DeleteContactVariables } from '@dataconnect/generated';

// The `DeleteContact` mutation requires an argument of type `DeleteContactVariables`:
const deleteContactVars: DeleteContactVariables = {
  id: ..., 
};

// Call the `deleteContact()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteContact(deleteContactVars);
// Variables can be defined inline as well.
const { data } = await deleteContact({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteContact(dataConnect, deleteContactVars);

console.log(data.contact_delete);

// Or, you can use the `Promise` API.
deleteContact(deleteContactVars).then((response) => {
  const data = response.data;
  console.log(data.contact_delete);
});
```

### Using `DeleteContact`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteContactRef, DeleteContactVariables } from '@dataconnect/generated';

// The `DeleteContact` mutation requires an argument of type `DeleteContactVariables`:
const deleteContactVars: DeleteContactVariables = {
  id: ..., 
};

// Call the `deleteContactRef()` function to get a reference to the mutation.
const ref = deleteContactRef(deleteContactVars);
// Variables can be defined inline as well.
const ref = deleteContactRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteContactRef(dataConnect, deleteContactVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.contact_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.contact_delete);
});
```

## CreateApplicationNote
You can execute the `CreateApplicationNote` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createApplicationNote(vars: CreateApplicationNoteVariables): MutationPromise<CreateApplicationNoteData, CreateApplicationNoteVariables>;

interface CreateApplicationNoteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateApplicationNoteVariables): MutationRef<CreateApplicationNoteData, CreateApplicationNoteVariables>;
}
export const createApplicationNoteRef: CreateApplicationNoteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createApplicationNote(dc: DataConnect, vars: CreateApplicationNoteVariables): MutationPromise<CreateApplicationNoteData, CreateApplicationNoteVariables>;

interface CreateApplicationNoteRef {
  ...
  (dc: DataConnect, vars: CreateApplicationNoteVariables): MutationRef<CreateApplicationNoteData, CreateApplicationNoteVariables>;
}
export const createApplicationNoteRef: CreateApplicationNoteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createApplicationNoteRef:
```typescript
const name = createApplicationNoteRef.operationName;
console.log(name);
```

### Variables
The `CreateApplicationNote` mutation requires an argument of type `CreateApplicationNoteVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateApplicationNoteVariables {
  content: string;
  jobId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateApplicationNote` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateApplicationNoteData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateApplicationNoteData {
  applicationNote_insert: ApplicationNote_Key;
}
```
### Using `CreateApplicationNote`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createApplicationNote, CreateApplicationNoteVariables } from '@dataconnect/generated';

// The `CreateApplicationNote` mutation requires an argument of type `CreateApplicationNoteVariables`:
const createApplicationNoteVars: CreateApplicationNoteVariables = {
  content: ..., 
  jobId: ..., 
};

// Call the `createApplicationNote()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createApplicationNote(createApplicationNoteVars);
// Variables can be defined inline as well.
const { data } = await createApplicationNote({ content: ..., jobId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createApplicationNote(dataConnect, createApplicationNoteVars);

console.log(data.applicationNote_insert);

// Or, you can use the `Promise` API.
createApplicationNote(createApplicationNoteVars).then((response) => {
  const data = response.data;
  console.log(data.applicationNote_insert);
});
```

### Using `CreateApplicationNote`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createApplicationNoteRef, CreateApplicationNoteVariables } from '@dataconnect/generated';

// The `CreateApplicationNote` mutation requires an argument of type `CreateApplicationNoteVariables`:
const createApplicationNoteVars: CreateApplicationNoteVariables = {
  content: ..., 
  jobId: ..., 
};

// Call the `createApplicationNoteRef()` function to get a reference to the mutation.
const ref = createApplicationNoteRef(createApplicationNoteVars);
// Variables can be defined inline as well.
const ref = createApplicationNoteRef({ content: ..., jobId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createApplicationNoteRef(dataConnect, createApplicationNoteVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.applicationNote_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.applicationNote_insert);
});
```

## UpdateApplicationNote
You can execute the `UpdateApplicationNote` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateApplicationNote(vars: UpdateApplicationNoteVariables): MutationPromise<UpdateApplicationNoteData, UpdateApplicationNoteVariables>;

interface UpdateApplicationNoteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateApplicationNoteVariables): MutationRef<UpdateApplicationNoteData, UpdateApplicationNoteVariables>;
}
export const updateApplicationNoteRef: UpdateApplicationNoteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateApplicationNote(dc: DataConnect, vars: UpdateApplicationNoteVariables): MutationPromise<UpdateApplicationNoteData, UpdateApplicationNoteVariables>;

interface UpdateApplicationNoteRef {
  ...
  (dc: DataConnect, vars: UpdateApplicationNoteVariables): MutationRef<UpdateApplicationNoteData, UpdateApplicationNoteVariables>;
}
export const updateApplicationNoteRef: UpdateApplicationNoteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateApplicationNoteRef:
```typescript
const name = updateApplicationNoteRef.operationName;
console.log(name);
```

### Variables
The `UpdateApplicationNote` mutation requires an argument of type `UpdateApplicationNoteVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateApplicationNoteVariables {
  id: UUIDString;
  content: string;
}
```
### Return Type
Recall that executing the `UpdateApplicationNote` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateApplicationNoteData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateApplicationNoteData {
  applicationNote_update?: ApplicationNote_Key | null;
}
```
### Using `UpdateApplicationNote`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateApplicationNote, UpdateApplicationNoteVariables } from '@dataconnect/generated';

// The `UpdateApplicationNote` mutation requires an argument of type `UpdateApplicationNoteVariables`:
const updateApplicationNoteVars: UpdateApplicationNoteVariables = {
  id: ..., 
  content: ..., 
};

// Call the `updateApplicationNote()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateApplicationNote(updateApplicationNoteVars);
// Variables can be defined inline as well.
const { data } = await updateApplicationNote({ id: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateApplicationNote(dataConnect, updateApplicationNoteVars);

console.log(data.applicationNote_update);

// Or, you can use the `Promise` API.
updateApplicationNote(updateApplicationNoteVars).then((response) => {
  const data = response.data;
  console.log(data.applicationNote_update);
});
```

### Using `UpdateApplicationNote`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateApplicationNoteRef, UpdateApplicationNoteVariables } from '@dataconnect/generated';

// The `UpdateApplicationNote` mutation requires an argument of type `UpdateApplicationNoteVariables`:
const updateApplicationNoteVars: UpdateApplicationNoteVariables = {
  id: ..., 
  content: ..., 
};

// Call the `updateApplicationNoteRef()` function to get a reference to the mutation.
const ref = updateApplicationNoteRef(updateApplicationNoteVars);
// Variables can be defined inline as well.
const ref = updateApplicationNoteRef({ id: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateApplicationNoteRef(dataConnect, updateApplicationNoteVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.applicationNote_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.applicationNote_update);
});
```

## DeleteApplicationNote
You can execute the `DeleteApplicationNote` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteApplicationNote(vars: DeleteApplicationNoteVariables): MutationPromise<DeleteApplicationNoteData, DeleteApplicationNoteVariables>;

interface DeleteApplicationNoteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteApplicationNoteVariables): MutationRef<DeleteApplicationNoteData, DeleteApplicationNoteVariables>;
}
export const deleteApplicationNoteRef: DeleteApplicationNoteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteApplicationNote(dc: DataConnect, vars: DeleteApplicationNoteVariables): MutationPromise<DeleteApplicationNoteData, DeleteApplicationNoteVariables>;

interface DeleteApplicationNoteRef {
  ...
  (dc: DataConnect, vars: DeleteApplicationNoteVariables): MutationRef<DeleteApplicationNoteData, DeleteApplicationNoteVariables>;
}
export const deleteApplicationNoteRef: DeleteApplicationNoteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteApplicationNoteRef:
```typescript
const name = deleteApplicationNoteRef.operationName;
console.log(name);
```

### Variables
The `DeleteApplicationNote` mutation requires an argument of type `DeleteApplicationNoteVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteApplicationNoteVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteApplicationNote` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteApplicationNoteData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteApplicationNoteData {
  applicationNote_delete?: ApplicationNote_Key | null;
}
```
### Using `DeleteApplicationNote`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteApplicationNote, DeleteApplicationNoteVariables } from '@dataconnect/generated';

// The `DeleteApplicationNote` mutation requires an argument of type `DeleteApplicationNoteVariables`:
const deleteApplicationNoteVars: DeleteApplicationNoteVariables = {
  id: ..., 
};

// Call the `deleteApplicationNote()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteApplicationNote(deleteApplicationNoteVars);
// Variables can be defined inline as well.
const { data } = await deleteApplicationNote({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteApplicationNote(dataConnect, deleteApplicationNoteVars);

console.log(data.applicationNote_delete);

// Or, you can use the `Promise` API.
deleteApplicationNote(deleteApplicationNoteVars).then((response) => {
  const data = response.data;
  console.log(data.applicationNote_delete);
});
```

### Using `DeleteApplicationNote`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteApplicationNoteRef, DeleteApplicationNoteVariables } from '@dataconnect/generated';

// The `DeleteApplicationNote` mutation requires an argument of type `DeleteApplicationNoteVariables`:
const deleteApplicationNoteVars: DeleteApplicationNoteVariables = {
  id: ..., 
};

// Call the `deleteApplicationNoteRef()` function to get a reference to the mutation.
const ref = deleteApplicationNoteRef(deleteApplicationNoteVars);
// Variables can be defined inline as well.
const ref = deleteApplicationNoteRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteApplicationNoteRef(dataConnect, deleteApplicationNoteVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.applicationNote_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.applicationNote_delete);
});
```

