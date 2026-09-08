import PageMeta from "../../components/common/PageMeta";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";

export default function Home() {
  return (
    <>
      <PageMeta
        title="WASH Sector North East Nigeria — 5W Response Analytics"
        description="Operations command center and response analytics for Borno, Adamawa, and Yobe"
      />

      <div className="space-y-6">
        {/* Top Row: 4 Metric Cards (Beneficiaries, Reports, Partners, LGAs) */}
        <div>
          <EcommerceMetrics />
        </div>

        {/* Second Row: Monthly Trends Area Chart (7 cols) + HNRP Target Completion Radial Gauge (5 cols) */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 xl:col-span-7">
            <StatisticsChart />
          </div>

          <div className="col-span-12 xl:col-span-5">
            <MonthlyTarget />
          </div>
        </div>

        {/* Third Row: Target Population Groups & Vector Map (5 cols) + Activity Sector Distribution (7 cols) */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 xl:col-span-5">
            <DemographicCard />
          </div>

          <div className="col-span-12 xl:col-span-7">
            <MonthlySalesChart />
          </div>
        </div>

        {/* Fourth Row: Full Width Recent 5W Field Activity Reports */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12">
            <RecentOrders />
          </div>
        </div>
      </div>
    </>
  );
}
