"""
Admin Dashboard Page
"""

import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="font-bold text-lg">AI Game Studio Admin</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="btn btn-outline">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M12 8v8M8 12h8" />
              </svg>
              Settings
            </button>
            
            <button className="btn btn-outline">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7.5 20.5 2 22l1.5-5.5L9.5 14l11.5-11.5" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r flex flex-col">
          <nav className="flex-1 p-4 space-y-2">
            <Link href="/admin" className="flex items-center space-x-3 px-3 py-2 rounded-md text-primary bg-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Dashboard</span>
            </Link>
            
            <Link href="/admin/users" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Users</span>
            </Link>
            
            <Link href="/admin/system" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09a1.65 1.65 0 0 0-1 1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0 .33-1.82l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-1.82.33H9a1.65 1.65 0 0 0-1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82.33l.06.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span>System</span>
            </Link>
            
            <Link href="/admin/logs" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8v8M8 12h8" />
              </svg>
              <span>Audit Logs</span>
            </Link>
            
            <Link href="/admin/settings" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09a1.65 1.65 0 0 0-1 1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0 .33-1.82l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span>Settings</span>
            </Link>
          </nav>
        </aside>
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="btn btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M12 8v8M8 12h8" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="card">
              <h3 className="text-muted-foreground text-sm mb-1">Total Users</h3>
              <p className="text-3xl font-bold">1,247</p>
              <p className="text-green-500 text-sm mt-1">+12% from last month</p>
            </div>
            
            <div className="card">
              <h3 className="text-muted-foreground text-sm mb-1">Active Projects</h3>
              <p className="text-3xl font-bold">892</p>
              <p className="text-green-500 text-sm mt-1">+8% from last month</p>
            </div>
            
            <div className="card">
              <h3 className="text-muted-foreground text-sm mb-1">AI Generations</h3>
              <p className="text-3xl font-bold">15,243</p>
              <p className="text-green-500 text-sm mt-1">+15% from last month</p>
            </div>
            
            <div className="card">
              <h3 className="text-muted-foreground text-sm mb-1">Revenue</h3>
              <p className="text-3xl font-bold">$24,891</p>
              <p className="text-green-500 text-sm mt-1">+22% from last month</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              
              <div className="space-y-4">
                {[
                  { action: "Created new project", user: "John Doe", time: "2 hours ago", type: "project" },
                  { action: "Generated 3D model", user: "Jane Smith", time: "4 hours ago", type: "generation" },
                  { action: "Exported to Unity", user: "Mike Johnson", time: "1 day ago", type: "export" },
                  { action: "Updated profile", user: "Sarah Wilson", time: "1 day ago", type: "user" },
                  { action: "Created workflow", user: "Alex Chen", time: "2 days ago", type: "workflow" }
                ].map(activity => (
                  <div key={activity.action} className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {activity.type === "project" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <line x1="3" y1="9" x2="21" y2="9" />
                          <line x1="9" y1="21" x2="9" y2="9" />
                        </svg>
                      )}
                      {activity.type === "generation" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7.5 20.5 2 22l1.5-5.5L9.5 14l11.5-11.5" />
                        </svg>
                      )}
                      {activity.type === "export" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      )}
                      {activity.type === "user" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      )}
                      {activity.type === "workflow" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <path d="M12 2v4" />
                          <path d="M12 18v4" />
                          <path d="M4.93 4.93l2.83 2.83" />
                          <path d="M16.24 16.24l2.83 2.83" />
                          <path d="M2 12h4" />
                          <path d="M18 12h4" />
                          <path d="M4.93 19.07l2.83-2.83" />
                          <path d="M16.24 7.76l2.83-2.83" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">by {activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">System Status</h2>
              
              <div className="space-y-4">
                {[
                  { name: "Database", status: "online", uptime: "99.9%" },
                  { name: "Redis", status: "online", uptime: "99.9%" },
                  { name: "MinIO", status: "online", uptime: "99.8%" },
                  { name: "Celery", status: "online", uptime: "99.7%" },
                  { name: "WebSocket", status: "online", uptime: "99.9%" }
                ].map(service => (
                  <div key={service.name} className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors">
                    <span className="font-medium">{service.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        service.status === "online" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {service.status}
                      </span>
                      <span className="text-sm text-muted-foreground">{service.uptime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}