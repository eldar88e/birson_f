import SupportMetrics from "../../components/support/SupportMetrics";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import SupportTicketsList from "../../components/support/SupportList";

export default function TicketList() {
  return (
    <div>
      <PageMeta
        title="Пользователи | CRM"
        description="Пользователи CRM"
      />
      <PageBreadcrumb pageTitle="Пользователи" />
      <SupportMetrics />
      <SupportTicketsList />
    </div>
  );
}
