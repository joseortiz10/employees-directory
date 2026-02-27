import { z } from "zod";

export type EmployeeStatus = "active" | "inactive";

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  startDate: string; // "YYYY-MM-DD"
  status: EmployeeStatus;
}

export interface Department {
  id: number;
  name: string;
}

export const createEmployeeSchema = z.object({
  firstName:  z.string().min(1, "First name is required"),
  lastName:   z.string().min(1, "Last name is required"),
  email:      z.string().email("Must be a valid email"),
  position:   z.string().min(1, "Position is required"),
  department: z.string().min(1, "Department is required"),
  startDate:  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  status:     z.enum(["active", "inactive"]),
});

export type CreateEmployeeDto = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeDto = CreateEmployeeDto & { id: number };
