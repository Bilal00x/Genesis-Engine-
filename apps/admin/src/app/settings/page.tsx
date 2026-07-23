"""
Settings Admin Page
"""

import { useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  
  const settings = [
    { 
      key: "app_name", 
      label: "App Name", 
      value: "AI Game Studio", 
      type: "text", 
      description: "The name displayed in the application" 
    },
    { 
      key: "app_version", 
      label: "App Version", 
      value: "1.0.0", 
      type: "text", 
      description: "Current version of the application" 
    },
    { 
      key: "default_language", 
      label: "Default Language", 
      value: "en", 
      type: "select", 
      options: [
        { value: "en", label: "English" },
        { value: "es", label: "Spanish" },
        { value: "fr", label: "French" },
        { value: "de", label: "German" },
        { value: "ja", label: "Japanese" },
        { value: "zh", label: "Chinese" }
      ],
      description: "Default language for the application" 
    },
    { 
      key: "theme", 
      label: "Theme", 
      value: "dark", 
      type: "select", 
      options: [
        { value: "dark", label: "Dark" },
        { value: "light", label: "Light" },
        { value: "system", label: "System" }
      ],
      description: "Default theme for the application" 
    },
    { 
      key: "email_from", 
      label: "Email From Address", 
      value: "noreply@aigamestudio.com", 
      type: "email", 
      description: "Email address used for sending notifications" 
    },
    { 
      key: "smtp_host", 
      label: "SMTP Host", 
      value: "smtp.gmail.com", 
      type: "text", 
      description: "SMTP server host for email sending" 
    },
    { 
      key: "smtp_port", 
      label: "SMTP Port", 
      value: "587", 
      type: "number", 
      description: "SMTP server port" 
    },
    { 
      key: "rate_limit_global", 
      label: "Global Rate Limit", 
      value: "1000", 
      type: "number", 
      description: "Maximum number of requests per hour" 
    },
    { 
      key: "rate_limit_auth", 
      label: "Authentication Rate Limit", 
      value: "10", 
      type: "number", 
      description: "Maximum number of login attempts per minute" 
    },
    { 
      key: "rate_limit_generation", 
      label: "Generation Rate Limit", 
      value: "5", 
      type: "number", 
      description: "Maximum number of AI generations per minute" 
    }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <button className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Save Changes
        </button>
      </div>
      
      <div className="flex border-b mb-6">
        <button 
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "general" 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-text'
          }`}
        >
          General
        </button>
        
        <button 
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "security" 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-text'
          }`}
        >
          Security
        </button>
        
        <button 
          onClick={() => setActiveTab("api")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "api" 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-text'
          }`}
        >
          API
        </button>
        
        <button 
          onClick={() => setActiveTab("integrations")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "integrations" 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-text'
          }`}
        >
          Integrations
        </button>
        
        <button 
          onClick={() => setActiveTab("backup")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "backup" 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-text'
          }`}
        >
          Backup
        </button>
      </div>
      
      <div className="flex-1">
        {activeTab === "general" && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">General Settings</h2>
            
            <div className="space-y-6">
              {settings.filter(s => [
                "app_name", "app_version", "default_language", "theme", "email_from"
              ].includes(s.key)).map(setting => (
                <div key={setting.key} className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">{setting.label}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{setting.description}</p>
                  
                  {setting.type === "text" && (
                    <input
                      type="text"
                      defaultValue={setting.value}
                      className="w-full px-3 py-2 rounded-md border bg-background text-text"
                    />
                  )}
                  
                  {setting.type === "email" && (
                    <input
                      type="email"
                      defaultValue={setting.value}
                      className="w-full px-3 py-2 rounded-md border bg-background text-text"
                    />
                  )}
                  
                  {setting.type === "select" && (
                    <select
                      defaultValue={setting.value}
                      className="w-full px-3 py-2 rounded-md border bg-background text-text"
                    >
                      {setting.options?.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  )}
                  
                  {setting.type === "number" && (
                    <input
                      type="number"
                      defaultValue={setting.value}
                      className="w-full px-3 py-2 rounded-md border bg-background text-text"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === "security" && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
            
            <div className="space-y-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-4">Authentication</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Enable Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors">
                      <span className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Password Requirements</h4>
                      <p className="text-sm text-muted-foreground">Minimum password length and complexity</p>
                    </div>
                    <button className="text-xs text-primary hover:text-primary/80">
                      Configure
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Session Timeout</h4>
                      <p className="text-sm text-muted-foreground">Automatic logout after inactivity</p>
                    </div>
                    <button className="text-xs text-primary hover:text-primary/80">
                      Configure
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-4">Rate Limiting</h3>
                
                <div className="space-y-4">
                  {settings.filter(s => [
                    "rate_limit_global", "rate_limit_auth", "rate_limit_generation"
                  ].includes(s.key)).map(setting => (
                    <div key={setting.key} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{setting.label}</h4>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                      <input
                        type="number"
                        defaultValue={setting.value}
                        className="w-24 px-3 py-2 rounded-md border bg-background text-text"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-4">Encryption</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Database Encryption</h4>
                      <p className="text-sm text-muted-foreground">Encrypt sensitive data at rest</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors">
                      <span className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">API Key Encryption</h4>
                      <p className="text-sm text-muted-foreground">Encrypt API keys in database</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors">
                      <span className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "api" && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">API Settings</h2>
            
            <div className="space-y-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-4">API Keys</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Enable API Access</h4>
                      <p className="text-sm text-muted-foreground">Allow users to generate API keys</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors">
                      <span className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Default API Key Permissions</h4>
                      <p className="text-sm text-muted-foreground">Default permissions for new API keys</p>
                    </div>
                    <button className="text-xs text-primary hover:text-primary/80">
                      Configure
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">API Key Expiration</h4>
                      <p className="text-sm text-muted-foreground">Default expiration for API keys</p>
                    </div>
                    <button className="text-xs text-primary hover:text-primary/80">
                      Configure
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-4">CORS</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Allowed Origins</h4>
                      <p className="text-sm text-muted-foreground">Domains allowed to make API requests</p>
                    </div>
                    <button className="text-xs text-primary hover:text-primary/80">
                      Configure
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Allow Credentials</h4>
                      <p className="text-sm text-muted-foreground">Allow cookies and authentication headers</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors">
                      <span className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-4">Webhooks</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Webhook Secret</h4>
                      <p className="text-sm text-muted-foreground">Secret key for webhook verification</p>
                    </div>
                    <button className="text-xs text-primary hover:text-primary/80">
                      Generate
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Webhook URL</h4>
                      <p className="text-sm text-muted-foreground">URL to send webhook events</p>
                    </div>
                    <input
                      type="text"
                      defaultValue="https://your-app.com/webhooks"
                      className="w-full px-3 py-2 rounded-md border bg-background text-text"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "integrations" && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Integrations</h2>
            
            <div className="space-y-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-4">Stripe</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Stripe API Key</h4>
                      <p className="text-sm text-muted-foreground">Secret key for Stripe integration</p>
                    </div>
                    <button className="text-xs text-primary hover:text-primary/80">
                      Configure
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Stripe Webhook Secret</h4>
                      <p className="text-sm text-muted-foreground">Secret key for Stripe webhook verification</p>
                    </div>
                    <button className="text-xs text-primary hover:text-primary/80">
                      Configure
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Stripe Publishable Key</h4>
                      <p className="text-sm text-muted-foreground">Publishable key for Stripe integration</p>
                    </div>
                    <button className="text-xs text-primary hover:text-primary/80">
                      Configure
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-4">Google OAuth</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Google Client ID</h4>
                      <p className="text-sm text-muted-foreground">Client ID for Google OAuth</p>
                    </div>
                    <button className="text-xs text-primary hover:text-primary/80">
                      Configure
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Google Client Secret</h4>
                      <p className="text-sm text-muted-foreground">Client secret for Google OAuth</p>
                    </div>
                    <button className="text-xs text-primary hover:text-primary/80">
                      Configure
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Google Redirect URI</h4>
                      <p className="text-sm text-muted-foreground">Redirect URI for Google OAuth</p>
                    </div>
                    <input
                      type="text"
                      defaultValue="https://aigamestudio.com/auth/callback/google"
                      className="w-full px-3 py-2 rounded-md border bg-background text-text"
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-4">GitHub OAuth</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">GitHub Client ID</h4>
                      <p className="text-sm text-muted-foreground">Client ID for GitHub OAuth</p>
                    </div>
                    <button className="text-xs text-primary hover:text-primary/80">
                      Configure
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">GitHub Client Secret</h4>
                      <p className="text-sm text-muted-foreground">Client secret for GitHub OAuth</p>
                    </div>
                    <button className="text-xs text-primary hover:text-primary/80">
                      Configure
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">GitHub Redirect URI</h4>
                      <p className="text-sm text-muted-foreground">Redirect URI for GitHub OAuth</p>
                    </div>
                    <input
                      type="text"
                      defaultValue="https://aigamestudio.com/auth/callback/github"
                      className="w-full px-3 py-2 rounded-md border bg-background text-text"
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-4">Email</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SMTP Host</h4>
                      <p className="text-sm text-muted-foreground">SMTP server host</p>
                    </div>
                    <input
                      type="text"
                      defaultValue="smtp.gmail.com"
                      className="w-full px-3 py-2 rounded-md border bg-background text-text"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SMTP Port</h4>
                      <p className="text-sm text-muted-foreground">SMTP server port</p>
                    </div>
                    <input
                      type="number"
                      defaultValue="587"
                      className="w-24 px-3 py-2 rounded-md border bg-background text-text"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SMTP Username</h4>
                      <p className="text-sm text-muted-foreground">SMTP username</p>
                    </div>
                    <input
                      type="text"
                      defaultValue="your-email@gmail.com"
                      className="w-full px-3 py-2 rounded-md border bg-background text-text"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SMTP Password</h4>
                      <p className="text-sm text-muted-foreground">SMTP password</p>
                    </div>
                    <input
                      type="password"
                      defaultValue="your-password"
                      className="w-full px-3 py-2 rounded-md border bg-background text-text"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "backup" && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Backup & Recovery</h2>
            
            <div className="space-y-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-4">Database Backup</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Backup Schedule</h4>
                      <p className="text-sm text-muted-foreground">Automatic backup frequency</p>
                    </div>
                    <select className="px-3 py-2 rounded-md border bg-background text-text">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Backup Time</h4>
                      <p className="text-sm text-muted-foreground">Time of day for automatic backups</p>
                    </div>
                    <input
                      type="time"
                      defaultValue="02:00"
                      className="w-32 px-3 py-2 rounded-md border bg-background text-text"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Retention Period</h4>
                      <p className="text-sm text-muted-foreground">How long to keep backups</p>
                    </div>
                    <select className="px-3 py-2 rounded-md border bg-background text-text">
                      <option>7 days</option>
                      <option>30 days</option>
                      <option>90 days</option>
                      <option>1 year</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-4">Storage Backup</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Backup Destination</h4>
                      <p className="text-sm text-muted-foreground">Where to store backups</p>
                    </div>
                    <select className="px-3 py-2 rounded-md border bg-background text-text">
                      <option>Local Storage</option>
                      <option>Amazon S3</option>
                      <option>Google Cloud Storage</option>
                      <option>Microsoft Azure Blob</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Storage Location</h4>
                      <p className="text-sm text-muted-foreground">Path or bucket for backups</p>
                    </div>
                    <input
                      type="text"
                      defaultValue="backups/ai-game-studio"
                      className="w-full px-3 py-2 rounded-md border bg-background text-text"
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-4">Manual Backup</h3>
                
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Create a manual backup of your database and storage.</p>
                  
                  <div className="flex items-center space-x-4">
                    <button className="btn btn-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      Create Backup
                    </button>
                    
                    <button className="btn btn-outline">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M3 10h18M3 14h18M12 2v4" />
                      </svg>
                      View Backups
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-4">Recovery</h3>
                
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Restore your system from a previous backup.</p>
                  
                  <div className="flex items-center space-x-4">
                    <button className="btn btn-outline">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      Restore from Backup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}