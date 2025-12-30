import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import BillingPlan from "../../components/ecommerce/billing/BillingPlan";
import BillingInfo from "../../components/ecommerce/billing/BillingInfo";
import PaymentMethod from "../../components/ecommerce/billing/PaymentMethod";
import InvoiceTable from "../../components/ecommerce/billing/InvoiceTable";

export default function Billing() {
  return (
    <>
      <PageMeta
        title="React.js E-commerce Products Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js E-commerce Products Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Billing" />
      <div className="mb-6 flex flex-col gap-6 xl:flex-row">
        <BillingPlan />
        <BillingInfo />
      </div>
      <PaymentMethod />
      <InvoiceTable />
    </>
  );
}
