"""
Users Admin Page
"""

import { useState } from "react";
import Link from "next/link";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  const users = [
    { 
      id: "1", 
      email: "john.doe@aigamestudio.com", 
      display_name: "John Doe", 
      role: "admin", 
      credits: 10000, 
      organization: "AI Game Studio", 
      created: "2026-07-01", 
      last_login: "2026-07-22", 
      avatar: "/assets/avatars/john.jpg" 
    },
    { 
      id: "2", 
      email: "jane.smith@aigamestudio.com", 
      display_name: "Jane Smith", 
      role: "user", 
      credits: 500, 
      organization: "AI Game Studio", 
      created: "2026-06-15", 
      last_login: "2026-07-21", 
      avatar: "/assets/avatars/jane.jpg" 
    },
    { 
      id: "3", 
      email: "mike.johnson@aigamestudio.com", 
      display_name: "Mike Johnson", 
      role: "user", 
      credits: 300, 
      organization: "AI Game Studio", 
      created: "2026-06-10", 
      last_login: "2026-07-20", 
      avatar: "/assets/avatars/mike.jpg" 
    },
    { 
      id: "4", 
      email: "sarah.wilson@aigamestudio.com", 
      display_name: "Sarah Wilson", 
      role: "user", 
      credits: 200, 
      organization: "AI Game Studio", 
      created: "2026-05-20", 
      last_login: "2026-07-19", 
      avatar: "/assets/avatars/sarah.jpg" 
    },
    { 
      id: "5", 
      email: "alex.chen@aigamestudio.com", 
      display_name: "Alex Chen", 
      role: "user", 
      credits: 100, 
      organization: "AI Game Studio", 
      created: "2026-04-15", 
      last_login: "2026-07-18", 
      avatar: "/assets/avatars/alex.jpg" 
    },
    { 
      id: "6", 
      email: "lisa.brown@aigamestudio.com", 
      display_name: "Lisa Brown", 
      role: "user", 
      credits: 50, 
      organization: "AI Game Studio", 
      created: "2026-03-10", 
      last_login: "2026-07-17", 
      avatar: "/assets/avatars/lisa.jpg" 
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.display_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <button 
          onClick={() => setShowInviteModal(true)}
          className="btn btn-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Invite User
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Search and Filter */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search users..."
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
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 rounded-md border bg-background text-text"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
      </div>
      
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">User</th>
                <th className="text-left py-3 px-4 font-medium">Role</th>
                <th className="text-left py-3 px-4 font-medium">Credits</th>
                <th className="text-left py-3 px-4 font-medium">Organization</th>
                <th className="text-left py-3 px-4 font-medium">Created</th>
                <th className="text-left py-3 px-4 font-medium">Last Login</th>
                <th className="text-left py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b hover:bg-muted transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={user.avatar} 
                        alt={user.display_name} 
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-medium">{user.display_name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === "admin" ? "bg-red-100 text-red-800" : 
                      user.role === "user" ? "bg-blue-100 text-blue-800" : 
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  
                  <td className="py-4 px-4">
                    {user.credits}
                  </td>
                  
                  <td className="py-4 px-4">
                    {user.organization}
                  </td>
                  
                  <td className="py-4 px-4">
                    {new Date(user.created).toLocaleDateString()}
                  </td>
                  
                  <td className="py-4 px-4">
                    {new Date(user.last_login).toLocaleDateString()}
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-xs text-primary hover:text-primary/80">
                        Edit
                      </button>
                      <button className="text-xs text-destructive hover:text-destructive/80">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No users found
          </div>
        )}
      </div>
      
      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Invite User</h2>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="text-muted-foreground hover:text-text"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 rounded-md border bg-background text-text"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-1">Role</label>
                <select
                  id="role"
                  className="w-full px-3 py-2 rounded-md border bg-background text-text"
                >
                  <option value="user">User</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 btn btn-outline"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 btn btn-primary"
                >
                  Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}