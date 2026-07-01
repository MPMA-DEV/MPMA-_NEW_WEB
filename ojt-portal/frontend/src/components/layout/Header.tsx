
import { useState, useEffect, useRef } from "react";
import { Bell, Search, User, Check, CreditCard, MessageSquare, Calendar, PanelLeftClose, PanelLeftOpen, Shield, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
    user: {
        nickname?: string;
        NIC?: string;
        status?: string;
    } | null;
    profilePhoto?: string | null;
    pageTitle: string;
    onToggleSidebar: () => void;
    sidebarOpen: boolean;
    showSearch?: boolean;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    canViewBankDetails?: boolean;
}

import { useNotifications } from "../../contexts/NotificationContext";
import { useAuth } from "../../contexts/AuthContext";

export default function Header({
    user,
    profilePhoto,
    pageTitle,
    onToggleSidebar,
    sidebarOpen,
    showSearch = false,
    searchQuery = "",
    onSearchChange,
    canViewBankDetails = false,
    }: HeaderProps) {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'payment': return <CreditCard className="h-4 w-4 text-emerald-600" />;
            case 'message': return <MessageSquare className="h-4 w-4 text-blue-600" />;
            case 'schedule': return <Calendar className="h-4 w-4 text-purple-600" />;
            default: return <Bell className="h-4 w-4 text-gray-600" />;
        }
    };

    const getNotificationBg = (type: string) => {
        switch (type) {
            case 'payment': return 'bg-emerald-100';
            case 'message': return 'bg-blue-100';
            case 'schedule': return 'bg-purple-100';
            default: return 'bg-gray-100';
        }
    };

    return (
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-200/80">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Left Section */}
                <div className="flex items-center">
                    <button
                        className="p-2 -ml-2 mr-3 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none transition-all duration-300 group"
                        onClick={onToggleSidebar}
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

                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-semibold text-gray-900 tracking-tight animate-fade-in">
                            {pageTitle}
                        </h1>
                        {user && user.status && (
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors ${
                                user.status === "Pending" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                user.status === "Processing" ? "bg-amber-50 text-amber-700 border-amber-200 animate-pulse" :
                                user.status === "Rejected" || user.status === "Rejected / Action Required" ? "bg-red-50 text-red-700 border-red-200" :
                                "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}>
                                {user.status}
                            </span>
                        )}
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-3 md:space-x-4">
                    {showSearch && (
                        <div className="hidden md:block relative max-w-xs w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                className="block w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 sm:text-sm"
                                placeholder="Search..."
                                type="search"
                                value={searchQuery}
                                onChange={(e) => onSearchChange?.(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="flex items-center space-x-3">
                        {/* Notifications Dropdown */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                className={`relative p-2 rounded-full transition-all duration-200 focus:outline-none ${showNotifications ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="absolute right-[-4.2rem] sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in origin-top-right">
                                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                                        <button
                                            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                markAllAsRead();
                                            }}
                                        >
                                            <Check className="h-3 w-3 mr-1" /> Mark all read
                                        </button>
                                    </div>

                                    <div className="max-h-[28rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                                        {notifications.filter(n => !n.read).length > 0 ? (
                                            notifications.filter(n => !n.read).slice(0, 5).map(notification => (
                                                <div
                                                    key={notification.id}
                                                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group relative ${!notification.read ? 'bg-blue-50/30' : ''}`}
                                                    onClick={async () => {
                                                        setShowNotifications(false);
                                                        await markAsRead(notification.id);
                                                        if (user && user.status === "Active") {
                                                            navigate('/trainee/notifications');
                                                        }
                                                    }}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${getNotificationBg(notification.type)}`}>
                                                            {getNotificationIcon(notification.type)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start">
                                                                <h4 className={`text-sm font-medium truncate ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                                                    {notification.title}
                                                                </h4>
                                                                <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{new Date(notification.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{notification.message}</p>
                                                        </div>
                                                        {!notification.read && (
                                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center">
                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                                                    <Bell className="h-6 w-6" />
                                                </div>
                                                <p className="text-gray-500 text-sm">No new notifications</p>
                                            </div>
                                        )}
                                    </div>

                                    {user && user.status === "Active" && (
                                        <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                                            <button
                                                onClick={() => {
                                                    setShowNotifications(false);
                                                    navigate('/trainee/notifications');
                                                }}
                                                className="text-xs font-semibold text-gray-600 hover:text-blue-600 transition-colors w-full py-1"
                                            >
                                                View All Notifications
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* User Profile */}
                        <div className="flex items-center pl-4 border-l border-gray-200 h-8 relative" ref={profileRef}>
                            <div
                                className={`flex items-center space-x-3 group cursor-pointer ${showProfileDropdown ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                            >
                                <div className="hidden md:block text-right">
                                    <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {user?.nickname || 'User'}
                                    </div>
                                </div>
                                {profilePhoto ? (
                                    <img
                                        src={profilePhoto}
                                        alt="Profile"
                                        className={`h-8 w-8 rounded-full object-cover border border-gray-200 shadow-sm transition-all ${showProfileDropdown ? 'ring-2 ring-blue-100' : 'group-hover:ring-2 group-hover:ring-blue-100'}`}
                                    />
                                ) : (
                                    <div className={`h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 ring-2 ring-transparent transition-all ${showProfileDropdown ? 'ring-blue-100' : 'group-hover:ring-blue-100'}`}>
                                        <User className="h-4 w-4" />
                                    </div>
                                )}
                            </div>

                            {/* Profile Dropdown */}
                            {showProfileDropdown && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in origin-top-right">
                                    <div className="p-2 space-y-1">
                                        {user && user.status === "Active" && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        navigate('/trainee/profile', { state: { activeTab: 'profile' } });
                                                        setShowProfileDropdown(false);
                                                    }}
                                                    className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                                                >
                                                    <User className="h-4 w-4 mr-3 text-gray-400 group-hover:text-blue-500" />
                                                    Profile Settings
                                                </button>

                                                {canViewBankDetails && (
                                                    <button
                                                        onClick={() => {
                                                            navigate('/trainee/profile', { state: { activeTab: 'banking' } });
                                                            setShowProfileDropdown(false);
                                                        }}
                                                        className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                                                    >
                                                        <CreditCard className="h-4 w-4 mr-3 text-gray-400 group-hover:text-blue-500" />
                                                        Bank Details
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => {
                                                        navigate('/trainee/profile', { state: { activeTab: 'security' } });
                                                        setShowProfileDropdown(false);
                                                    }}
                                                    className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                                                >
                                                    <Shield className="h-4 w-4 mr-3 text-gray-400 group-hover:text-blue-500" />
                                                    Security
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        navigate('/trainee/profile', { state: { activeTab: 'notifications' } });
                                                        setShowProfileDropdown(false);
                                                    }}
                                                    className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                                                >
                                                    <Bell className="h-4 w-4 mr-3 text-gray-400 group-hover:text-blue-500" />
                                                    Notifications
                                                </button>
                                            </>
                                        )}

                                        <button
                                            onClick={() => {
                                                setShowProfileDropdown(false);
                                                logout();
                                                navigate("/login");
                                            }}
                                            className={`w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium ${
                                                user && user.status === "Active" ? "border-t border-gray-100 mt-1 pt-2" : ""
                                            }`}
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
            </div>
        </header>
    );
}
