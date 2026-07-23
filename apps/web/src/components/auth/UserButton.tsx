"""
User Button Component
"""

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserButton() {
  return (
    <div className="flex items-center space-x-3">
      <Button variant="ghost" size="icon" className="rounded-full">
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </Button>
      
      <div className="hidden md:flex flex-col items-end">
        <span className="text-sm font-medium">John Doe</span>
        <span className="text-xs text-muted-foreground">Free Plan</span>
      </div>
      
      <Button variant="outline" size="sm" className="hidden md:block">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
          <path d="M12 8v8M8 12h8" />
        </svg>
        Upgrade
      </Button>
    </div>
  );
}