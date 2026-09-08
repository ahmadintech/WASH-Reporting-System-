import CountryMap from "./CountryMap";

export default function DemographicCard() {
  const demographics = [
    { label: "IDPs in camps", percentage: 48, count: "24,840", color: "bg-brand-500" },
    { label: "Host community", percentage: 32, count: "16,560", color: "bg-clay-500" },
    { label: "Returnees", percentage: 15, count: "7,760", color: "bg-emerald-500" },
    { label: "Refugees", percentage: 5, count: "2,590", color: "bg-purple-500" },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-1">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              Target Groups & Vector Coverage
            </h3>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Displaced vs host community assistance distribution
            </p>
          </div>
        </div>

        {/* Vector Map */}
        <div className="px-3 py-4 my-4 overflow-hidden border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-900/50">
          <div className="h-[190px] w-full flex items-center justify-center">
            <CountryMap />
          </div>
        </div>
      </div>

      {/* Progress Bars for Population Groups */}
      <div className="space-y-3 pt-1">
        {demographics.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
              <span className="font-mono text-gray-900 dark:text-white">
                {item.count} ({item.percentage}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-500`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
