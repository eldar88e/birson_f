import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
export default function FunnelChart() {
  const series = [
    {
      name: "Ad Impressions",
      data: [44, 55, 41, 67, 22, 43, 55, 41],
    },
    {
      name: "Website Session",
      data: [13, 23, 20, 8, 13, 27, 13, 23],
    },
    {
      name: "App Download",
      data: [11, 17, 15, 15, 21, 14, 18, 20],
    },
    {
      name: "New Users",
      data: [21, 7, 25, 13, 22, 8, 18, 20],
    },
  ];
  const options: ApexOptions = {
    colors: ["#2a31d8", "#465fff", "#7592ff", "#c2d6ff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      stacked: true,
      height: 315,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 10,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
      fontSize: "14px",
      fontWeight: 400,
      markers: {
        size: 5,
        shape: "circle",
        strokeWidth: 0,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
    },
    yaxis: {
      title: {
        text: undefined, // Hide the title by setting text to undefined
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => val.toString(), // Simplified formatter
      },
    },
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6 flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Conversion Funnel
          </h3>
        </div>
      </div>
      <div className="overflow-x-auto custom-scrollbar pl-2">
        <Chart
          className="-ml-5 min-w-[700px] xl:min-w-full"
          options={options}
          series={series}
          type="bar"
          height={315}
        />
      </div>
    </div>
  );
}
