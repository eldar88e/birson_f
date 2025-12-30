import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function ChurnRateChart() {
  const churnSeries = [
    {
      name: "Churn Rate",
      data: [4.5, 4.2, 4.6, 4.3, 4.1, 4.2, 4.26],
    },
  ];

  const churnOptions: ApexOptions = {
    chart: {
      type: "area",
      height: 60,
      sparkline: {
        enabled: true,
      },
      animations: {
        enabled: true,
        speed: 800,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ["#ef4444"],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        formatter: (value) => value.toFixed(2) + "%",
      },
      marker: {
        show: false,
      },
    },
  };
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6 flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Churn Rate
          </h3>
          <p className="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">
            Downgrade to Free plan
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          <h3 className="text-title-xs font-semibold text-gray-800 dark:text-white/90">
            4.26%
          </h3>
          <p className="text-theme-xs mt-1 text-gray-500 dark:text-gray-400">
            <span className="text-error-500 mr-1 inline-block">0.31%</span>
            than last Week
          </p>
        </div>
        <div className="max-w-full">
          <div id="chartTwentyOne">
            <Chart
              className="h-12 w-24"
              options={churnOptions}
              series={churnSeries}
              type="area"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
