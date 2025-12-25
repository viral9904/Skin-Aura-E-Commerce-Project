
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, CheckCircle2 } from 'lucide-react';


const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type FormValues = z.infer<typeof formSchema>;

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await forgotPassword(data.email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Password reset request error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
   
      <div className="container-custom my-12 max-w-md px-6 py-12 bg-white shadow-lg rounded-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Forgot Password</h1>
          <p className="text-muted-foreground">
            Enter your email address to receive a password reset link
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 size={64} className="text-green-500" />
            </div>
            <h2 className="text-xl font-semibold">Email Sent</h2>
            <p className="text-muted-foreground">
              If an account with that email exists, we've sent a password reset link.
              Please check your email and follow the instructions.
            </p>
            <Button asChild className="mt-4">
              <Link to="/login">Back to Login</Link>
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>

              <div className="text-center mt-4">
                <Link to="/login" className="text-primary hover:underline text-sm">
                  Back to login
                </Link>
              </div>
            </form>
          </Form>
        )}
      </div>
   
  );
};

export default ForgotPassword;
