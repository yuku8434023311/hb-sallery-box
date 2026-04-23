'use client';

import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/splash-screen';
import { LoginScreen } from '@/components/login-screen';
import { AdminRegistration } from '@/components/admin-registration';
import { AdminDashboard } from '@/components/admin-dashboard';
import { EmployeeDashboard } from '@/components/employee-dashboard';
import { Settings } from '@/components/settings';
import { BiometricLock } from '@/components/biometric-lock';
import { useAuthStore } from '@/store/auth-store';
import { useBiometric } from '@/hooks/use-biometric';

type Screen = 'splash' | 'login' | 'register' | 'dashboard' | 'settings';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [registrationPhone, setRegistrationPhone] = useState('');
  const { logout, user } = useAuthStore();

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
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      if (window.location.pathname === '/offline') {
        window.location.href = '/';
      }
    };

    const handleOffline = () => {
      if (window.location.pathname !== '/offline') {
        window.location.href = '/offline';
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSplashComplete = (isAuthenticated: boolean) => {
    if (isAuthenticated) {
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen('login');
    }
  };

  const handleLogin = () => {
    setCurrentScreen('dashboard');
  };

  const handleRegister = (phone: string) => {
    setRegistrationPhone(phone);
    setCurrentScreen('register');
  };

  const handleRegistered = () => {
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    logout();
    setCurrentScreen('login');
  };

  const handleSettings = () => {
    setCurrentScreen('settings');
  };

  const handleBackFromSettings = () => {
    setCurrentScreen('dashboard');
  };

  const handleBackFromRegister = () => {
    setCurrentScreen('login');
  };

  const handleBiometricAuthenticate = async () => {
    return await biometricAuthenticate();
  };

  const handleBiometricUnlock = () => {
    biometricUnlock();
  };

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
