import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Employee, Department, CreateEmployeeDto, UpdateEmployeeDto } from "../domain/employee.types";

export const employeesApi = createApi({
  reducerPath: "employeesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001" }),
  tagTypes: ["Employee"],
  endpoints: (builder) => ({
    getEmployees: builder.query<Employee[], void>({
      query: () => "/employees",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Employee" as const, id })),
              { type: "Employee" as const, id: "LIST" },
            ]
          : [{ type: "Employee" as const, id: "LIST" }],
    }),
    getEmployeeById: builder.query<Employee, number>({
      query: (id) => `/employees/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Employee" as const, id }],
    }),
    getDepartments: builder.query<Department[], void>({
      query: () => "/departments",
    }),
    createEmployee: builder.mutation<Employee, CreateEmployeeDto>({
      query: (body) => ({ url: "/employees", method: "POST", body }),
      invalidatesTags: [{ type: "Employee" as const, id: "LIST" }],
    }),
    updateEmployee: builder.mutation<Employee, UpdateEmployeeDto>({
      query: ({ id, ...body }) => ({ url: `/employees/${id}`, method: "PUT", body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Employee" as const, id },
        { type: "Employee" as const, id: "LIST" },
      ],
    }),
    deleteEmployee: builder.mutation<void, number>({
      query: (id) => ({ url: `/employees/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Employee" as const, id: "LIST" }],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useGetDepartmentsQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeesApi;
