"""
Generations Page
"""

import { useState } from "react";
import Link from "next/link";

export default function GenerationsPage() {
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  const generations = [
    {
      id: "gen_1",
      type: "image",
      prompt: "A fantasy warrior character with glowing blue armor",
      status: "completed",
      provider: "flux",
      thumbnail_url: null,
      created_at: "2026-07-23T10:30:00Z",
      credits_used: 1,
    },
    {
      id: "gen_2",
      type: "3d_model",
      prompt: "Medieval castle tower with stone textures",
      status: "completed",
      provider: "meshy",
      thumbnail_url: null,
      created_at: "2026-07-23T09:15:00Z",
      credits_used: 10,
    },
    {
      id: "gen_3",
      type: "texture",
      prompt: "Seamless grass texture with wildflowers",
      status: "processing",
      provider: "stability",
      thumbnail_url: null,
      created_at: "2026-07-23T08:45:00Z",
      credits_used: 3,
    },
    {
      id: "gen_4",
      type: "image",
      prompt: "Sci-fi spaceship interior cockpit view",
      status: "failed",
      provider: "openai",
      thumbnail_url: null,
      created_at: "2026-07-22T16:20:00Z",
      credits_used: 0,
    },
    {
      id: "gen_5",
      type: "3d_model",
      prompt: "Low-poly tree with autumn leaves",
      status: "completed",
      provider: "tripo",
      thumbnail_url: null,
      created_at: "2026-07-22T14:10:00Z",
      credits_used: 10,
    },
    {
      id: "gen_6",
      type: "image",
      prompt: "Dark dungeon environment with torches",
      status: "completed",
      provider: "flux",
      thumbnail_url: null,
      created_at: "2026-07-22T12:00:00Z",
      credits_used: 1,
    },
  ];

  const filteredGenerations = filter === "all"
    ? generations
    : generations.filter(g => g.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Generations</h1>
          <p className="text-text-muted mt-1">View and manage your AI-generated assets</p>
        </div>
        <Link href="/editor" className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Generation
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {["all", "image", "3d_model", "texture", "animation"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-text-muted hover:text-text"
              }`}
            >
              {type === "all" ? "All" : type === "3d_model" ? "3D Models" : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-md ${view === "grid" ? "bg-card" : "text-text-muted"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-md ${view === "list" ? "bg-card" : "text-text-muted"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredGenerations.map((gen) => (
            <div key={gen.id} className="card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium line-clamp-2">{gen.prompt}</p>
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span className="capitalize">{gen.type.replace("_", " ")}</span>
                  <span>{gen.provider}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    gen.status === "completed" ? "bg-green-500/10 text-green-500" :
                    gen.status === "processing" ? "bg-blue-500/10 text-blue-500" :
                    gen.status === "failed" ? "bg-red-500/10 text-red-500" :
                    "bg-gray-500/10 text-gray-500"
                  }`}>
                    {gen.status}
                  </span>
                  <span className="text-xs text-text-muted">{gen.credits_used} credits</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredGenerations.map((gen) => (
            <div key={gen.id} className="card flex items-center space-x-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{gen.prompt}</p>
                <div className="flex items-center space-x-4 text-sm text-text-muted mt-1">
                  <span className="capitalize">{gen.type.replace("_", " ")}</span>
                  <span>{gen.provider}</span>
                  <span>{new Date(gen.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  gen.status === "completed" ? "bg-green-500/10 text-green-500" :
                  gen.status === "processing" ? "bg-blue-500/10 text-blue-500" :
                  gen.status === "failed" ? "bg-red-500/10 text-red-500" :
                  "bg-gray-500/10 text-gray-500"
                }`}>
                  {gen.status}
                </span>
                <span className="text-sm text-text-muted">{gen.credits_used} credits</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredGenerations.length === 0 && (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-text-muted mb-4">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <h3 className="text-lg font-medium mb-2">No generations found</h3>
          <p className="text-text-muted mb-4">Start creating with AI-powered generation tools</p>
          <Link href="/editor" className="btn btn-primary">
            Create your first generation
          </Link>
        </div>
      )}
    </div>
  );
}
