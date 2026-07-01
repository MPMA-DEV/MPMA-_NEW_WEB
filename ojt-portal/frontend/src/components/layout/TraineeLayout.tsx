import { useEffect, useState } from "react";
import { Outlet, NavLink, useLocation, useNavigation, useLoaderData } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Header from "./Header";
import {
  User,
  Calendar,
  CreditCard,
  MessageSquare,
  Bell,
  ClipboardList,
  Settings,
  LogOut,
  CalendarDays,
  X,
} from "lucide-react";
import { getTraineeProfilePhoto } from "../../loaders/traineeLoaders";

const navigation = [
  { name: "Details", href: "/trainee/details", icon: User },
  { name: "Schedule", href: "/trainee/schedule", icon: CalendarDays },
  { name: "Attendance", href: "/trainee/attendance", icon: ClipboardList },
  { name: "Payments", href: "/trainee/payments", icon: CreditCard },
  { name: "Calendar", href: "/trainee/calendar", icon: Calendar },
  { name: "Notifications", href: "/trainee/notifications", icon: Bell },
  { name: "Chat", href: "/trainee/chat", icon: MessageSquare },
  { name: "Profile", href: "/trainee/profile", icon: Settings },
];

// Type for loader data
interface LayoutLoaderData {
  hasPayments: boolean;
  profilePhoto: string | null;
  canViewBankDetails: boolean;
}

// createLoader wraps the return value in { data: ... }
interface LoaderResponse {
  data: LayoutLoaderData;
}

export default function TraineeLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const nav = useNavigation();

  // Get data from loader (fetched during route loading)
  const loaderResponse = useLoaderData() as LoaderResponse | null;
  const loaderData = loaderResponse?.data;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profilePhotoVersion, setProfilePhotoVersion] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(loaderData?.profilePhoto ?? null);

  // Data from loader - ready immediately when component mounts
  const hasPayments = loaderData?.hasPayments ?? false;
  const canViewBankDetails = loaderData?.canViewBankDetails ?? false;

  // Check if global navigation loading is active
  const isLoading = nav.state === "loading";

  // Effect for sidebar on mobile (UI)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Effect only for refreshing profile photo (when user uploads a new one)
  useEffect(() => {
    if (profilePhotoVersion === 0) return; // Skip initial load, loader already has it

    let active = true;
    const fetchPhoto = async () => {
      if (user?.id) {
        try {
          const result = await getTraineeProfilePhoto(user.id, true);
          if (active && result?.profilePhoto) {
            setProfilePhoto(result.profilePhoto);
          }
        } catch (e) {
          // ignore
        }
      }
    };
    fetchPhoto();
    return () => { active = false; };
  }, [user?.id, profilePhotoVersion]);

  const refreshProfilePhoto = (localBlobUrl?: string) => {
    // If a local blob URL is provided, use it immediately for instant display
    if (localBlobUrl) {
      setProfilePhoto(localBlobUrl);
    }
    setProfilePhotoVersion(prev => prev + 1);
  };

  const handleSidebarClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const getPageTitle = () => {
    const currentPath = location.pathname;
    const currentNav = navigation.find((item) => item.href === currentPath);
    return currentNav?.name || "Dashboard";
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
          <SidebarContent onItemClick={handleSidebarClick} hasPayments={hasPayments} logout={logout} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden bg-[#f8fafc]">
        <Header
          user={user}
          profilePhoto={profilePhoto}
          pageTitle={getPageTitle()}
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
          canViewBankDetails={canViewBankDetails}
        />

        <main className="flex-1 relative overflow-y-auto focus:outline-none scroll-smooth">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 animate-fade-in">
              <Outlet context={{ profilePhoto, refreshProfilePhoto, canViewBankDetails }} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ onItemClick, hasPayments, logout }: { onItemClick: () => void, hasPayments: boolean | null, logout: () => void }) {
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
        {(hasPayments === false
          ? navigation.filter((i) => i.name !== "Payments")
          : navigation
        ).map((item) => {
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