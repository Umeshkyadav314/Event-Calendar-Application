import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { CalendarIcon } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="bg-gray-700 p-4">
      <div className="container mx-auto flex justify-between items-center text-white">
        <div className="flex items-center space-x-2">
        <CalendarIcon className="h-6 w-6" />
        <h1 className="text-xl font-bold">Event Calendar</h1>
        </div>
        <div className="space-x-10 ">
          <a href="/" className="mx-3 text-white">
            Home
          </a>
          <a href="/" className="mx-3 text-white">
            Calendar
          </a>
          <a href="/" className="mx-3 text-white">
            Events
          </a>
        </div>
        <ThemeToggle  />
      </div>
    </nav>
  );
};
