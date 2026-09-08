import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function MonthlySalesChart() {
  const options: ApexOptions = {
    colors: ["#12707E", "#C1722F", "#3F7D4E"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 230,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "48%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 3,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
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
    },
    yaxis: {
      title: {
        text: undefined,
      },
      labels: {
        formatter: (val) => `${val.toLocaleString()}`,
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
      y: {
        formatter: (val: number) => `${val.toLocaleString()} individuals`,
      },
    },
  };

  const series = [
    {
      name: "Water Supply",
      data: [12400, 15600, 18200, 21400, 19800, 24500, 26800, 28100],
    },
    {
      name: "Sanitation",
      data: [6200, 7800, 8900, 11200, 9600, 13400, 14200, 15800],
    },
    {
      name: "Hygiene Promotion",
      data: [8500, 11200, 13400, 16800, 15200, 18900, 21300, 22600],
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            Beneficiaries Reached by Sector
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Monthly distribution across Water, Sanitation, and Hygiene
          </p>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-3 min-w-[550px] xl:min-w-full">
          <Chart options={options} series={series} type="bar" height={240} />
        </div>
      </div>
    </div>
  );
}
