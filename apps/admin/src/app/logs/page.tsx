"""
Audit Logs Admin Page
"""

import { useState } from "react";
import Link from "next/link";

export default function LogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState("all");
  const [selectedResource, setSelectedResource] = useState("all");
  const [dateRange, setDateRange] = useState("last_24_hours");
  
  const auditLogs = [
    { 
      id: "1", 
      user: "John Doe", 
      action: "create", 
      resource_type: "project", 
      resource_id: "1", 
      ip_address: "192.168.1.100", 
      created_at: "2026-07-22T10:30:00Z" 
    },
    { 
      id: "2", 
      user: "Jane Smith", 
      action: "read", 
      resource_type: "asset", 
      resource_id: "5", 
      ip_address: "192.168.1.101", 
      created_at: "2026-07-22T09:45:00Z" 
    },
    { 
      id: "3", 
      user: "Mike Johnson", 
      action: "generate", 
      resource_type: "generation", 
      resource_id: "12", 
      ip_address: "192.168.1.102", 
      created_at: "2026-07-22T08:20:00Z" 
    },
    { 
      id: "4", 
      user: "Sarah Wilson", 
      action: "export", 
      resource_type: "export", 
      resource_id: "8", 
      ip_address: "192.168.1.103", 
      created_at: "2026-07-22T07:15:00Z" 
    },
    { 
      id: "5", 
      user: "Alex Chen", 
      action: "update", 
      resource_type: "user", 
      resource_id: "3", 
      ip_address: "192.168.1.104", 
      created_at: "2026-07-22T06:40:00Z" 
    },
    { 
      id: "6", 
      user: "Lisa Brown", 
      action: "login", 
      resource_type: "user", 
      resource_id: "6", 
      ip_address: "192.168.1.105", 
      created_at: "2026-07-22T05:25:00Z" 
    },
    { 
      id: "7", 
      user: "John Doe", 
      action: "delete", 
      resource_type: "project", 
      resource_id: "2", 
      ip_address: "192.168.1.100", 
      created_at: "2026-07-21T22:10:00Z" 
    },
    { 
      id: "8", 
      user: "Jane Smith", 
      action: "create", 
      resource_type: "asset", 
      resource_id: "15", 
      ip_address: "192.168.1.101", 
      created_at: "2026-07-21T21:45:00Z" 
    },
    { 
      id: "9", 
      user: "Mike Johnson", 
      action: "generate", 
      resource_type: "generation", 
      resource_id: "13", 
      ip_address: "192.168.1.102", 
      created_at: "2026-07-21T20:30:00Z" 
    },
    { 
      id: "10", 
      user: "Sarah Wilson", 
      action: "export", 
      resource_type: "export", 
      resource_id: "9", 
      ip_address: "192.168.1.103", 
      created_at: "2026-07-21T19:15:00Z" 
    }
  ];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         log.resource_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = selectedAction === "all" || log.action === selectedAction;
    const matchesResource = selectedResource === "all" || log.resource_type === selectedResource;
    
    // Date range filtering
    const logDate = new Date(log.created_at);
    const now = new Date();
    
    let withinRange = true;
    if (dateRange === "last_24_hours") {
      withinRange = now.getTime() - logDate.getTime() <= 24 * 60 * 60 * 1000;
    } else if (dateRange === "last_7_days") {
      withinRange = now.getTime() - logDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
    } else if (dateRange === "last_30_days") {
      withinRange = now.getTime() - logDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
    }
    
    return matchesSearch && matchesAction && matchesResource && withinRange;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <button className="btn btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Export
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Search and Filter */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border bg-background text-text"
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="absolute left-3 top-2.5 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-4 py-2 rounded-md border bg-background text-text"
          >
            <option value="all">All Actions</option>
            <option value="create">Create</option>
            <option value="read">Read</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="generate">Generate</option>
            <option value="export">Export</option>
          </select>
          
          <select
            value={selectedResource}
            onChange={(e) => setSelectedResource(e.target.value)}
            className="px-4 py-2 rounded-md border bg-background text-text"
          >
            <option value="all">All Resources</option>
            <option value="user">User</option>
            <option value="project">Project</option>
            <option value="asset">Asset</option>
            <option value="generation">Generation</option>
            <option value="export">Export</option>
            <option value="workflow">Workflow</option>
          </select>
          
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 rounded-md border bg-background text-text"
          >
            <option value="last_24_hours">Last 24 Hours</option>
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>
      
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">User</th>
                <th className="text-left py-3 px-4 font-medium">Action</th>
                <th className="text-left py-3 px-4 font-medium">Resource</th>
                <th className="text-left py-3 px-4 font-medium">IP Address</th>
                <th className="text-left py-3 px-4 font-medium">Date</th>
                <th className="text-left py-3 px-4 font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id} className="border-b hover:bg-muted transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-medium">{log.user}</div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      log.action === "create" ? "bg-green-100 text-green-800" : 
                      log.action === "read" ? "bg-blue-100 text-blue-800" : 
                      log.action === "update" ? "bg-yellow-100 text-yellow-800" : 
                      log.action === "delete" ? "bg-red-100 text-red-800" : 
                      log.action === "login" ? "bg-purple-100 text-purple-800" : 
                      log.action === "generate" ? "bg-indigo-100 text-indigo-800" : 
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                    </span>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="font-medium">{log.resource_type}</div>
                    <div className="text-sm text-muted-foreground">#{log.resource_id}</div>
                  </td>
                  
                  <td className="py-4 px-4">
                    {log.ip_address}
                  </td>
                  
                  <td className="py-4 px-4">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  
                  <td className="py-4 px-4">
                    <button className="text-xs text-primary hover:text-primary/80">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No audit logs found
          </div>
        )}
      </div>
    </div>
  );
}