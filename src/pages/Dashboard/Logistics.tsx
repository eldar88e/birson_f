import PageMeta from "../../components/common/PageMeta";
import DeliveryActivitiesTable from "../../components/logistics/DeliveriesActivityTable";
import DeliveryMan from "../../components/logistics/DeliveryMan";
import DeliveryStatisticsChart from "../../components/logistics/DeliveryStatisticsChart";
import DeliveryVehicle from "../../components/logistics/DeliveryVehicle";
import LogisticsMetrics from "../../components/logistics/LogisticsMetrics";
import RevenueEarnedChart from "../../components/logistics/RevenueEarnedChart";
import TrackingDeliveryMap from "../../components/logistics/TrackingDeliveryMap";
import TrackingProgress from "../../components/logistics/TrackingProgress";

export default function Logistics() {
  return (
    <>
      <PageMeta
        title="React.js Logistics Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Logistics Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="space-y-6">
        <LogisticsMetrics />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <DeliveryStatisticsChart />
            <div className="grid gap-6 sm:grid-cols-2">
              <RevenueEarnedChart />
              <DeliveryVehicle />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="space-y-2 rounded-xl border bg-gray-100 p-2 dark:border-gray-800 dark:bg-white/3">
              <TrackingDeliveryMap />
              <TrackingProgress />
              <DeliveryMan />
            </div>
          </div>
        </div>
        <DeliveryActivitiesTable />
      </div>
    </>
  );
}
