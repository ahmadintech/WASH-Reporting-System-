import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function MonthlyTarget() {
  const series = [74.8];
  const options: ApexOptions = {
    colors: ["#12707E"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "78%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "34px",
            fontWeight: "700",
            offsetY: -35,
            color: "#0B3C46",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#12707E"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["HNRP Target"],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-xs flex flex-col justify-between h-full">
      <div className="px-5 pt-5 sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              HNRP Response Target
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              2026 Sector humanitarian objective completion
            </p>
          </div>
        </div>

        <div className="relative mt-3">
          <div className="max-h-[300px]" id="chartDarkStyle">
            <Chart
              options={options}
              series={series}
              type="radialBar"
              height={300}
            />
          </div>

          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            On Track (+14.2%)
          </span>
        </div>

        <p className="mx-auto mt-8 w-full max-w-[340px] text-center text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          <strong>261,800</strong> of <strong>350,000</strong> targeted individuals reached across Borno, Adamawa, and Yobe states.
        </p>
      </div>

      <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800 border-t border-gray-100 dark:border-gray-800 py-3.5 mt-4 text-center">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase">Target</p>
          <p className="text-sm sm:text-base font-bold text-gray-800 dark:text-white font-mono mt-0.5">350k</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase">Reached</p>
          <p className="text-sm sm:text-base font-bold text-brand-600 dark:text-brand-400 font-mono mt-0.5">262k</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase">Gap</p>
          <p className="text-sm sm:text-base font-bold text-clay-600 dark:text-clay-400 font-mono mt-0.5">88k</p>
        </div>
      </div>
    </div>
  );
}
