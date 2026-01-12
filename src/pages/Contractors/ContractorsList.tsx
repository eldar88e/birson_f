import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ContractorListComponent from "../../components/contractors/ContractorListComponent";

export default function CarList() {

  return (
    <div>
      <PageMeta title="Подрядчики | CRM" description="Подрядчики CRM" />
      <PageBreadcrumb pageTitle="Подрядчики" />
      <ContractorListComponent />
    </div>
  );
}
