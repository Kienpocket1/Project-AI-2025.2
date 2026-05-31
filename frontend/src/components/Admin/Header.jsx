import React from "react";
import { Bell } from "lucide-react";
import { cn } from "./utils";

export default function Header({ className }) {
  return (
    <header className={cn("h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8", className)}>
      <h1 className="text-xl font-bold text-slate-900">Metro Madrid Admin Dashboard</h1>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}
