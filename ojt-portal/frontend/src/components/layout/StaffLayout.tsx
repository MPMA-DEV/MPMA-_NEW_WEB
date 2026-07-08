import { useEffect, useState, useRef } from "react";
import { Outlet, NavLink, useLocation, useNavigation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Users,
  LogOut,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  User as UserIcon,
} from "lucide-react";

const navigation = [
  { name: "Trainees", href: "/staff", icon: Users },
];

export default function StaffLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const nav = useNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Check if global navigation loading is active
  const isLoading = nav.state === "loading";

  // Effect for sidebar on mobile (UI)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSidebarClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const getPageTitle = () => {
    const currentPath = location.pathname;
    const currentNav = navigation.find((item) => item.href === currentPath);
    return currentNav?.name || "Staff Dashboard";
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50 relative">
      {/* Top Progress Bar */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-blue-100 overflow-hidden">
          <div className="h-full bg-blue-600 animate-progress-bar"></div>
        </div>
      )}

      {/* Mobile sidebar backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 z-40 md:hidden ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 flex flex-col bg-slate-900 z-50 
          transform transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
          md:relative shadow-xl md:shadow-none overflow-hidden
          ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64 md:translate-x-0 md:w-0"}
        `}
      >
        <div
          className={`
            flex flex-col h-full w-64 
            transition-opacity duration-300 
            ${sidebarOpen ? "opacity-100 delay-100" : "md:opacity-0 opacity-100"}
          `}
        >
          {/* Close button for mobile */}
          <div className="md:hidden absolute top-4 right-4 z-50">
            <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>
          <SidebarContent onItemClick={handleSidebarClick} logout={logout} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden bg-[#f8fafc]">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-200/80 shrink-0">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Left Section */}
            <div className="flex items-center">
              <button
                className="p-2 -ml-2 mr-3 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none transition-all duration-300 group"
                onClick={toggleSidebar}
                aria-label="Toggle Sidebar"
              >
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <PanelLeftClose
                    className={`absolute inset-0 h-6 w-6 transition-all duration-300 ease-in-out transform ${sidebarOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
                      }`}
                  />
                  <PanelLeftOpen
                    className={`absolute inset-0 h-6 w-6 transition-all duration-300 ease-in-out transform ${sidebarOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
                      }`}
                  />
                </div>
              </button>

              <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
                {getPageTitle()}
              </h1>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3 md:space-x-4">
              {/* User Profile */}
              <div className="flex items-center pl-4 border-l border-gray-200 h-8 relative" ref={profileRef}>
                <div
                  className={`flex items-center space-x-3 group cursor-pointer ${showProfileDropdown ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                >
                  <div className="hidden md:block text-right">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {user?.nickname || 'Staff User'}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Staff</div>
                  </div>
                  <div className={`h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 ring-2 ring-transparent transition-all ${showProfileDropdown ? 'ring-blue-100' : 'group-hover:ring-blue-100'}`}>
                    <UserIcon className="h-4 w-4" />
                  </div>
                </div>

                {/* Profile Dropdown */}
                {showProfileDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in origin-top-right">
                    <div className="p-2 space-y-1">
                      <button
                        onClick={logout}
                        className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                      >
                        <LogOut className="h-4 w-4 mr-3 text-red-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 relative overflow-y-auto focus:outline-none scroll-smooth">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ onItemClick, logout }: { onItemClick: () => void, logout: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo Area */}
      <div className="flex items-center px-6 h-20 border-b border-slate-800/60 bg-slate-900 shrink-0 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent pointer-events-none" />

        <div className="flex items-center gap-3.5 relative z-10">
          <div className="relative shrink-0">
            <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              src="https://upload.wikimedia.org/wikipedia/en/1/1a/Sri_Lanka_Ports_Authority_logo.png"
              alt="SLPA Logo"
              className="h-10 w-10 rounded-xl object-contain bg-white shadow-lg ring-1 ring-white/10 relative z-10"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-lg font-black text-white tracking-tight leading-none font-sans truncate">
              SLPA
            </span>
            <span className="text-sm font-bold text-blue-400 uppercase tracking-[0.2em] mt-1 truncate">
              OJT Portal
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Main Menu</p>
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onItemClick}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 mb-1 ${isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`h-5 w-5 mr-3 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                  <span className="truncate">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 shrink-0">
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-slate-400 rounded-lg hover:bg-red-900/30 hover:text-red-400 transition-all duration-200 group"
        >
          <LogOut className="h-5 w-5 mr-3 text-slate-500 group-hover:text-red-400" />
          <span className="truncate">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
