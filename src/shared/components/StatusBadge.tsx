import type { EmployeeStatus } from "../../features/employees/domain/employee.types";

interface StatusBadgeProps {
  status: EmployeeStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const classes =
    status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";

  const dotClass =
    status === "active" ? "bg-green-500" : "bg-red-500";

  const label = status === "active" ? "Active" : "Inactive";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${classes}`}>
      <span aria-hidden="true" className={`w-2 h-2 rounded-full ${dotClass}`} />
      {label}
    </span>
  );
}
