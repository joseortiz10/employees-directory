import { useState } from "react";
import { useGetEmployeesQuery, useGetDepartmentsQuery } from "../../data/employeesApi";
import { EmployeesTable } from "../components/EmployeesTable";

export function EmployeesPage() {
  const { data: employees = [], isLoading, isError } = useGetEmployeesQuery();
  const { data: departments = [] } = useGetDepartmentsQuery();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");

  if (isLoading) return <p className="p-8">Loading...</p>;
  if (isError) return <p className="p-8 text-red-600">Failed to load employees.</p>;

  const filtered =
    selectedDepartment === "All"
      ? employees
      : employees.filter((e) => e.department === selectedDepartment);

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-6">Employees</h2>
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
      <EmployeesTable employees={filtered} />
    </div>
  );
}
