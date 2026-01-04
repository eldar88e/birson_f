import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import CarListComponent from "../../components/cars/CarList";

export default function CarList() {

  return (
    <div>
      <PageMeta title="Автомобили | CRM" description="Автомобили CRM" />
      <PageBreadcrumb pageTitle="Автомобили" />
      <CarListComponent />
    </div>
  );
}
