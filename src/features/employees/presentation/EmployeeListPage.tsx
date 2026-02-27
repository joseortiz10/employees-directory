import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useGetEmployeesQuery, useDeleteEmployeeMutation } from "../data/employeesApi";
import type { Employee } from "../domain/employee.types";
import { StatusBadge } from "../../../shared/components/StatusBadge";

interface EmployeeListPageProps {
  onViewDetail: (id: number) => void;
  onCreateNew: () => void;
}

export function EmployeeListPage({ onViewDetail, onCreateNew }: EmployeeListPageProps) {
  const { data: employees = [], isLoading, isError } = useGetEmployeesQuery();
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();

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
      },
      {
        accessorKey: "position",
        header: "Position",
      },
      {
        accessorKey: "department",
        header: "Department",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => <StatusBadge status={getValue<Employee["status"]>()} />,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => onViewDetail(row.original.id)}
            >
              View
            </button>
            <button
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              disabled={isDeleting}
              onClick={() => deleteEmployee(row.original.id)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [onViewDetail, deleteEmployee, isDeleting]
  );

  const table = useReactTable({
    data: employees,
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
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={onCreateNew}
        >
          + Add Employee
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow rounded">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b bg-gray-50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm text-gray-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
