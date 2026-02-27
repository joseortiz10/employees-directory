import { useGetEmployeesQuery } from "../../data/employeesApi";
import { EmployeesTable } from "../components/EmployeesTable";

export function EmployeesPage() {
  const { data: employees = [], isLoading, isError } = useGetEmployeesQuery();

  if (isLoading) return <p className="p-8">Loading...</p>;
  if (isError) return <p className="p-8 text-red-600">Failed to load employees.</p>;

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-6">Employees</h2>
      <EmployeesTable employees={employees} />
    </div>
  );
}
