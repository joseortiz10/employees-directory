import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useGetEmployeesQuery, useGetDepartmentsQuery, useDeleteEmployeeMutation } from "../data/employeesApi";
import type { Employee } from "../domain/employee.types";
import { StatusBadge } from "../../../shared/components/StatusBadge";

type ColumnMeta = { className?: string };

interface EmployeeListPageProps {
  onViewDetail: (id: number) => void;
  onCreateNew: () => void;
}

export function EmployeeListPage({ onViewDetail, onCreateNew }: EmployeeListPageProps) {
  const { data: employees = [], isLoading, isError } = useGetEmployeesQuery();
  const { data: departments = [] } = useGetDepartmentsQuery();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();

  const filtered =
    selectedDepartment === "All"
      ? employees
      : employees.filter((e) => e.department === selectedDepartment);

  const handleDelete = (id: number, fullName: string) => {
    if (window.confirm(`Are you sure you want to delete ${fullName}? This action cannot be undone.`)) {
      deleteEmployee(id);
    }
  };

  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        id: "fullName",
        header: "Full Name",
        cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
      },
      {
        accessorKey: "email",
        header: "Email",
        meta: { className: "hidden sm:table-cell" } satisfies ColumnMeta,
      },
      {
        accessorKey: "position",
        header: "Position",
        meta: { className: "hidden md:table-cell" } satisfies ColumnMeta,
      },
      {
        accessorKey: "department",
        header: "Department",
        meta: { className: "hidden md:table-cell" } satisfies ColumnMeta,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => <StatusBadge status={getValue<Employee["status"]>()} />,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const fullName = `${row.original.firstName} ${row.original.lastName}`;
          return (
            <div className="flex gap-2">
              <button
                aria-label={`View ${fullName}`}
                className="px-3 py-2.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={() => onViewDetail(row.original.id)}
              >
                View
              </button>
              <button
                aria-label={`Delete ${fullName}`}
                className="px-3 py-2.5 text-sm border border-red-600 text-red-600 rounded hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50"
                disabled={isDeleting}
                onClick={() => handleDelete(row.original.id, fullName)}
              >
                Delete
              </button>
            </div>
          );
        },
      },
    ],
    [onViewDetail, isDeleting]
  );

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <p className="p-8">Loading...</p>;
  if (isError) return <p className="p-8 text-red-600">Failed to load employees.</p>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Employees</h2>
        <button
          aria-label="Add Employee"
          className="px-4 py-2.5 bg-green-600 text-white rounded hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          onClick={onCreateNew}
        >
          + Add Employee
        </button>
      </div>

      <div className="mb-4">
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="All">All</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table aria-label="Employee list" className="w-full border-collapse bg-white shadow rounded">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b bg-gray-50">
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as ColumnMeta | undefined;
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${meta?.className ?? ""}`}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-100">
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as ColumnMeta | undefined;
                  return (
                    <td key={cell.id} className={`px-4 py-3 text-sm text-gray-800 ${meta?.className ?? ""}`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
