'use client';

import { UserProfile } from '@clerk/nextjs';
import { AIProviderSettings } from './ai-provider-settings';

export default function SettingsPage() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 dark:text-white mb-6">
        Settings
      </h1>

      {/* AI Provider Settings */}
      <div className="mb-8">
        <h2 className="text-md lg:text-xl font-medium text-gray-900 dark:text-white mb-4">
          AI Provider Settings
        </h2>
        <AIProviderSettings />
      </div>

      {/* User Profile */}
      <div className="mt-8">
        <h2 className="text-md lg:text-xl font-medium text-gray-900 dark:text-white mb-4">
          Account Settings
        </h2>
        <UserProfile routing="hash" />
      </div>
    </section>
  );
}