import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PositionListComponent from "../components/positions/PositionListComponent";

export default function CarList() {

  return (
    <div>
      <PageMeta title="Должности | CRM" description="Должности CRM" />
      <PageBreadcrumb pageTitle="Должности" />
      <PositionListComponent />
    </div>
  );
}
