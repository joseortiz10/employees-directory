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

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {status}
    </span>
  );
}
