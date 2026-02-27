import { useState } from "react";
import { EmployeeListPage } from "./features/employees/presentation/EmployeeListPage";
import { EmployeeDetailPage } from "./features/employees/presentation/EmployeeDetailPage";
import { EmployeeCreateForm } from "./features/employees/presentation/EmployeeCreateForm";

type View =
  | { name: "list" }
  | { name: "detail"; employeeId: number }
  | { name: "create" };

function App() {
  const [view, setView] = useState<View>({ name: "list" });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-8 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
      </header>

      <main>
        {view.name === "list" && (
          <EmployeeListPage
            onViewDetail={(id) => setView({ name: "detail", employeeId: id })}
            onCreateNew={() => setView({ name: "create" })}
          />
        )}

        {view.name === "detail" && (
          <EmployeeDetailPage
            employeeId={view.employeeId}
            onBack={() => setView({ name: "list" })}
          />
        )}

        {view.name === "create" && (
          <EmployeeCreateForm
            onSuccess={() => setView({ name: "list" })}
            onCancel={() => setView({ name: "list" })}
          />
        )}
      </main>
    </div>
  );
}

export default App;
