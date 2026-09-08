import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

import {
  GridIcon,
  ListIcon,
  PieChartIcon,
  TableIcon,
  UserCircleIcon,
  GroupIcon,
  PlusIcon,
  ChevronDownIcon,
  HorizontaLDots,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";
import { RoleSwitcher } from "../components/common/RoleSwitcher";
import { WashLogo } from "../components/common/WashLogo";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Sector Overview",
    path: "/",
  },
  {
    icon: <PlusIcon />,
    name: "Submit 5W Report",
    path: "/submit-report",
  },
  {
    icon: <PieChartIcon />,
    name: "Coverage Dashboard",
    path: "/coverage-dashboard",
  },
  {
    icon: <TableIcon />,
    name: "5W Submissions",
    path: "/reports-list",
  },
  {
    icon: <GroupIcon />,
    name: "Partners Directory",
    path: "/partners",
  },
];

const othersItems: NavItem[] = [
  {
    icon: <UserCircleIcon />,
    name: "User Profile",
    path: "/profile",
  },
  {
    icon: <ListIcon />,
    name: "Forms & Guides",
    subItems: [
      { name: "Submit 5W", path: "/submit-report", new: true },
      { name: "Form Elements", path: "/form-elements", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { currentUser } = useAuth();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => {
      if (path === "/" && (location.pathname === "/" || location.pathname === "/TailAdmin/")) {
        return true;
      }
      return location.pathname === path || location.pathname.endsWith(path);
    },
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-2">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-4 h-4 transition-transform duration-200 ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                {nav.name === "Submit 5W Report" && (isExpanded || isHovered || isMobileOpen) && (
                  <span className="ml-auto text-[10px] uppercase font-bold bg-clay-500 text-white px-1.5 py-0.5 rounded">
                    5W
                  </span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-1 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      {subItem.new && (
                        <span className="ml-auto text-[10px] font-bold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">
                          new
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-4 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[270px]"
            : isHovered
            ? "w-[270px]"
            : "w-[86px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sidebar Brand Header with official WASH Logo */}
      <div
        className={`py-5 border-b border-gray-100 dark:border-gray-800 flex items-center ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start px-2"
        }`}
      >
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/images/logo/wash-logo.png"
            alt="WASH Sector Nigeria"
            className="h-10 w-auto object-contain rounded drop-shadow-xs"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "./images/logo/wash-logo.png";
            }}
          />
          {(isExpanded || isHovered || isMobileOpen) && (
            <div className="flex flex-col text-left">
              <span className="font-bold text-sm text-brand-700 dark:text-brand-200 tracking-tight leading-none">
                WASH 5W
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-clay-600 dark:text-clay-400 mt-1">
                NE Nigeria
              </span>
            </div>
          )}
        </Link>
      </div>

      <div className="flex flex-col flex-1 justify-between overflow-y-auto duration-300 ease-linear no-scrollbar py-4">
        <nav>
          <div className="flex flex-col gap-5">
            <div>
              <h2
                className={`mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 ${
                  !isExpanded && !isHovered ? "lg:text-center" : "px-3"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "WASH 5W Platform"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div>
              <h2
                className={`mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 ${
                  !isExpanded && !isHovered ? "lg:text-center" : "px-3"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Account & Sector"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>

        {/* Active Role Card at Sidebar Bottom */}
        {(isExpanded || isHovered || isMobileOpen) && (
          <div className="mt-6 rounded-xl border border-gray-200/80 bg-gray-50/80 dark:border-gray-700/80 dark:bg-gray-800/80 p-3.5 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400">
                Logged In Role
              </span>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  currentUser.role === "admin"
                    ? "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300"
                    : currentUser.role === "coordinator"
                    ? "bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300"
                    : "bg-clay-100 text-clay-700 dark:bg-clay-950/60 dark:text-clay-300"
                }`}
              >
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
              {currentUser.name}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
              {currentUser.organization}
            </p>
            <div className="mt-2 pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
              <RoleSwitcher compact />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AppSidebar;
