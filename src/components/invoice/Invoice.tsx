import InvoiceListTable from "./InvoiceList";
import InvoiceMetrics from "./InvoiceMetrics";

export default function Invoice() {
  return (
    <div className="h-full">
      <InvoiceMetrics />
      <InvoiceListTable />
    </div>
  );
}
