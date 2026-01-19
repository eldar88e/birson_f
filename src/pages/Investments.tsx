import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import InvestmentsListComponent from "../components/investments/InvestmentsListComponent";

export default function Investments() {
  return (
    <div>
      <PageMeta title="Инвестиции | CRM" description="Инвестиции CRM" />
      <PageBreadcrumb pageTitle="Инвестиции" />
      <InvestmentsListComponent />
    </div>
  );
}
