import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link } from "react-router";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);
  // State for fetched notifications
  const [notifications, setNotifications] = useState<any[]>([]);
  // Fetch notifications on mount
  useEffect(() => {
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch(() => setNotifications([]));
  }, []);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);
  };
  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${
            !notifying ? "hidden" : "flex"
          }`}
        >
          <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
        </span>
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notification
          </h5>
          <button
            onClick={handleClick}
            className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <svg
              className="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {/* WASH Humanitarian Sector Notifications */}
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-xl border-b border-gray-100 p-3 px-4 py-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5 transition-colors"
            >
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs dark:bg-emerald-950/60 dark:text-emerald-300">
                AL
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-gray-900"></span>
              </div>
              <div className="block flex-1 min-w-0">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {/* Dynamic notification fetched from API */}
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div key={n.id} className="text-xs text-gray-600 dark:text-gray-300">
                        <span className="font-bold text-gray-900 dark:text-white">{n.sender}</span> {n.message}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-600 dark:text-gray-300">No new notifications.</div>
                  )}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-400">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">5W Approval</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                  <span>5 min ago</span>
                </div>
              </div>
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-xl border-b border-gray-100 p-3 px-4 py-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5 transition-colors"
            >
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold text-xs dark:bg-amber-950/60 dark:text-amber-300">
                FB
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-amber-500 dark:border-gray-900"></span>
              </div>
              <div className="block flex-1 min-w-0">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  <span className="font-bold text-gray-900 dark:text-white">WASH State Coordinator</span> flagged an AWD/Cholera priority watch alert in{" "}
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Bolori II Ward</span>.
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-400">
                  <span className="font-semibold text-amber-600 dark:text-amber-400">Cluster Alert</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                  <span>12 min ago</span>
                </div>
              </div>
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-xl border-b border-gray-100 p-3 px-4 py-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5 transition-colors"
            >
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold text-xs dark:bg-brand-950/60 dark:text-brand-300">
                SI
                {/* Cluster Coordination Meeting Notification */}
                <DropdownItem
                  onItemClick={closeDropdown}
                  className="flex gap-3 rounded-xl border-b border-gray-100 p-3 px-4 py-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs dark:bg-indigo-950/60 dark:text-indigo-300">
                    CM
                  </div>
                  <div className="block flex-1 min-w-0">
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      <span className="font-bold text-gray-900 dark:text-white">Cluster Coordination Meeting</span> – Thursday 10:00 AM
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Borno State Monthly WASH Working Group at UN OCHA Conference Room Maiduguri. Agenda: Flash flood mitigation and Bama gap coverage.
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-400">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">Meeting</span>
                      <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                      <span>10 min ago</span>
                    </div>
                  </div>
                </DropdownItem>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand-500 dark:border-gray-900"></span>
              </div>
              <div className="block flex-1 min-w-0">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  <span className="font-bold text-gray-900 dark:text-white">Solidarités International</span> submitted monthly borehole rehabilitation 5W dataset for August 2026.
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-400">
                  <span className="font-semibold text-brand-600 dark:text-brand-400">Field Submission</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                  <span>25 min ago</span>
                </div>
              </div>
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-xl border-b border-gray-100 p-3 px-4 py-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5 transition-colors"
            >
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700 font-bold text-xs dark:bg-sky-950/60 dark:text-sky-300">
                UN
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-sky-500 dark:border-gray-900"></span>
              </div>
              <div className="block flex-1 min-w-0">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  <span className="font-bold text-gray-900 dark:text-white">UNICEF WASH Cluster</span> updated emergency water trucking contingency stocks for Borno State.
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-400">
                  <span className="font-semibold text-sky-600 dark:text-sky-400">Supply Chain</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                  <span>1 hr ago</span>
                </div>
              </div>
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-xl border-b border-gray-100 p-3 px-4 py-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5 transition-colors"
            >
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 font-bold text-xs dark:bg-purple-950/60 dark:text-purple-300">
                MS
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-purple-500 dark:border-gray-900"></span>
              </div>
              <div className="block flex-1 min-w-0">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  <span className="font-bold text-gray-900 dark:text-white">MSF Spain</span> registered 3 new solar motorized boreholes in Gwoza IDP Settlement.
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-400">
                  <span className="font-semibold text-purple-600 dark:text-purple-400">Field Activity</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                  <span>2 hr ago</span>
                </div>
              </div>
            </DropdownItem>
          </li>
        </ul>
        <Link
          to="/"
          className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          View All Notifications
        </Link>
      </Dropdown>
    </div>
  );
}
