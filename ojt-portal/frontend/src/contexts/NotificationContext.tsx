import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    clearAll: () => Promise<void>;
    isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        try {
            const response = await api.get('/api/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    // Initial load and setup polling
    useEffect(() => {
        if (user) {
            setIsLoading(true);
            fetchNotifications();

            // Poll every 30 seconds for new notifications
            const interval = setInterval(() => {
                fetchNotifications();
            }, 30000);

            return () => clearInterval(interval);
        } else {
            setNotifications([]);
        }
    }, [user, fetchNotifications]);

    const markAsRead = async (id: number) => {
        try {
            // Optimistic update
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            await api.post(`/api/notifications/${id}/read`);
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            fetchNotifications(); // Revert on error
        }
    };

    const markAllAsRead = async () => {
        try {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            await api.post('/api/notifications/read-all');
        } catch (error) {
            console.error('Failed to mark all as read:', error);
            fetchNotifications();
        }
    };

    const clearAll = async () => {
        try {
            setNotifications([]);
            await api.delete('/api/notifications/clear-all');
        } catch (error) {
            console.error('Failed to clear notifications:', error);
            fetchNotifications();
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            fetchNotifications,
            markAsRead,
            markAllAsRead,
            clearAll,
            isLoading
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
