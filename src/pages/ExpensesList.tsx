import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ExpensesListComponent from "../components/expenses/ExpensesListComponent";

export default function ExpensesList() {

  return (
    <div>
      <PageMeta title="Расходы | CRM" description="Расходы CRM" />
      <PageBreadcrumb pageTitle="Расходы" />
      <ExpensesListComponent />
    </div>
  );
}
