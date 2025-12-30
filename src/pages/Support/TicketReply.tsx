import PageMeta from "../../components/common/PageMeta";
import TicketDetails from "../../components/support/TicketDetails";
import TicketReplyContent from "../../components/support/TicketReplyContent";

export default function TicketReply() {
  return (
    <>
      <PageMeta
        title="React.js  Ticket Reply Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js  Ticket Reply Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="overflow-hidden xl:h-[calc(100vh-180px)]">
        <div className="grid h-full grid-cols-1 gap-5 xl:grid-cols-12">
          <div className="xl:col-span-8 2xl:col-span-9">
            <TicketReplyContent />
          </div>
          <div className="xl:col-span-4 2xl:col-span-3">
            <TicketDetails />
          </div>
        </div>
      </div>
    </>
  );
}
