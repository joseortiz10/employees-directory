import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateEmployeeMutation, useGetDepartmentsQuery } from "../../data/employeesApi";

const schema = z.object({
  firstName:  z.string().min(2, "First name must be at least 2 characters"),
  lastName:   z.string().min(2, "Last name must be at least 2 characters"),
  email:      z.string().email("Must be a valid email"),
  position:   z.string().min(1, "Position is required"),
  department: z.string().min(1, "Department is required"),
  startDate:  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  status:     z.enum(["active", "inactive"]),
});

type FormValues = z.infer<typeof schema>;

interface EmployeeCreateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function EmployeeCreateForm({ onSuccess, onCancel }: EmployeeCreateFormProps) {
  const { data: departments = [] } = useGetDepartmentsQuery();
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: "active" },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createEmployee(data).unwrap();
      onSuccess();
    } catch {
      // error surfaces via isError if needed
    }
  };

  return (
    <div className="p-8 max-w-xl">
      <h2 className="text-xl font-semibold mb-6">Add Employee</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="First Name" error={errors.firstName?.message}>
          <input className={inputClass} {...register("firstName")} />
        </Field>

        <Field label="Last Name" error={errors.lastName?.message}>
          <input className={inputClass} {...register("lastName")} />
        </Field>

        <Field label="Email" error={errors.email?.message}>
          <input className={inputClass} type="email" {...register("email")} />
        </Field>

        <Field label="Position" error={errors.position?.message}>
          <input className={inputClass} {...register("position")} />
        </Field>

        <Field label="Department" error={errors.department?.message}>
          <select className={inputClass} {...register("department")}>
            <option value="">Select department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Start Date" error={errors.startDate?.message}>
          <input className={inputClass} type="date" {...register("startDate")} />
        </Field>

        <Field label="Status" error={errors.status?.message}>
          <select className={inputClass} {...register("status")}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </Field>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const inputClass =
  "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
