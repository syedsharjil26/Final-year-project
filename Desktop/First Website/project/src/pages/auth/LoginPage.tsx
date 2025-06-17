import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Define form schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const ADMIN_EMAIL = "admin@homesaway.com";
const ADMIN_PASSWORD = "admin123";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  
  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // Form submission handler
  const onSubmit = async (values: LoginFormValues) => {
    // Hardcoded admin login
    if (
      values.email === ADMIN_EMAIL &&
      values.password === ADMIN_PASSWORD
    ) {
      const adminUser = {
        id: "admin-local",
        name: "Admin",
        email: ADMIN_EMAIL,
        role: "admin",
        avatar: "https://ui-avatars.com/api/?name=Admin"
      };
      localStorage.setItem("user", JSON.stringify(adminUser));
      window.location.href = "/admin-dashboard";
      return;
    }
    try {
      const user: any = await login(values.email, values.password);
      console.log('Login success, user:', user);
      // Redirect to dashboard based on user role
      if (user?.role === 'student') {
        navigate('/student-dashboard', { replace: true });
      } else if (user?.role === 'homeowner') {
        navigate('/homeowner-dashboard', { replace: true });
      } else if (user?.role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      // Error is handled in the AuthContext
      console.error('Login failed', error);
      if (error instanceof Error) {
        window.alert(error.message);
      } else {
        window.alert('Login failed');
      }
    }
  };
  
  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <Building2 className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Login to your HomesAway account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-4 text-center text-sm">
            <Link to="/forgot-password" className="text-primary hover:underline">
              Forgot your password?
            </Link>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground text-center max-w-xs">
            {/* Your footer text here */}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}