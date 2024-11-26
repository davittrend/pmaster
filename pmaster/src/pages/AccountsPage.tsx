import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { AccountProfile } from '../components/AccountProfile';
import { AccountSettings } from '../components/AccountSettings';

export function AccountsPage() {
  const { auth } = useAuthStore();

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Management</h1>
      <AccountProfile />
      <AccountSettings />
    </div>
  );
}