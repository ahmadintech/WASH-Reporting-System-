import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";

export default function StatisticsChart() {
  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    colors: ["#12707E", "#C1722F"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: [2.5, 2.5],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.45,
        opacityTo: 0.05,
      },
    },
    markers: {
      size: 3,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => `${val.toLocaleString()} people`,
      },
    },
    xaxis: {
      type: "category",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
        formatter: (val) => `${(val / 1000).toFixed(0)}k`,
      },
    },
  };

  const series = [
    {
      name: "Total Reached (2026)",
      data: [18400, 24600, 31200, 38500, 42100, 47800, 51750, 56200, 61400, 68900, 74200, 81000],
    },
    {
      name: "HNRP Benchmark Target",
      data: [15000, 22000, 29000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000],
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 shadow-xs">
      <div className="flex flex-col gap-4 mb-5 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            WASH 5W Monthly Response Trend
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Cumulative individuals assisted vs HNRP response benchmark
          </p>
        </div>
        <div className="flex items-start sm:justify-end">
          <ChartTab />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[700px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
