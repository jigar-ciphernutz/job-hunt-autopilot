import { InsertUserData, InsertUserVariables, UpdateUserData, UpdateUserVariables, DeleteUserData, GetUserData, ListUsersData, CreateCompanyData, CreateCompanyVariables, UpdateCompanyData, UpdateCompanyVariables, DeleteCompanyData, DeleteCompanyVariables, GetCompanyData, GetCompanyVariables, ListCompaniesData, CreateJobPostingData, CreateJobPostingVariables, UpdateJobPostingData, UpdateJobPostingVariables, DeleteJobPostingData, DeleteJobPostingVariables, GetJobPostingData, GetJobPostingVariables, ListJobPostingsData, CreateContactData, CreateContactVariables, UpdateContactData, UpdateContactVariables, DeleteContactData, DeleteContactVariables, GetContactData, GetContactVariables, ListContactsData, CreateApplicationNoteData, CreateApplicationNoteVariables, UpdateApplicationNoteData, UpdateApplicationNoteVariables, DeleteApplicationNoteData, DeleteApplicationNoteVariables, GetApplicationNoteData, GetApplicationNoteVariables, ListApplicationNotesData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useInsertUser(options?: useDataConnectMutationOptions<InsertUserData, FirebaseError, InsertUserVariables>): UseDataConnectMutationResult<InsertUserData, InsertUserVariables>;
export function useInsertUser(dc: DataConnect, options?: useDataConnectMutationOptions<InsertUserData, FirebaseError, InsertUserVariables>): UseDataConnectMutationResult<InsertUserData, InsertUserVariables>;

export function useUpdateUser(options?: useDataConnectMutationOptions<UpdateUserData, FirebaseError, UpdateUserVariables>): UseDataConnectMutationResult<UpdateUserData, UpdateUserVariables>;
export function useUpdateUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserData, FirebaseError, UpdateUserVariables>): UseDataConnectMutationResult<UpdateUserData, UpdateUserVariables>;

export function useDeleteUser(options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, void>): UseDataConnectMutationResult<DeleteUserData, undefined>;
export function useDeleteUser(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, void>): UseDataConnectMutationResult<DeleteUserData, undefined>;

export function useGetUser(options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, undefined>;
export function useGetUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, undefined>;

export function useListUsers(options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, undefined>;
export function useListUsers(dc: DataConnect, options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, undefined>;

export function useCreateCompany(options?: useDataConnectMutationOptions<CreateCompanyData, FirebaseError, CreateCompanyVariables>): UseDataConnectMutationResult<CreateCompanyData, CreateCompanyVariables>;
export function useCreateCompany(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCompanyData, FirebaseError, CreateCompanyVariables>): UseDataConnectMutationResult<CreateCompanyData, CreateCompanyVariables>;

export function useUpdateCompany(options?: useDataConnectMutationOptions<UpdateCompanyData, FirebaseError, UpdateCompanyVariables>): UseDataConnectMutationResult<UpdateCompanyData, UpdateCompanyVariables>;
export function useUpdateCompany(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateCompanyData, FirebaseError, UpdateCompanyVariables>): UseDataConnectMutationResult<UpdateCompanyData, UpdateCompanyVariables>;

export function useDeleteCompany(options?: useDataConnectMutationOptions<DeleteCompanyData, FirebaseError, DeleteCompanyVariables>): UseDataConnectMutationResult<DeleteCompanyData, DeleteCompanyVariables>;
export function useDeleteCompany(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteCompanyData, FirebaseError, DeleteCompanyVariables>): UseDataConnectMutationResult<DeleteCompanyData, DeleteCompanyVariables>;

export function useGetCompany(vars: GetCompanyVariables, options?: useDataConnectQueryOptions<GetCompanyData>): UseDataConnectQueryResult<GetCompanyData, GetCompanyVariables>;
export function useGetCompany(dc: DataConnect, vars: GetCompanyVariables, options?: useDataConnectQueryOptions<GetCompanyData>): UseDataConnectQueryResult<GetCompanyData, GetCompanyVariables>;

export function useListCompanies(options?: useDataConnectQueryOptions<ListCompaniesData>): UseDataConnectQueryResult<ListCompaniesData, undefined>;
export function useListCompanies(dc: DataConnect, options?: useDataConnectQueryOptions<ListCompaniesData>): UseDataConnectQueryResult<ListCompaniesData, undefined>;

export function useCreateJobPosting(options?: useDataConnectMutationOptions<CreateJobPostingData, FirebaseError, CreateJobPostingVariables>): UseDataConnectMutationResult<CreateJobPostingData, CreateJobPostingVariables>;
export function useCreateJobPosting(dc: DataConnect, options?: useDataConnectMutationOptions<CreateJobPostingData, FirebaseError, CreateJobPostingVariables>): UseDataConnectMutationResult<CreateJobPostingData, CreateJobPostingVariables>;

export function useUpdateJobPosting(options?: useDataConnectMutationOptions<UpdateJobPostingData, FirebaseError, UpdateJobPostingVariables>): UseDataConnectMutationResult<UpdateJobPostingData, UpdateJobPostingVariables>;
export function useUpdateJobPosting(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateJobPostingData, FirebaseError, UpdateJobPostingVariables>): UseDataConnectMutationResult<UpdateJobPostingData, UpdateJobPostingVariables>;

export function useDeleteJobPosting(options?: useDataConnectMutationOptions<DeleteJobPostingData, FirebaseError, DeleteJobPostingVariables>): UseDataConnectMutationResult<DeleteJobPostingData, DeleteJobPostingVariables>;
export function useDeleteJobPosting(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteJobPostingData, FirebaseError, DeleteJobPostingVariables>): UseDataConnectMutationResult<DeleteJobPostingData, DeleteJobPostingVariables>;

export function useGetJobPosting(vars: GetJobPostingVariables, options?: useDataConnectQueryOptions<GetJobPostingData>): UseDataConnectQueryResult<GetJobPostingData, GetJobPostingVariables>;
export function useGetJobPosting(dc: DataConnect, vars: GetJobPostingVariables, options?: useDataConnectQueryOptions<GetJobPostingData>): UseDataConnectQueryResult<GetJobPostingData, GetJobPostingVariables>;

export function useListJobPostings(options?: useDataConnectQueryOptions<ListJobPostingsData>): UseDataConnectQueryResult<ListJobPostingsData, undefined>;
export function useListJobPostings(dc: DataConnect, options?: useDataConnectQueryOptions<ListJobPostingsData>): UseDataConnectQueryResult<ListJobPostingsData, undefined>;

export function useCreateContact(options?: useDataConnectMutationOptions<CreateContactData, FirebaseError, CreateContactVariables>): UseDataConnectMutationResult<CreateContactData, CreateContactVariables>;
export function useCreateContact(dc: DataConnect, options?: useDataConnectMutationOptions<CreateContactData, FirebaseError, CreateContactVariables>): UseDataConnectMutationResult<CreateContactData, CreateContactVariables>;

export function useUpdateContact(options?: useDataConnectMutationOptions<UpdateContactData, FirebaseError, UpdateContactVariables>): UseDataConnectMutationResult<UpdateContactData, UpdateContactVariables>;
export function useUpdateContact(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateContactData, FirebaseError, UpdateContactVariables>): UseDataConnectMutationResult<UpdateContactData, UpdateContactVariables>;

export function useDeleteContact(options?: useDataConnectMutationOptions<DeleteContactData, FirebaseError, DeleteContactVariables>): UseDataConnectMutationResult<DeleteContactData, DeleteContactVariables>;
export function useDeleteContact(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteContactData, FirebaseError, DeleteContactVariables>): UseDataConnectMutationResult<DeleteContactData, DeleteContactVariables>;

export function useGetContact(vars: GetContactVariables, options?: useDataConnectQueryOptions<GetContactData>): UseDataConnectQueryResult<GetContactData, GetContactVariables>;
export function useGetContact(dc: DataConnect, vars: GetContactVariables, options?: useDataConnectQueryOptions<GetContactData>): UseDataConnectQueryResult<GetContactData, GetContactVariables>;

export function useListContacts(options?: useDataConnectQueryOptions<ListContactsData>): UseDataConnectQueryResult<ListContactsData, undefined>;
export function useListContacts(dc: DataConnect, options?: useDataConnectQueryOptions<ListContactsData>): UseDataConnectQueryResult<ListContactsData, undefined>;

export function useCreateApplicationNote(options?: useDataConnectMutationOptions<CreateApplicationNoteData, FirebaseError, CreateApplicationNoteVariables>): UseDataConnectMutationResult<CreateApplicationNoteData, CreateApplicationNoteVariables>;
export function useCreateApplicationNote(dc: DataConnect, options?: useDataConnectMutationOptions<CreateApplicationNoteData, FirebaseError, CreateApplicationNoteVariables>): UseDataConnectMutationResult<CreateApplicationNoteData, CreateApplicationNoteVariables>;

export function useUpdateApplicationNote(options?: useDataConnectMutationOptions<UpdateApplicationNoteData, FirebaseError, UpdateApplicationNoteVariables>): UseDataConnectMutationResult<UpdateApplicationNoteData, UpdateApplicationNoteVariables>;
export function useUpdateApplicationNote(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateApplicationNoteData, FirebaseError, UpdateApplicationNoteVariables>): UseDataConnectMutationResult<UpdateApplicationNoteData, UpdateApplicationNoteVariables>;

export function useDeleteApplicationNote(options?: useDataConnectMutationOptions<DeleteApplicationNoteData, FirebaseError, DeleteApplicationNoteVariables>): UseDataConnectMutationResult<DeleteApplicationNoteData, DeleteApplicationNoteVariables>;
export function useDeleteApplicationNote(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteApplicationNoteData, FirebaseError, DeleteApplicationNoteVariables>): UseDataConnectMutationResult<DeleteApplicationNoteData, DeleteApplicationNoteVariables>;

export function useGetApplicationNote(vars: GetApplicationNoteVariables, options?: useDataConnectQueryOptions<GetApplicationNoteData>): UseDataConnectQueryResult<GetApplicationNoteData, GetApplicationNoteVariables>;
export function useGetApplicationNote(dc: DataConnect, vars: GetApplicationNoteVariables, options?: useDataConnectQueryOptions<GetApplicationNoteData>): UseDataConnectQueryResult<GetApplicationNoteData, GetApplicationNoteVariables>;

export function useListApplicationNotes(options?: useDataConnectQueryOptions<ListApplicationNotesData>): UseDataConnectQueryResult<ListApplicationNotesData, undefined>;
export function useListApplicationNotes(dc: DataConnect, options?: useDataConnectQueryOptions<ListApplicationNotesData>): UseDataConnectQueryResult<ListApplicationNotesData, undefined>;
