import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ExpenseCategoriesList from "../components/expense-categories/ExpenseCategoriesList";

export default function ExpenseCategories() {

    return (
        <div>
            <PageMeta title="Категории расходов | CRM" description="Категории расходов CRM" />
            <PageBreadcrumb pageTitle="Категории расходов" />
            <ExpenseCategoriesList />
        </div>
    );
}
