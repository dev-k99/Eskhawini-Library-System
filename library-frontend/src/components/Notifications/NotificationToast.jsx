import { useState, useEffect, useCallback } from 'react';
import { signalRService } from '../../services/signalr';
import { useAuth } from '../../context/AuthContext';
import { X, Bell, CheckCircle, Clock, BookOpen } from 'lucide-react';

export default function NotificationToast() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // Define functions with useCallback so they're stable references for useEffect
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addNotification = useCallback((notification) => {
    setNotifications(prev => [...prev, notification]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  }, [removeNotification]);

  useEffect(() => {
    if (!user) return;

    const connect = async () => {
      await signalRService.connect();
      
      // Join user's personal notification group
      if (user.id) {
        await signalRService.joinUserGroup(user.id);
      }

      // Listen for notification events
      signalRService.on('BookAvailable', (data) => {
        addNotification({
          id: Date.now(),
          type: 'success',
          icon: CheckCircle,
          title: 'Book Available',
          message: data.message,
        });
      });

      signalRService.on('ReservationReady', (data) => {
        addNotification({
          id: Date.now(),
          type: 'success',
          icon: Bell,
          title: 'Reservation Ready',
          message: data.message,
        });
      });

      signalRService.on('LoanDueSoon', (data) => {
        addNotification({
          id: Date.now(),
          type: 'warning',
          icon: Clock,
          title: 'Due Date Reminder',
          message: data.message,
        });
      });

      signalRService.on('BookReturned', (data) => {
        addNotification({
          id: Date.now(),
          type: 'info',
          icon: BookOpen,
          title: 'Book Returned',
          message: data.message,
        });
      });
    };

    connect();

    return () => {
      if (user.id) {
        signalRService.leaveUserGroup(user.id);
      }
      signalRService.off('BookAvailable');
      signalRService.off('ReservationReady');
      signalRService.off('LoanDueSoon');
      signalRService.off('BookReturned');
    };
  }, [user, addNotification]);

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-100 border-green-500/30 text-emerald-600';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500/30 text-yellow-600';
      case 'error':
        return 'bg-red-100 border-red-500/30 text-red-600';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-700';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => {
        const Icon = notification.icon;
        return (
          <div
            key={notification.id}
            className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm animate-slide-in-right ${getTypeStyles(notification.type)}`}
          >
            <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900">{notification.title}</p>
              <p className="text-sm text-gray-700 mt-0.5">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
