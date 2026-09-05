// components/dashboard/dashboard-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  Tags,
  Warehouse,
  Truck,
  MessageSquare,
  HelpCircle,
  Store,
  ChevronRight,
  Sparkles,
  Boxes,
  CreditCard,
  Bell,
  Shield,
  FolderTree,
  Tag,
  CircleDollarSign,
  Home,
  List,
  Plus,
  Grid2x2,
  Globe,
} from "lucide-react";
import { useState, useEffect } from "react";

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    url: "/dashboard/products",
    icon: Package,
    items: [
      {
        title: "All Products",
        url: "/dashboard/products",
        icon: List,
      },
      {
        title: "Add New",
        url: "/dashboard/products/new",
        icon: Plus,
      },
      {
        title: "Categories",
        url: "/dashboard/products/categories",
        icon: FolderTree,
      },
      {
        title: "Brands",
        url: "/dashboard/products/brands",
        icon: Tag,
      },
    ],
  },
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: ShoppingCart,
    // items: [
    //   {
    //     title: "All Orders",
    //     url: "/dashboard/orders",
    //     icon: List,
    //   },
    //   {
    //     title: "Pending",
    //     url: "/dashboard/orders?status=pending",
    //     icon: CircleDollarSign,
    //   },
    //   {
    //     title: "Processing",
    //     url: "/dashboard/orders?status=processing",
    //     icon: CircleDollarSign,
    //   },
    //   {
    //     title: "Shipped",
    //     url: "/dashboard/orders?status=shipped",
    //     icon: CircleDollarSign,
    //   },
    //   {
    //     title: "Delivered",
    //     url: "/dashboard/orders?status=delivered",
    //     icon: CircleDollarSign,
    //   },
    // ],
  },
  {
    title: "Customers",
    url: "/dashboard/customers",
    icon: Users,
    // items: [
    //   {
    //     title: "All Customers",
    //     url: "/dashboard/customers",
    //     icon: List,
    //   },
    //   {
    //     title: "Customer Groups",
    //     url: "/dashboard/customers/groups",
    //     icon: Grid2x2,
    //   },
    // ],
  },
  // {
  //   title: "Analytics",
  //   url: "/dashboard/analytics",
  //   icon: BarChart3,
  // },
  // {
  //   title: "Inventory",
  //   url: "/dashboard/inventory",
  //   icon: Warehouse,
  // },
  // {
  //   title: "Discounts",
  //   url: "/dashboard/discounts",
  //   icon: Tags,
  // },
  // {
  //   title: "Shipping",
  //   url: "/dashboard/shipping",
  //   icon: Truck,
  // },
  // {
  //   title: "Reviews",
  //   url: "/dashboard/reviews",
  //   icon: MessageSquare,
  // },
];

const settingsNavItems = [
  {
    title: "General",
    url: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Store Details",
    url: "/dashboard/settings/store",
    icon: Store,
  },
  {
    title: "Payments",
    url: "/dashboard/settings/payments",
    icon: CreditCard,
  },
  {
    title: "Shipping",
    url: "/dashboard/settings/shipping",
    icon: Truck,
  },
  {
    title: "Notifications",
    url: "/dashboard/settings/notifications",
    icon: Bell,
  },
  {
    title: "Security",
    url: "/dashboard/settings/security",
    icon: Shield,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Products: false,
    Orders: false,
    Customers: false,
    Settings: false,
  });

  // Auto-expand sections based on current path
  useEffect(() => {
    const newExpanded = { ...expandedSections };

    if (pathname.startsWith("/dashboard/products")) {
      newExpanded.Products = true;
    }
    if (pathname.startsWith("/dashboard/orders")) {
      newExpanded.Orders = true;
    }
    if (pathname.startsWith("/dashboard/customers")) {
      newExpanded.Customers = true;
    }
    if (pathname.startsWith("/dashboard/settings")) {
      newExpanded.Settings = true;
    }

    setExpandedSections(newExpanded);
  }, [pathname]);

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Check if a route is active
  const isRouteActive = (url: string) => {
    if (url.includes('?')) {
      const baseUrl = url.split('?')[0];
      return pathname === baseUrl || pathname.startsWith(baseUrl + '/');
    }
    return pathname === url || pathname.startsWith(url + '/');
  };

  // Check if a parent section is active (has active child)
  const isParentActive = (items?: any[]) => {
    if (!items) return false;
    return items.some(item => isRouteActive(item.url));
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Home className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">E-Commerce</span>
                  <span className="text-xs text-muted-foreground">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const hasSubItems = item.items && item.items.length > 0;
                const isExpanded = expandedSections[item.title] || false;
                const hasActiveChild = hasSubItems && isParentActive(item.items);

                if (hasSubItems) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => toggleSection(item.title)}
                        isActive={hasActiveChild && !isExpanded}
                        tooltip={item.title}
                      >
                        {item.icon && <item.icon className="size-4" />}
                        <span>{item.title}</span>
                        <ChevronRight
                          className={cn(
                            "ml-auto size-4 transition-transform",
                            isExpanded && "rotate-90"
                          )}
                        />
                      </SidebarMenuButton>

                      {isExpanded && (
                        <SidebarMenuSub>
                          {item.items.map((subItem) => {
                            const isActive = isRouteActive(subItem.url);
                            return (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive}
                                >
                                  <Link href={subItem.url}>
                                    {subItem.icon && <subItem.icon className="size-3 mr-2" />}
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  );
                }

                const isActive = isRouteActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        {item.icon && <item.icon className="size-4" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => toggleSection('Settings')}
                  isActive={isParentActive(settingsNavItems) && !expandedSections.Settings}
                  tooltip="Settings"
                >
                  <Settings className="size-4" />
                  <span>Settings</span>
                  <ChevronRight
                    className={cn(
                      "ml-auto size-4 transition-transform",
                      expandedSections.Settings && "rotate-90"
                    )}
                  />
                </SidebarMenuButton>

                {expandedSections.Settings && (
                  <SidebarMenuSub>
                    {settingsNavItems.map((item) => {
                      const isActive = isRouteActive(item.url);
                      return (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive}
                          >
                            <Link href={item.url}>
                              {item.icon && <item.icon className="size-3 mr-2" />}
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/products/new">
                    <Sparkles className="size-4" />
                    <span>Add Product</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/discounts/new">
                    <Tags className="size-4" />
                    <span>Create Discount</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/inventory">
                    <Boxes className="size-4" />
                    <span>Update Stock</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" target="_blank" className="text-muted-foreground">
                <Globe className="size-4" />
                <span>Visit Store</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton asChild tooltip="Help & Support">
              <Link href="/dashboard/help">
                <HelpCircle className="size-4" />
                <span>Help & Support</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}