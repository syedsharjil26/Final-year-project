import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { SaveIcon, KeyIcon, TrashIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Form schema for account details
const accountFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  bio: z.string().optional(),
  university: z.string().optional(),
  studyYear: z.string().optional(),
  phoneNumber: z.string().optional(),
});

// Form schema for password update
const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  newPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type AccountFormValues = z.infer<typeof accountFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

interface StudentSettingsProps {
  user: User | null;
}

export default function StudentSettings({ user }: StudentSettingsProps) {
  const { logout } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  
  // Initialize account form
  const accountForm = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      bio: 'Computer Science student looking for accommodation near campus.',
      university: 'University of Technology',
      studyYear: '3rd Year',
      phoneNumber: '+1 (555) 123-4567',
    },
  });
  
  // Initialize password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  
  // Save account details
  const onAccountSubmit = (values: AccountFormValues) => {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      toast.success('Profile updated successfully');
      console.log(values);
    }, 1000);
  };
  
  // Update password
  const onPasswordSubmit = (values: PasswordFormValues) => {
    setIsChangingPassword(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsChangingPassword(false);
      passwordForm.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.success('Password updated successfully');
      console.log(values);
    }, 1000);
  };
  
  // Delete account
  const handleDeleteAccount = () => {
    // Simulate API call
    setTimeout(() => {
      toast.success('Account deleted successfully');
      logout();
    }, 1000);
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        {/* Account Settings */}
        <TabsContent value="account">
          <div className="space-y-6">
            {/* Profile Photo */}
            <div className="flex items-start space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="text-lg">{user ? getInitials(user.name) : 'U'}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="font-medium">Profile Photo</h3>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">Upload Photo</Button>
                  <Button size="sm" variant="outline">Remove Photo</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  JPG, GIF or PNG. 1MB max.
                </p>
              </div>
            </div>
            
            <Separator />
            
            {/* Account Form */}
            <Form {...accountForm}>
              <form onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={accountForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={accountForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={accountForm.control}
                    name="university"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>University / College</FormLabel>
                        <FormControl>
                          <Input placeholder="Your university" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={accountForm.control}
                    name="studyYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year of Study</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 1st Year, 2nd Year" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={accountForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={accountForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us a bit about yourself" 
                          className="resize-none h-24"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        This will be visible to property owners when you inquire about a listing.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Saving...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password Form */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <p className="text-sm text-muted-foreground">
                    Update your password to keep your account secure
                  </p>
                </div>
                
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="********" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="********" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="********" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" disabled={isChangingPassword} className="mt-2">
                      {isChangingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                          Updating...
                        </>
                      ) : (
                        <>
                          <KeyIcon className="mr-2 h-4 w-4" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
              
              {/* Two-Factor Authentication */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a code via SMS to verify your identity
                    </p>
                  </div>
                  <Switch id="two-factor" />
                </div>
                
                <Separator />
                
                {/* Login History */}
                <div>
                  <h3 className="text-lg font-medium">Login History</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Recent devices that have logged into your account
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-start p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Chrome on Windows</p>
                        <p className="text-sm text-muted-foreground">New York, USA · February 28, 2025</p>
                      </div>
                      <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Current Device
                      </div>
                    </div>
                    <div className="flex justify-between items-start p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Safari on iPhone</p>
                        <p className="text-sm text-muted-foreground">New York, USA · February 25, 2025</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8">Sign Out</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Delete Account */}
            <div className="mt-8 pt-8 border-t">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-destructive">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <TrashIcon className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={handleDeleteAccount}
                      >
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Preferences Settings */}
        <TabsContent value="preferences">
          <div className="space-y-6">
            {/* Email Preferences */}
            <div>
              <h3 className="text-lg font-medium">Email Preferences</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage what emails you receive from us
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Property Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about saved properties (price changes, availability)
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="message-emails">Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails when you get new messages from homeowners
                    </p>
                  </div>
                  <Switch id="message-emails" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive promotional emails and special offers
                    </p>
                  </div>
                  <Switch id="marketing-emails" />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="newsletter">Newsletter</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive our monthly student housing newsletter
                    </p>
                  </div>
                  <Switch id="newsletter" defaultChecked />
                </div>
              </div>
            </div>
            
            {/* Appearance */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-medium">Appearance</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Customize how HomesAway looks for you
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="theme" className="mb-2 block">Theme</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="border rounded-md p-3 text-center cursor-pointer bg-background">
                      <div className="h-16 rounded bg-card border mb-2 flex items-center justify-center">
                        <span className="text-xs font-semibold">Light</span>
                      </div>
                      <span className="text-sm">Light</span>
                    </div>
                    <div className="border rounded-md p-3 text-center cursor-pointer bg-black text-white">
                      <div className="h-16 rounded bg-zinc-800 border-zinc-700 border mb-2 flex items-center justify-center">
                        <span className="text-xs font-semibold">Dark</span>
                      </div>
                      <span className="text-sm">Dark</span>
                    </div>
                    <div className="border rounded-md p-3 text-center cursor-pointer bg-background">
                      <div className="h-16 rounded bg-gradient-to-b from-card to-black border mb-2 flex items-center justify-center">
                        <span className="text-xs font-semibold">Auto</span>
                      </div>
                      <span className="text-sm">System</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reduced-motion">Reduced Motion</Label>
                    <p className="text-sm text-muted-foreground">
                      Minimize animations and transitions
                    </p>
                  </div>
                  <Switch id="reduced-motion" />
                </div>
              </div>
            </div>
            
            {/* Privacy */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-medium">Privacy</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage your privacy settings
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="profile-visibility">Profile Visibility</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow homeowners to see your profile when you message them
                    </p>
                  </div>
                  <Switch id="profile-visibility" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="contact-info">Contact Information</Label>
                    <p className="text-sm text-muted-foreground">
                      Share your contact information with verified homeowners
                    </p>
                  </div>
                  <Switch id="contact-info" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-collection">Data Collection</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow us to collect usage data to improve our services
                    </p>
                  </div>
                  <Switch id="data-collection" defaultChecked />
                </div>
              </div>
            </div>
            
            <Button className="mt-4" onClick={() => toast.success('Preferences saved')}>
              <SaveIcon className="mr-2 h-4 w-4" />
              Save Preferences
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}