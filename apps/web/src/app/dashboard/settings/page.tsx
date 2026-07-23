"""
Settings Page
"""

import { useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({
    username: "johndoe",
    email: "john@example.com",
    full_name: "John Doe",
    avatar_url: "",
  });

  const [notifications, setNotifications] = useState({
    email_generation_complete: true,
    email_export_complete: true,
    email_weekly_report: false,
    email_marketing: false,
    push_generation_complete: true,
    push_export_complete: true,
  });

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "notifications", label: "Notifications" },
    { id: "security", label: "Security" },
    { id: "api-keys", label: "API Keys" },
    { id: "billing", label: "Billing" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-text-muted mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="flex space-x-6">
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-text-muted hover:text-text hover:bg-card"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="card space-y-6">
              <h2 className="text-xl font-semibold">Profile Settings</h2>

              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <button className="btn btn-outline text-sm">Change avatar</button>
                  <p className="text-xs text-text-muted mt-1">JPG, GIF or PNG. Max size 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Full name</label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="input"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button className="btn btn-primary">Save changes</button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="card space-y-6">
              <h2 className="text-xl font-semibold">Notification Settings</h2>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-text-muted uppercase tracking-wide">Email Notifications</h3>

                {Object.entries(notifications).filter(([key]) => key.startsWith("email")).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {key.replace("email_", "").replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      <p className="text-sm text-text-muted">
                        {key === "email_generation_complete" && "Get notified when your AI generation completes"}
                        {key === "email_export_complete" && "Get notified when your export is ready"}
                        {key === "email_weekly_report" && "Receive a weekly summary of your activity"}
                        {key === "email_marketing" && "Receive tips, product updates, and inspiration"}
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [key]: !value })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}

                <h3 className="text-sm font-medium text-text-muted uppercase tracking-wide pt-4">Push Notifications</h3>

                {Object.entries(notifications).filter(([key]) => key.startsWith("push")).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {key.replace("push_", "").replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      <p className="text-sm text-text-muted">
                        {key === "push_generation_complete" && "Browser notification when generation completes"}
                        {key === "push_export_complete" && "Browser notification when export is ready"}
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [key]: !value })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button className="btn btn-primary">Save preferences</button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="card space-y-6">
                <h2 className="text-xl font-semibold">Change Password</h2>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current password</label>
                    <input type="password" className="input" placeholder="Enter current password" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">New password</label>
                    <input type="password" className="input" placeholder="Enter new password" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm new password</label>
                    <input type="password" className="input" placeholder="Confirm new password" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="btn btn-primary">Update password</button>
                </div>
              </div>

              <div className="card space-y-6">
                <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
                <p className="text-text-muted">Add an extra layer of security to your account</p>
                <button className="btn btn-outline">Enable 2FA</button>
              </div>

              <div className="card space-y-6">
                <h2 className="text-xl font-semibold text-destructive">Danger Zone</h2>
                <p className="text-text-muted">Permanently delete your account and all associated data</p>
                <button className="btn btn-destructive">Delete account</button>
              </div>
            </div>
          )}

          {activeTab === "api-keys" && (
            <div className="card space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">API Keys</h2>
                <button className="btn btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Create API Key
                </button>
              </div>

              <p className="text-text-muted">
                Use API keys to authenticate requests to the AI Game Studio API.
              </p>

              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Production Key</p>
                      <p className="text-sm text-text-muted font-mono">sk_live_****...****7890</p>
                      <p className="text-xs text-text-muted mt-1">Created Jul 1, 2026 - Last used 2 hours ago</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-xs text-primary hover:text-primary/80">Copy</button>
                      <button className="text-xs text-destructive hover:text-destructive/80">Revoke</button>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Development Key</p>
                      <p className="text-sm text-text-muted font-mono">sk_test_****...****1234</p>
                      <p className="text-xs text-text-muted mt-1">Created Jun 15, 2026 - Last used 1 day ago</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-xs text-primary hover:text-primary/80">Copy</button>
                      <button className="text-xs text-destructive hover:text-destructive/80">Revoke</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div>
              <Link href="/dashboard/settings/billing" className="text-primary hover:text-primary/80">
                Go to Billing Settings →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
