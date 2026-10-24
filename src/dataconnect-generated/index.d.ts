import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface ApplicationNote_Key {
  id: UUIDString;
  __typename?: 'ApplicationNote_Key';
}

export interface Company_Key {
  id: UUIDString;
  __typename?: 'Company_Key';
}

export interface Contact_Key {
  id: UUIDString;
  __typename?: 'Contact_Key';
}

export interface CreateApplicationNoteData {
  applicationNote_insert: ApplicationNote_Key;
}

export interface CreateApplicationNoteVariables {
  content: string;
  jobId: UUIDString;
}

export interface CreateCompanyData {
  company_insert: Company_Key;
}

export interface CreateCompanyVariables {
  name: string;
  industry?: string | null;
}

export interface CreateContactData {
  contact_insert: Contact_Key;
}

export interface CreateContactVariables {
  name: string;
  jobId: UUIDString;
  email?: string | null;
}

export interface CreateJobPostingData {
  jobPosting_insert: JobPosting_Key;
}

export interface CreateJobPostingVariables {
  title: string;
  status: string;
  companyId: UUIDString;
}

export interface DeleteApplicationNoteData {
  applicationNote_delete?: ApplicationNote_Key | null;
}

export interface DeleteApplicationNoteVariables {
  id: UUIDString;
}

export interface DeleteCompanyData {
  company_delete?: Company_Key | null;
}

export interface DeleteCompanyVariables {
  id: UUIDString;
}

export interface DeleteContactData {
  contact_delete?: Contact_Key | null;
}

export interface DeleteContactVariables {
  id: UUIDString;
}

export interface DeleteJobPostingData {
  jobPosting_delete?: JobPosting_Key | null;
}

export interface DeleteJobPostingVariables {
  id: UUIDString;
}

export interface DeleteUserData {
  user_delete?: User_Key | null;
}

export interface GetApplicationNoteData {
  applicationNote?: {
    content: string;
    createdAt?: TimestampString | null;
  };
}

export interface GetApplicationNoteVariables {
  id: UUIDString;
}

export interface GetCompanyData {
  company?: {
    name: string;
    industry?: string | null;
    websiteUrl?: string | null;
  };
}

export interface GetCompanyVariables {
  id: UUIDString;
}

export interface GetContactData {
  contact?: {
    name: string;
    email?: string | null;
    role?: string | null;
  };
}

export interface GetContactVariables {
  id: UUIDString;
}

export interface GetJobPostingData {
  jobPosting?: {
    title: string;
    status: string;
    salaryRange?: string | null;
    description?: string | null;
  };
}

export interface GetJobPostingVariables {
  id: UUIDString;
}

export interface GetUserData {
  user?: {
    name: string;
    email: string;
    profileSummary?: string | null;
  };
}

export interface InsertUserData {
  user_insert: User_Key;
}

export interface InsertUserVariables {
  name: string;
  email: string;
}

export interface JobPosting_Key {
  id: UUIDString;
  __typename?: 'JobPosting_Key';
}

export interface ListApplicationNotesData {
  applicationNotes: ({
    content: string;
    job: {
      title: string;
    };
  })[];
}

export interface ListCompaniesData {
  companies: ({
    name: string;
    industry?: string | null;
  })[];
}

export interface ListContactsData {
  contacts: ({
    name: string;
    role?: string | null;
    job: {
      title: string;
    };
  })[];
}

export interface ListJobPostingsData {
  jobPostings: ({
    title: string;
    status: string;
    company: {
      name: string;
    };
  })[];
}

export interface ListUsersData {
  users: ({
    name: string;
    email: string;
  })[];
}

export interface UpdateApplicationNoteData {
  applicationNote_update?: ApplicationNote_Key | null;
}

export interface UpdateApplicationNoteVariables {
  id: UUIDString;
  content: string;
}

export interface UpdateCompanyData {
  company_update?: Company_Key | null;
}

export interface UpdateCompanyVariables {
  id: UUIDString;
  name?: string | null;
}

export interface UpdateContactData {
  contact_update?: Contact_Key | null;
}

export interface UpdateContactVariables {
  id: UUIDString;
  role?: string | null;
}

export interface UpdateJobPostingData {
  jobPosting_update?: JobPosting_Key | null;
}

export interface UpdateJobPostingVariables {
  id: UUIDString;
  status?: string | null;
}

export interface UpdateUserData {
  user_update?: User_Key | null;
}

export interface UpdateUserVariables {
  name: string;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface InsertUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertUserVariables): MutationRef<InsertUserData, InsertUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: InsertUserVariables): MutationRef<InsertUserData, InsertUserVariables>;
  operationName: string;
}
export const insertUserRef: InsertUserRef;

export function insertUser(vars: InsertUserVariables): MutationPromise<InsertUserData, InsertUserVariables>;
export function insertUser(dc: DataConnect, vars: InsertUserVariables): MutationPromise<InsertUserData, InsertUserVariables>;

interface UpdateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  operationName: string;
}
export const updateUserRef: UpdateUserRef;

export function updateUser(vars: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;
export function updateUser(dc: DataConnect, vars: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface DeleteUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
  operationName: string;
}
export const deleteUserRef: DeleteUserRef;

export function deleteUser(): MutationPromise<DeleteUserData, undefined>;
export function deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

interface GetUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserData, undefined>;
  operationName: string;
}
export const getUserRef: GetUserRef;

export function getUser(options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;
export function getUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;

interface ListUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
  operationName: string;
}
export const listUsersRef: ListUsersRef;

export function listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;
export function listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface CreateCompanyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCompanyVariables): MutationRef<CreateCompanyData, CreateCompanyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCompanyVariables): MutationRef<CreateCompanyData, CreateCompanyVariables>;
  operationName: string;
}
export const createCompanyRef: CreateCompanyRef;

export function createCompany(vars: CreateCompanyVariables): MutationPromise<CreateCompanyData, CreateCompanyVariables>;
export function createCompany(dc: DataConnect, vars: CreateCompanyVariables): MutationPromise<CreateCompanyData, CreateCompanyVariables>;

interface UpdateCompanyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCompanyVariables): MutationRef<UpdateCompanyData, UpdateCompanyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateCompanyVariables): MutationRef<UpdateCompanyData, UpdateCompanyVariables>;
  operationName: string;
}
export const updateCompanyRef: UpdateCompanyRef;

export function updateCompany(vars: UpdateCompanyVariables): MutationPromise<UpdateCompanyData, UpdateCompanyVariables>;
export function updateCompany(dc: DataConnect, vars: UpdateCompanyVariables): MutationPromise<UpdateCompanyData, UpdateCompanyVariables>;

interface DeleteCompanyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCompanyVariables): MutationRef<DeleteCompanyData, DeleteCompanyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteCompanyVariables): MutationRef<DeleteCompanyData, DeleteCompanyVariables>;
  operationName: string;
}
export const deleteCompanyRef: DeleteCompanyRef;

export function deleteCompany(vars: DeleteCompanyVariables): MutationPromise<DeleteCompanyData, DeleteCompanyVariables>;
export function deleteCompany(dc: DataConnect, vars: DeleteCompanyVariables): MutationPromise<DeleteCompanyData, DeleteCompanyVariables>;

interface GetCompanyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCompanyVariables): QueryRef<GetCompanyData, GetCompanyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCompanyVariables): QueryRef<GetCompanyData, GetCompanyVariables>;
  operationName: string;
}
export const getCompanyRef: GetCompanyRef;

export function getCompany(vars: GetCompanyVariables, options?: ExecuteQueryOptions): QueryPromise<GetCompanyData, GetCompanyVariables>;
export function getCompany(dc: DataConnect, vars: GetCompanyVariables, options?: ExecuteQueryOptions): QueryPromise<GetCompanyData, GetCompanyVariables>;

interface ListCompaniesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCompaniesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListCompaniesData, undefined>;
  operationName: string;
}
export const listCompaniesRef: ListCompaniesRef;

export function listCompanies(options?: ExecuteQueryOptions): QueryPromise<ListCompaniesData, undefined>;
export function listCompanies(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListCompaniesData, undefined>;

interface CreateJobPostingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateJobPostingVariables): MutationRef<CreateJobPostingData, CreateJobPostingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateJobPostingVariables): MutationRef<CreateJobPostingData, CreateJobPostingVariables>;
  operationName: string;
}
export const createJobPostingRef: CreateJobPostingRef;

export function createJobPosting(vars: CreateJobPostingVariables): MutationPromise<CreateJobPostingData, CreateJobPostingVariables>;
export function createJobPosting(dc: DataConnect, vars: CreateJobPostingVariables): MutationPromise<CreateJobPostingData, CreateJobPostingVariables>;

interface UpdateJobPostingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateJobPostingVariables): MutationRef<UpdateJobPostingData, UpdateJobPostingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateJobPostingVariables): MutationRef<UpdateJobPostingData, UpdateJobPostingVariables>;
  operationName: string;
}
export const updateJobPostingRef: UpdateJobPostingRef;

export function updateJobPosting(vars: UpdateJobPostingVariables): MutationPromise<UpdateJobPostingData, UpdateJobPostingVariables>;
export function updateJobPosting(dc: DataConnect, vars: UpdateJobPostingVariables): MutationPromise<UpdateJobPostingData, UpdateJobPostingVariables>;

interface DeleteJobPostingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteJobPostingVariables): MutationRef<DeleteJobPostingData, DeleteJobPostingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteJobPostingVariables): MutationRef<DeleteJobPostingData, DeleteJobPostingVariables>;
  operationName: string;
}
export const deleteJobPostingRef: DeleteJobPostingRef;

export function deleteJobPosting(vars: DeleteJobPostingVariables): MutationPromise<DeleteJobPostingData, DeleteJobPostingVariables>;
export function deleteJobPosting(dc: DataConnect, vars: DeleteJobPostingVariables): MutationPromise<DeleteJobPostingData, DeleteJobPostingVariables>;

interface GetJobPostingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetJobPostingVariables): QueryRef<GetJobPostingData, GetJobPostingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetJobPostingVariables): QueryRef<GetJobPostingData, GetJobPostingVariables>;
  operationName: string;
}
export const getJobPostingRef: GetJobPostingRef;

export function getJobPosting(vars: GetJobPostingVariables, options?: ExecuteQueryOptions): QueryPromise<GetJobPostingData, GetJobPostingVariables>;
export function getJobPosting(dc: DataConnect, vars: GetJobPostingVariables, options?: ExecuteQueryOptions): QueryPromise<GetJobPostingData, GetJobPostingVariables>;

interface ListJobPostingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListJobPostingsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListJobPostingsData, undefined>;
  operationName: string;
}
export const listJobPostingsRef: ListJobPostingsRef;

export function listJobPostings(options?: ExecuteQueryOptions): QueryPromise<ListJobPostingsData, undefined>;
export function listJobPostings(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListJobPostingsData, undefined>;

interface CreateContactRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateContactVariables): MutationRef<CreateContactData, CreateContactVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateContactVariables): MutationRef<CreateContactData, CreateContactVariables>;
  operationName: string;
}
export const createContactRef: CreateContactRef;

export function createContact(vars: CreateContactVariables): MutationPromise<CreateContactData, CreateContactVariables>;
export function createContact(dc: DataConnect, vars: CreateContactVariables): MutationPromise<CreateContactData, CreateContactVariables>;

interface UpdateContactRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateContactVariables): MutationRef<UpdateContactData, UpdateContactVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateContactVariables): MutationRef<UpdateContactData, UpdateContactVariables>;
  operationName: string;
}
export const updateContactRef: UpdateContactRef;

export function updateContact(vars: UpdateContactVariables): MutationPromise<UpdateContactData, UpdateContactVariables>;
export function updateContact(dc: DataConnect, vars: UpdateContactVariables): MutationPromise<UpdateContactData, UpdateContactVariables>;

interface DeleteContactRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteContactVariables): MutationRef<DeleteContactData, DeleteContactVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteContactVariables): MutationRef<DeleteContactData, DeleteContactVariables>;
  operationName: string;
}
export const deleteContactRef: DeleteContactRef;

export function deleteContact(vars: DeleteContactVariables): MutationPromise<DeleteContactData, DeleteContactVariables>;
export function deleteContact(dc: DataConnect, vars: DeleteContactVariables): MutationPromise<DeleteContactData, DeleteContactVariables>;

interface GetContactRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetContactVariables): QueryRef<GetContactData, GetContactVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetContactVariables): QueryRef<GetContactData, GetContactVariables>;
  operationName: string;
}
export const getContactRef: GetContactRef;

export function getContact(vars: GetContactVariables, options?: ExecuteQueryOptions): QueryPromise<GetContactData, GetContactVariables>;
export function getContact(dc: DataConnect, vars: GetContactVariables, options?: ExecuteQueryOptions): QueryPromise<GetContactData, GetContactVariables>;

interface ListContactsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListContactsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListContactsData, undefined>;
  operationName: string;
}
export const listContactsRef: ListContactsRef;

export function listContacts(options?: ExecuteQueryOptions): QueryPromise<ListContactsData, undefined>;
export function listContacts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListContactsData, undefined>;

interface CreateApplicationNoteRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateApplicationNoteVariables): MutationRef<CreateApplicationNoteData, CreateApplicationNoteVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateApplicationNoteVariables): MutationRef<CreateApplicationNoteData, CreateApplicationNoteVariables>;
  operationName: string;
}
export const createApplicationNoteRef: CreateApplicationNoteRef;

export function createApplicationNote(vars: CreateApplicationNoteVariables): MutationPromise<CreateApplicationNoteData, CreateApplicationNoteVariables>;
export function createApplicationNote(dc: DataConnect, vars: CreateApplicationNoteVariables): MutationPromise<CreateApplicationNoteData, CreateApplicationNoteVariables>;

interface UpdateApplicationNoteRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateApplicationNoteVariables): MutationRef<UpdateApplicationNoteData, UpdateApplicationNoteVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateApplicationNoteVariables): MutationRef<UpdateApplicationNoteData, UpdateApplicationNoteVariables>;
  operationName: string;
}
export const updateApplicationNoteRef: UpdateApplicationNoteRef;

export function updateApplicationNote(vars: UpdateApplicationNoteVariables): MutationPromise<UpdateApplicationNoteData, UpdateApplicationNoteVariables>;
export function updateApplicationNote(dc: DataConnect, vars: UpdateApplicationNoteVariables): MutationPromise<UpdateApplicationNoteData, UpdateApplicationNoteVariables>;

interface DeleteApplicationNoteRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteApplicationNoteVariables): MutationRef<DeleteApplicationNoteData, DeleteApplicationNoteVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteApplicationNoteVariables): MutationRef<DeleteApplicationNoteData, DeleteApplicationNoteVariables>;
  operationName: string;
}
export const deleteApplicationNoteRef: DeleteApplicationNoteRef;

export function deleteApplicationNote(vars: DeleteApplicationNoteVariables): MutationPromise<DeleteApplicationNoteData, DeleteApplicationNoteVariables>;
export function deleteApplicationNote(dc: DataConnect, vars: DeleteApplicationNoteVariables): MutationPromise<DeleteApplicationNoteData, DeleteApplicationNoteVariables>;

interface GetApplicationNoteRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetApplicationNoteVariables): QueryRef<GetApplicationNoteData, GetApplicationNoteVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetApplicationNoteVariables): QueryRef<GetApplicationNoteData, GetApplicationNoteVariables>;
  operationName: string;
}
export const getApplicationNoteRef: GetApplicationNoteRef;

export function getApplicationNote(vars: GetApplicationNoteVariables, options?: ExecuteQueryOptions): QueryPromise<GetApplicationNoteData, GetApplicationNoteVariables>;
export function getApplicationNote(dc: DataConnect, vars: GetApplicationNoteVariables, options?: ExecuteQueryOptions): QueryPromise<GetApplicationNoteData, GetApplicationNoteVariables>;

interface ListApplicationNotesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListApplicationNotesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListApplicationNotesData, undefined>;
  operationName: string;
}
export const listApplicationNotesRef: ListApplicationNotesRef;

export function listApplicationNotes(options?: ExecuteQueryOptions): QueryPromise<ListApplicationNotesData, undefined>;
export function listApplicationNotes(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListApplicationNotesData, undefined>;

