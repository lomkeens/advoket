import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { ArrowRight, Loader, Mail, RefreshCw, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [isResendingConfirmation, setIsResendingConfirmation] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Clear error when inputs change
  useEffect(() => {
    setError(null);
    setShowEmailConfirmation(false);
  }, [email, password]);

  // Handle resending confirmation email
  const handleResendConfirmation = async () => {
    if (!email) return;
    
    setIsResendingConfirmation(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) {
        setError(`Failed to resend confirmation email: ${error.message}`);
      } else {
        setConfirmationSent(true);
        setError(null);
      }
    } catch (err) {
      setError('Failed to resend confirmation email. Please try again.');
    } finally {
      setIsResendingConfirmation(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowEmailConfirmation(false);
    setIsSubmitting(true);
    
    try {
      console.log('[Login] Attempting sign in:', { email });
      await signIn(email, password);
      console.log('[Login] Sign in successful, navigating to /');
      navigate('/', { replace: true });
    } catch (err) {
      console.error('[Login] Sign in error:', err);
      setLoginAttempts(prev => prev + 1);
      
      if (err instanceof Error) {
        // Handle specific error cases
        if (err.message.toLowerCase().includes('invalid login credentials')) {
          if (loginAttempts >= 2) {
            setError('Invalid email or password. Please double-check your credentials or try resetting your password if you\'ve forgotten it.');
          } else {
            setError('Invalid email or password. Please check your credentials and try again.');
          }
        } else if (err.message.toLowerCase().includes('email not confirmed')) {
          setShowEmailConfirmation(true);
          setError(null);
        } else if (err.message.toLowerCase().includes('too many requests')) {
          setError('Too many login attempts. Please wait a few minutes before trying again.');
        } else if (err.message) {
          setError(err.message);
        } else {
          setError('An unknown error occurred. Please try again.');
        }
      } else if (typeof err === 'string') {
        if (err.toLowerCase().includes('email not confirmed')) {
          setShowEmailConfirmation(true);
          setError(null);
        } else {
          setError(err);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-center text-2xl font-extrabold text-gray-900 mb-5">
        Sign in to your account
      </h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-5">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              {loginAttempts >= 2 && error.includes('Invalid email or password') && (
                <div className="mt-2 text-xs text-red-600">
                  <p className="font-medium">Having trouble signing in?</p>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>Make sure your email address is spelled correctly</li>
                    <li>Check that Caps Lock is not enabled</li>
                    <li>Ensure your account email has been confirmed</li>
                    <li>Try using the "Forgot your password?" link below</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showEmailConfirmation && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-5">
          <div className="flex">
            <Mail className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Email Confirmation Required
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p className="mb-2">
                  Please check your email inbox (including spam/junk folders) for a confirmation email from us. 
                  Click the confirmation link in that email to verify your account.
                </p>
                {confirmationSent ? (
                  <div className="bg-green-100 border border-green-300 rounded-md p-2 mb-2">
                    <p className="text-green-800 text-xs">
                      ✓ Confirmation email sent! Please check your inbox.
                    </p>
                  </div>
                ) : (
                  <p className="mb-2 text-xs">
                    Didn't receive the email? You can request a new one below.
                  </p>
                )}
                <button
                  onClick={handleResendConfirmation}
                  disabled={isResendingConfirmation || confirmationSent}
                  className="inline-flex items-center px-3 py-1 border border-blue-300 rounded-md text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResendingConfirmation ? (
                    <>
                      <Loader className="animate-spin h-3 w-3 mr-1" />
                      Sending...
                    </>
                  ) : confirmationSent ? (
                    <>
                      <Mail className="h-3 w-3 mr-1" />
                      Email Sent
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Resend Confirmation Email
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-800 hover:text-blue-700">
                Forgot your password?
              </a>
            </div>
          </div>
          <div className="mt-1 relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {loginAttempts >= 1 && (
            <p className="mt-1 text-xs text-gray-500">
              Make sure your password is correct and Caps Lock is not enabled
            </p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader className="animate-spin h-5 w-5" />
            ) : (
              <span className="flex items-center">
                Sign in <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div>
            <button
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div>
            <button
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-800 hover:text-blue-700">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;