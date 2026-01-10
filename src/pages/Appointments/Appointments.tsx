import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import Appointment from "../../components/appointments/Appointment.tsx";
import PageMeta from "../../components/common/PageMeta.tsx";

export default function Appointments() {
  return (
    <div>
      <PageMeta
        title="Записи | CRM"
        description="Записи CRM"
      />
      <PageBreadcrumb pageTitle="Записи" />
      <Appointment />
    </div>
  );
}
