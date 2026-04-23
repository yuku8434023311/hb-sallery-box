'use client';

import { useState, useCallback, useEffect } from 'react';
import { SplashScreen } from '@/components/splash-screen';
import { LoginScreen } from '@/components/login-screen';
import { AdminRegistration } from '@/components/admin-registration';
import { AdminDashboard } from '@/components/admin-dashboard';
import { EmployeeDashboard } from '@/components/employee-dashboard';
import { Settings } from '@/components/settings';
import { BiometricLock } from '@/components/biometric-lock';
import { useAuthStore } from '@/store/auth-store';
import { useBiometric } from '@/hooks/use-biometric';
import { useRouter } from 'next/navigation';

type Screen = 'splash' | 'login' | 'register' | 'dashboard' | 'settings';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [registrationPhone, setRegistrationPhone] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [isCheckingOnline, setIsCheckingOnline] = useState(true);
  const { logout, user } = useAuthStore();
  const router = useRouter();
  
  const {
    isEnabled: biometricEnabled,
    isLocked: biometricLocked,
    isAuthenticating: biometricAuthenticating,
    error: biometricError,
    authenticate: biometricAuthenticate,
    unlock: biometricUnlock,
  } = useBiometric();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial online status
    setIsOnline(navigator.onLine);
    setIsCheckingOnline(false);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Redirect to offline page when offline
  useEffect(() => {
    if (!isOnline && currentScreen === 'splash') {
      router.push('/offline');
    }
  }, [isOnline, currentScreen, router]);

  // Auto-redirect when coming back online from offline page
  useEffect(() => {
    const handleOnline = () => {
      if (!isOnline) {
        setIsOnline(true);
        router.push('/');
      }
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [isOnline, router]);

  const handleSplashComplete = useCallback((isAuthenticated: boolean) => {
    if (isAuthenticated) {
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen('login');
    }
  }, []);

  const handleLogin = useCallback(() => {
    setCurrentScreen('dashboard');
  }, []);

  const handleRegister = useCallback((phone: string) => {
    setRegistrationPhone(phone);
    setCurrentScreen('register');
  }, []);

  const handleRegistered = useCallback(() => {
    setCurrentScreen('dashboard');
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setCurrentScreen('login');
  }, [logout]);

  const handleSettings = useCallback(() => {
    setCurrentScreen('settings');
  }, []);

  const handleBackFromSettings = useCallback(() => {
    setCurrentScreen('dashboard');
  }, []);

  const handleBackFromRegister = useCallback(() => {
    setCurrentScreen('login');
  }, []);

  const handleBiometricAuthenticate = useCallback(async () => {
    return await biometricAuthenticate();
  }, [biometricAuthenticate]);

  const handleBiometricUnlock = useCallback(() => {
    biometricUnlock();
  }, [biometricUnlock]);

  // Show offline UI when offline
  if (isCheckingOnline || !isOnline) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#eaf7ef',
      }}>
        <div style={{ textAlign: 'center' }}>
          {isCheckingOnline ? (
            <div>
              <div style={{
                width: '40px',
                height: '40px',
                margin: '0 auto 20px',
                border: '4px solid #3aa85c',
                borderTop: '4px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : (
            <>
              <h2 style={{ color: '#3aa85c', marginBottom: '10px' }}>
                No Internet Connection
              </h2>
              <p style={{ color: '#666' }}>Please check your internet connection...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  // Render appropriate dashboard based on user role
  const renderDashboard = () => {
    if (user?.role === 'admin') {
      return (
        <AdminDashboard
          onLogout={handleLogout}
          onSettings={handleSettings}
        />
      );
    }
    return (
      <EmployeeDashboard
        onLogout={handleLogout}
        onSettings={handleSettings}
      />
    );
  };

  return (
    <main className="min-h-screen">
      {/* Biometric Lock Screen */}
      {currentScreen === 'dashboard' && biometricEnabled && (
        <BiometricLock
          isLocked={biometricLocked}
          isEnabled={biometricEnabled}
          isAuthenticating={biometricAuthenticating}
          onAuthenticate={handleBiometricAuthenticate}
          onUnlock={handleBiometricUnlock}
          error={biometricError}
        />
      )}
      
      {currentScreen === 'splash' && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}
      {currentScreen === 'login' && (
        <LoginScreen
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}
      {currentScreen === 'register' && (
        <AdminRegistration
          onBack={handleBackFromRegister}
          onRegistered={handleRegistered}
          initialPhone={registrationPhone}
        />
      )}
      {currentScreen === 'dashboard' && renderDashboard()}
      {currentScreen === 'settings' && (
        <Settings
          onBack={handleBackFromSettings}
          onLogout={handleLogout}
        />
      )}
    </main>
  );
}
