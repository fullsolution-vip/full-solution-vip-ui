import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account")({
  component: AccountPage,
});

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Package, Heart, Settings, LogOut, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { getSupabase } from "@/lib/supabase";

export function AccountPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);

  // Try to get user on mount
  useState(() => {
    const supabase = getSupabase();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  });

  const handleLogout = async () => {
    setLoading(true);
    try {
      const supabase = getSupabase();
      await supabase.auth.signOut();
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  };

  // If no user, show login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-secondary/30 py-12">
        <div className="container max-w-md px-4">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>
                Please sign in to view your account
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/signup">Create Account</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 py-12">
      <div className="container max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-4">
                {/* User Info */}
                <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Account</p>
                    <p className="text-sm text-muted">{user.email}</p>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                  <button className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary/10 text-primary w-full text-left">
                    <User className="h-4 w-4" />
                    <span className="text-sm">Profile</span>
                  </button>
                  <button className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground w-full text-left">
                    <Package className="h-4 w-4" />
                    <span className="text-sm">Orders</span>
                  </button>
                  <button className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground w-full text-left">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">Wishlist</span>
                  </button>
                  <button className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground w-full text-left">
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">Settings</span>
                  </button>
                </nav>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-error w-full mt-4 hover:bg-error/10"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  <span className="text-sm">Sign Out</span>
                </button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Manage your account details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={user.email || ""}
                          disabled
                        />
                      </div>
                      <Button type="submit">Save Changes</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>
                      View and track your orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No orders yet</p>
                      <Button asChild className="mt-4">
                        <Link to="/products">Browse Products</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Wishlist Tab */}
              <TabsContent value="wishlist">
                <Card>
                  <CardHeader>
                    <CardTitle>Wishlist</CardTitle>
                    <CardDescription>
                      Your saved products
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted">
                      <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Your wishlist is empty</p>
                      <Button asChild className="mt-4">
                        <Link to="/products">Browse Products</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;