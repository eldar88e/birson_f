import SupportMetrics from "../../components/support/SupportMetrics";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import SupportTicketsList from "../../components/support/SupportList";

export default function TicketList() {
  return (
    <div>
      <PageMeta
        title="React.js  Ticket List Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js  Ticket List Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Support Ticket" />
      <SupportMetrics />
      <SupportTicketsList />
    </div>
  );
}
