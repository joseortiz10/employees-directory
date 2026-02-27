import { useState } from "react";
import { useGetEmployeeByIdQuery } from "../data/employeesApi";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { EmployeeEditForm } from "./components/EmployeeEditForm";

interface EmployeeDetailPageProps {
  employeeId: number;
  onBack: () => void;
}

export function EmployeeDetailPage({ employeeId, onBack }: EmployeeDetailPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { data: employee, isLoading, isError } = useGetEmployeeByIdQuery(employeeId);

  if (isLoading) return <p className="p-8">Loading...</p>;
  if (isError || !employee) return <p className="p-8 text-red-600">Employee not found.</p>;

  if (isEditing) {
    return (
      <div className="p-8 max-w-xl">
        <h2 className="text-xl font-semibold mb-6">
          Edit {employee.firstName} {employee.lastName}
        </h2>
        <EmployeeEditForm
          employee={employee}
          onSaved={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          onClick={onBack}
        >
          ← Back
        </button>
        <h2 className="text-xl font-semibold flex-1">
          {employee.firstName} {employee.lastName}
        </h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
      </div>

      <dl className="bg-white shadow rounded divide-y">
        {(
          [
            ["First Name", employee.firstName],
            ["Last Name", employee.lastName],
            ["Email", employee.email],
            ["Position", employee.position],
            ["Department", employee.department],
            ["Start Date", employee.startDate],
          ] as [string, string][]
        ).map(([label, value]) => (
          <div key={label} className="flex px-6 py-4">
            <dt className="w-40 text-sm font-medium text-gray-500">{label}</dt>
            <dd className="text-sm text-gray-800">{value}</dd>
          </div>
        ))}
        <div className="flex px-6 py-4">
          <dt className="w-40 text-sm font-medium text-gray-500">Status</dt>
          <dd>
            <StatusBadge status={employee.status} />
          </dd>
        </div>
      </dl>
    </div>
  );
}
