"use client";
import React, { useState } from "react";
import {
  Bell,
  Menu,
  User,
  Settings,
  LogOut,
  Plus,
  Compass,
  Users,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Mock data for demo
const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "/api/placeholder/32/32",
  initials: "JD",
};

const mockNotifications = [
  {
    id: 1,
    message: "New comment on your post",
    time: "2 min ago",
    isRead: false,
  },
  {
    id: 2,
    message: "Someone liked your photo",
    time: "1 hour ago",
    isRead: false,
  },
  {
    id: 3,
    message: "You have a new follower",
    time: "3 hours ago",
    isRead: true,
  },
];

const unreadCount = mockNotifications.filter((n) => !n.isRead).length;

const NavBar = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const navigationItems = [
    { label: "Dashboard", href: "/", icon: BarChart3 },
    { label: "Create", href: "/create", icon: Plus },
    { label: "Explore", href: "/explore", icon: Compass },
    { label: "Following", href: "/following", icon: Users },
    { label: "Account", href: "/account", icon: Settings },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  const handleNotificationClick = (notificationId: number) => {
    console.log(`Notification ${notificationId} clicked`);
    setIsNotificationOpen(false);
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between px-12">
        {/* Left - Logo */}
        <div className="flex items-center space-x-12">
          <div className="w-30 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-base">Notify</span>
          </div>
          <span className="hidden sm:block font-bold text-xl">NotifyApp</span>
        </div>

        {/* Center - Navigation Items */}
        <div className="hidden md:flex flex-grow items-center justify-center space-x-13">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.label}
                variant="ghost"
                className="flex items-center space-x-2 font-medium text-lg px-4 py-3 cursor-pointer"
                onClick={() => handleNavigation(item.href)}
              >
                <Icon className="h-10 w-10" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Right - Notifications, Profile, Mobile Menu */}
        <div className="flex items-center space-x-3">
          {/* Notification Bell */}
          <DropdownMenu
            open={isNotificationOpen}
            onOpenChange={setIsNotificationOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-12 w-12"
                aria-label="Notifications"
              >
                <Bell className="h-9 w-9 cursor-pointer" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center text-xs p-0"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-background">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {mockNotifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start p-3 cursor-pointer"
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-base ${
                        !notification.isRead
                          ? "font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {notification.message}
                    </span>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground mt-1">
                    {notification.time}
                  </span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center justify-center cursor-pointer">
                <Button variant="ghost" size="sm">
                  View all notifications
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-15 w-15 rounded-full"
                aria-label="User menu"
              >
                <Avatar className="h-15 w-15">
                  <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                  <AvatarFallback>{mockUser.initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 bg-background">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-base font-medium leading-none">
                    {mockUser.name}
                  </p>
                  <p className="text-sm leading-none text-muted-foreground">
                    {mockUser.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleNavigation("/profile")}>
                <User className="mr-2 h-5 w-5" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigation("/account")}>
                <Settings className="mr-2 h-5 w-5" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-5 w-5" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-12 w-12"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-6">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.label}
                      variant="ghost"
                      className="justify-start space-x-2 font-medium text-lg py-3"
                      onClick={() => handleNavigation(item.href)}
                    >
                      <Icon className="h-6 w-6" />
                      <span>{item.label}</span>
                    </Button>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
