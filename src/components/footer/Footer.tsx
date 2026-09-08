const Footer = () => {
  return (
    <footer className="text-center py-5 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
        <span className="font-semibold text-gray-700 dark:text-gray-300">
          WASH Sector North East Nigeria
        </span>
        <span className="hidden sm:inline">·</span>
        <span className="font-mono text-brand-700 dark:text-brand-400 font-bold">
          Borno · Adamawa · Yobe
        </span>
        <span className="hidden sm:inline">·</span>
        <span>5W Activity Reporting Platform</span>
      </div>
    </footer>
  );
};

export default Footer;