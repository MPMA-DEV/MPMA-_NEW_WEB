import { useState } from 'react';
import { BellOff, CheckCircle, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useNotifications } from '../../contexts/NotificationContext';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { useToastHelpers } from '../../hooks/useToast';

export default function TraineeNotifications() {
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const { success, error } = useToastHelpers();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Filter logic handled in-memory
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleClearAll = async () => {
    const confirmed = await ConfirmationModal.showWarning({
      title: "Clear All Notifications",
      message: "Are you sure you want to delete all notifications? This action cannot be undone.",
      confirmText: "Clear All",
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    try {
      await clearAll();
      success("All notifications cleared");
    } catch (e) {
      error("Failed to clear notifications");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-gray-500 mt-1">Updates on your training, payments, and schedule.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={markAllAsRead}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <CheckCircle className="w-4 h-4 mr-2" /> Mark all read
          </button>
          <button
            onClick={handleClearAll}
            className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Clear all
          </button>
        </div>
      </Card>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-xl w-fit border border-gray-200">
        {['all', 'unread', 'read'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f
              ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 border-dashed">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BellOff className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-medium">No notifications</h3>
            <p className="text-gray-500 text-sm mt-1">You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`relative group p-5 rounded-xl border-l-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 bg-white
                ${!n.read ? 'border-l-blue-500 bg-blue-50/30' : 'border-l-gray-300'}
              `}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h3 className={`font-semibold ${!n.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {n.title}
                    </h3>
                    {!n.read && <span className="ml-3 w-2 h-2 bg-blue-500 rounded-full"></span>}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-2 font-medium">
                    {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                      title="Mark Read"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  {/* Delete removed as not in backend yet, or implementing soft delete? */}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
