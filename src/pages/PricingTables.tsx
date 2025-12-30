import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import PriceTableOne from "../components/price-table/PriceTableOne";
import PriceTableThree from "../components/price-table/PriceTableThree";
import PriceTableTwo from "../components/price-table/PriceTableTwo";
import PageMeta from "../components/common/PageMeta";

export default function PricingTables() {
  return (
    <div>
      <PageMeta
        title="React.js Pricing Tables Page | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Pricing Tables page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Pricing Tables" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Pricing Table 1">
          <PriceTableOne />
        </ComponentCard>
        <ComponentCard title="Pricing Table 2">
          <PriceTableTwo />
        </ComponentCard>
        <ComponentCard title="Pricing Table 3">
          <PriceTableThree />
        </ComponentCard>
      </div>
    </div>
  );
}
