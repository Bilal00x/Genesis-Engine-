"""
Billing Settings Page
"""

import { useState } from "react";
import Link from "next/link";

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  const subscription = {
    plan: "pro",
    status: "active",
    current_period_start: "2026-07-01",
    current_period_end: "2026-08-01",
    cancel_at_period_end: false,
    credits: 2000,
    used_credits: 456,
    remaining_credits: 1544,
    stripe_customer_id: "cus_123456789",
    stripe_subscription_id: "sub_123456789"
  };
  
  const plans = [
    { 
      id: "free", 
      name: "Free", 
      price: 0, 
      description: "Perfect for getting started", 
      features: [
        "100 AI generations per month",
        "Basic 3D generation",
        "1GB storage",
        "Community support"
      ],
      limits: {
        monthly_credits: 100,
        max_resolution: 1024,
        max_file_size: 10485760,
        projects: 5,
        storage_gb: 1
      }
    },
    { 
      id: "starter", 
      name: "Starter", 
      price: 29, 
      description: "Perfect for indie developers", 
      features: [
        "500 AI generations per month",
        "Advanced 3D generation",
        "10GB storage",
        "Priority support",
        "Team collaboration"
      ],
      limits: {
        monthly_credits: 500,
        max_resolution: 2048,
        max_file_size: 52428800,
        projects: 20,
        storage_gb: 10
      }
    },
    { 
      id: "pro", 
      name: "Pro", 
      price: 99, 
      description: "For professional studios", 
      features: [
        "Unlimited AI generations",
        "Enterprise 3D generation",
        "100GB storage",
        "Dedicated support",
        "Team collaboration",
        "Custom AI models",
        "API access"
      ],
      limits: {
        monthly_credits: -1,
        max_resolution: 4096,
        max_file_size: 104857600,
        projects: -1,
        storage_gb: 100
      }
    },
    { 
      id: "enterprise", 
      name: "Enterprise", 
      price: 299, 
      description: "For large studios and companies", 
      features: [
        "Unlimited AI generations",
        "Custom AI models",
        "Unlimited storage",
        "Dedicated support",
        "On-premise deployment",
        "SLA guarantee",
        "White-labeling"
      ],
      limits: {
        monthly_credits: -1,
        max_resolution: -1,
        max_file_size: -1,
        projects: -1,
        storage_gb: -1
      }
    }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Billing & Subscriptions</h1>
        <button className="btn btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Payment History
        </button>
      </div>
      
      <div className="flex border-b mb-6">
        <button 
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "overview" 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-text'
          }`}
        >
          Overview
        </button>
        
        <button 
          onClick={() => setActiveTab("plans")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "plans" 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-text'
          }`}
        >
          Plans
        </button>
        
        <button 
          onClick={() => setActiveTab("payment-methods")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "payment-methods" 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-text'
          }`}
        >
          Payment Methods
        </button>
        
        <button 
          onClick={() => setActiveTab("invoices")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "invoices" 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-text'
          }`}
        >
          Invoices
        </button>
      </div>
      
      <div className="flex-1">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subscription Status */}
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Subscription Status</h2>
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-medium">{plans.find(p => p.id === subscription.plan)?.name} Plan</h3>
                    <p className="text-muted-foreground">{subscription.status === "active" ? "Active" : "Inactive"}</p>
                  </div>
                  
                  <div className="text-right">
                    {subscription.status === "active" ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Current Period</p>
                    <p className="font-medium">
                      {new Date(subscription.current_period_start).toLocaleDateString()} -
                      {new Date(subscription.current_period_end).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Next Billing Date</p>
                    <p className="font-medium">
                      {new Date(subscription.current_period_end).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setShowUpgradeModal(true)}
                    className="btn btn-outline"
                  >
                    Change Plan
                  </button>
                  
                  <button 
                    onClick={() => setShowCancelModal(true)}
                    className="btn btn-destructive"
                  >
                    Cancel Subscription
                  </button>
                </div>
              </div>
            </div>
            
            {/* Credits */}
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Credits</h2>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Available</span>
                    <span className="font-medium">{subscription.remaining_credits}</span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(subscription.used_credits / subscription.credits) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Used this month</span>
                  <span>{subscription.used_credits} / {subscription.credits}</span>
                </div>
                
                <div className="mt-4">
                  <button className="btn btn-outline w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Buy More Credits
                  </button>
                </div>
              </div>
              
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Usage</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI Generations</span>
                    <span className="font-medium">241</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">3D Model Exports</span>
                    <span className="font-medium">18</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Asset Exports</span>
                    <span className="font-medium">32</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Project Exports</span>
                    <span className="font-medium">5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "plans" && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Choose a Plan</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map(plan => (
                <div 
                  key={plan.id} 
                  className={`border rounded-lg p-6 transition-colors ${
                    plan.id === subscription.plan 
                      ? 'border-primary shadow-lg' 
                      : 'border-muted hover:border-primary'
                  }`}
                >
                  <div className="text-center mb-4">
                    <h3 className="font-medium text-lg">{plan.name}</h3>
                    {plan.id === subscription.plan && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium mt-2 inline-block">
                        Current Plan
                      </span>
                    )}
                  </div>
                  
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map(feature => (
                      <li key={feature} className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.id === subscription.plan ? (
                    <button className="btn btn-outline w-full">
                      Manage Plan
                    </button>
                  ) : (
                    <button 
                      onClick={() => setShowUpgradeModal(true)}
                      className="btn btn-primary w-full"
                    >
                      Upgrade to {plan.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === "payment-methods" && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                    <div>
                      <h3 className="font-medium">Visa ending in 4242</h3>
                      <p className="text-sm text-muted-foreground">Expires 04/2027</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="text-xs text-primary hover:text-primary/80">
                      Set as default
                    </button>
                    <button className="text-xs text-muted-foreground hover:text-text">
                      Edit
                    </button>
                    <button className="text-xs text-destructive hover:text-destructive/80">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
              
              <button className="btn btn-outline w-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add Payment Method
              </button>
            </div>
          </div>
        )}
        
        {activeTab === "invoices" && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Invoices</h2>
            
            <div className="space-y-4">
              {[
                { id: "inv_1", date: "2026-07-01", amount: 99, status: "paid", download_url: "/invoices/inv_1.pdf" },
                { id: "inv_2", date: "2026-06-01", amount: 99, status: "paid", download_url: "/invoices/inv_2.pdf" },
                { id: "inv_3", date: "2026-05-01", amount: 99, status: "paid", download_url: "/invoices/inv_3.pdf" },
                { id: "inv_4", date: "2026-04-01", amount: 99, status: "paid", download_url: "/invoices/inv_4.pdf" },
                { id: "inv_5", date: "2026-03-01", amount: 99, status: "paid", download_url: "/invoices/inv_5.pdf" }
              ].map(invoice => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">#{invoice.id}</p>
                      <p className="text-sm text-muted-foreground">{new Date(invoice.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${invoice.amount}</p>
                      <p className="text-sm text-muted-foreground">{invoice.status}</p>
                    </div>
                  </div>
                  
                  <button className="btn btn-outline">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Upgrade Plan Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Upgrade Plan</h2>
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="text-muted-foreground hover:text-text"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              <p className="text-muted-foreground">
                You're currently on the {plans.find(p => p.id === subscription.plan)?.name} plan. Choose a new plan to upgrade.
              </p>
              
              <div className="space-y-4">
                {plans.filter(p => p.id !== subscription.plan).map(plan => (
                  <div 
                    key={plan.id} 
                    className="p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors"
                    onClick={() => {
                      // Handle upgrade
                      setShowUpgradeModal(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground">${plan.price}/month</p>
                      </div>
                      
                      <button className="btn btn-primary text-sm">
                        Upgrade
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Cancel Subscription</h2>
              <button 
                onClick={() => setShowCancelModal(false)}
                className="text-muted-foreground hover:text-text"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <h3 className="font-medium mb-2">Are you sure you want to cancel your subscription?</h3>
                <p className="text-sm text-destructive/80">
                  Your subscription will remain active until the end of your current billing period. After that, you'll lose access to premium features and your credits will be reset.
                </p>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 btn btn-outline"
                >
                  Keep Subscription
                </button>
                <button 
                  type="button"
                  className="flex-1 btn btn-destructive"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}