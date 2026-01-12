import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AddContractor from "../../components/contractors/AddContractor";

export default function CarList() {

  return (
    <div>
      <PageMeta title="Подрядчики | CRM" description="Подрядчики CRM" />
      <PageBreadcrumb pageTitle="Подрядчики" />
      <AddContractor />
    </div>
  );
}