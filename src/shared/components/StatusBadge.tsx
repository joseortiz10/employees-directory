import type { EmployeeStatus } from "../../features/employees/domain/employee.types";

interface StatusBadgeProps {
  status: EmployeeStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const classes =
    status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";

  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      {status}
    </span>
  );
}
