import React from 'react';
import { useQuery } from 'react-query';
import { getUserProfile } from '../lib/api';
import { useAuthStore } from '../store/auth';

export function AccountProfile() {
  const { auth } = useAuthStore();
  const { data: profile, isLoading, error } = useQuery(
    'userProfile',
    () => getUserProfile(auth!.access_token),
    {
      enabled: !!auth,
    }
  );

  if (isLoading) {
    return (
      <div className="animate-pulse bg-white rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3 mt-2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-red-50 p-4 rounded-lg mb-6">
        <p className="text-red-600">Failed to load profile information</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <div className="flex items-center space-x-4">
        <img
          src={profile.profile_image}
          alt={profile.username}
          className="h-12 w-12 rounded-full"
        />
        <div>
          <h2 className="text-lg font-semibold">{profile.username}</h2>
          <p className="text-sm text-gray-500 capitalize">{profile.account_type} Account</p>
          {profile.bio && <p className="mt-2 text-gray-600">{profile.bio}</p>}
        </div>
      </div>
    </div>
  );
}