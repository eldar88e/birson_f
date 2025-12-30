import PageMeta from "../../components/common/PageMeta";
import ActivitiesCard from "../../components/saas/ActivitiesCard";
import ChurnRateChart from "../../components/saas/ChurnRateChart";
import FunnelChart from "../../components/saas/FunnelChart";
import GrowthChart from "../../components/saas/GrowthChart";
import ProductPerformanceTab from "../../components/saas/ProductPerformanceTab";
import SaasInvoiceTable from "../../components/saas/SaasInvoiceTable";
import SaasMetrics from "../../components/saas/SaasMetrics";

export default function Saas() {
  return (
    <>
      <PageMeta
        title="React.js SaaS Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js SaaS Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="space-y-5 sm:space-y-6">
        <SaasMetrics />

        <div className="gap-6 space-y-5 sm:space-y-6 xl:grid xl:grid-cols-12 xl:space-y-0">
          <div className="xl:col-span-7 2xl:col-span-8">
            <div className="sm:space-y-6 space-y-5">
              <div className="grid gap-5  sm:gap-6 lg:grid-cols-2">
                <ChurnRateChart />
                <GrowthChart />
              </div>

              {/* Funnel */}
              <FunnelChart />

              {/* Table */}
              <SaasInvoiceTable />
            </div>
          </div>
          <div className="space-y-5 sm:space-y-6 xl:col-span-5 2xl:col-span-4">
            {/* Product Performance */}
            <ProductPerformanceTab />

            {/* Activities */}
            <ActivitiesCard />
          </div>
        </div>
      </div>
    </>
  );
}
