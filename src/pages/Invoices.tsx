import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Invoice from "../components/invoice/Invoice";
import PageMeta from "../components/common/PageMeta";

export default function Invoices() {
  return (
    <div>
      <PageMeta
        title="React.js Invoices Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Invoices Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Invoices" />
      <Invoice />
    </div>
  );
}
