import { useState } from 'react';
import { Bell, DollarSign, Calendar, Building, MessageSquare, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Mock notifications
const mockNotifications = [
  {
    id: '1',
    type: 'price_drop',
    title: 'Price Drop Alert',
    message: 'The price for "Modern Studio Near University" has been reduced by ₹50.',
    timestamp: '2025-02-28T14:30:00Z',
    isRead: false,
    linkTo: '/listings/1',
    icon: DollarSign,
  },
  {
    id: '2',
    type: 'message',
    title: 'New Message',
    message: 'You have a new message from Taylor Homeowner regarding "2 Bedroom Apartment with Balcony".',
    timestamp: '2025-02-27T09:15:00Z',
    isRead: false,
    linkTo: '/student-dashboard',
    icon: MessageSquare,
  },
  {
    id: '3',
    type: 'system',
    title: 'Welcome to HomesAway',
    message: 'Thank you for joining HomesAway. Start exploring student-friendly accommodations now.',
    timestamp: '2025-02-25T16:45:00Z',
    isRead: true,
    linkTo: '/',
    icon: Building,
  },
  {
    id: '4',
    type: 'viewing',
    title: 'Viewing Reminder',
    message: 'You have a scheduled viewing for "Cozy Room in Shared House" tomorrow at 3 PM.',
    timestamp: '2025-02-24T10:30:00Z',
    isRead: true,
    linkTo: '/listings/3',
    icon: Calendar,
  },
  {
    id: '5',
    type: 'locality',
    title: 'Locality Insight Update',
    message: 'We\'ve updated the Locality Aura score for "Downtown". Check out the latest insights.',
    timestamp: '2025-02-23T13:20:00Z',
    isRead: true,
    linkTo: '/localities/Downtown',
    icon: Building,
  },
];

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    priceAlerts: true,
    messageAlerts: true,
    systemUpdates: false,
  });
  
  // Format notification time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
      } else {
        return date.toLocaleDateString();
      }
    }
  };
  
  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, isRead: true }))
    );
    toast.success('All notifications marked as read');
  };
  
  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
    toast.success('Notification removed');
  };
  
  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.isRead;
    return notification.type === activeTab;
  });
  
  // Toggle notification setting
  const toggleSetting = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));
    
    toast.success(`${setting} notifications ${notificationSettings[setting as keyof typeof notificationSettings] ? 'disabled' : 'enabled'}`);
  };
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notifications</h1>
        
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="all">
            All
            {notifications.length > 0 && (
              <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                {notifications.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unreadCount > 0 && (
              <span className="ml-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="price_drop">Prices</TabsTrigger>
          <TabsTrigger value="message">Messages</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg ${!notification.isRead ? 'bg-accent' : 'bg-card'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center ${!notification.isRead ? 'text-primary' : 'text-muted-foreground'}`}>
                      <notification.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className={`font-semibold ${!notification.isRead ? '' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(notification.timestamp)}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <div className="mt-2">
                        <Button
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2" 
                          asChild
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Link to={notification.linkTo}>View Details</Link>
                        </Button>
                        {!notification.isRead && (
                          <Button
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2 ml-2"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold mb-2">No Notifications</h3>
              <p className="text-muted-foreground">
                {activeTab === 'all' 
                  ? 'You don\'t have any notifications yet.'
                  : activeTab === 'unread'
                    ? 'You don\'t have any unread notifications.'
                    : `You don't have any ${activeTab} notifications.`}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Notification Settings */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-base font-medium">Delivery Methods</h3>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notificationSettings.email}
                  onCheckedChange={() => toggleSetting('email')}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications in-app</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notificationSettings.push}
                  onCheckedChange={() => toggleSetting('push')}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-base font-medium">Notification Types</h3>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="price-alerts">Price Alerts</Label>
                  <p className="text-sm text-muted-foreground">When prices change on saved listings</p>
                </div>
                <Switch
                  id="price-alerts"
                  checked={notificationSettings.priceAlerts}
                  onCheckedChange={() => toggleSetting('priceAlerts')}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="message-alerts">Message Alerts</Label>
                  <p className="text-sm text-muted-foreground">When you receive new messages</p>
                </div>
                <Switch
                  id="message-alerts"
                  checked={notificationSettings.messageAlerts}
                  onCheckedChange={() => toggleSetting('messageAlerts')}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="system-updates">System Updates</Label>
                  <p className="text-sm text-muted-foreground">News and feature updates</p>
                </div>
                <Switch
                  id="system-updates"
                  checked={notificationSettings.systemUpdates}
                  onCheckedChange={() => toggleSetting('systemUpdates')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}