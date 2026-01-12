import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ServiceListComponent from "../components/services/ServiceListComponent";

export default function ServiceList() {

  return (
    <div>
      <PageMeta title="Услуги | CRM" description="Услуги CRM" />
      <PageBreadcrumb pageTitle="Услуги" />
      <ServiceListComponent />
    </div>
  );
}
