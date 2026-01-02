import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AppointmentMain from "../../components/appointments/AppointmentMain";

export default function ProductList() {
  return (
    <>
      <PageMeta
        title="Запись | CRM"
        description="Запись CRM"
      />
      <PageBreadcrumb pageTitle="Запись" />
      <AppointmentMain />
    </>
  );
}
