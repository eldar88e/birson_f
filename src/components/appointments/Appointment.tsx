import AppointmentListTable from "./AppointmentsList";
import AppointmentMetrics from "./AppointmentMetrics";

export default function Appointment() {
  return (
    <div className="h-full">
      <AppointmentMetrics />
      <AppointmentListTable />
    </div>
  );
}
