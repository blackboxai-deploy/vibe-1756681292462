'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { authService } from '@/lib/auth';
import { MEDICAL_SPECIALTIES } from '@/lib/specialists';
import { User } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    authService.logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">HealthcareAI</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.specialty}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name.split(' ')[0]}
          </h2>
          <p className="text-gray-600">
            Choose a medical specialty to start your AI-assisted consultation
          </p>
        </div>

        {/* User Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Profile Information</span>
              <Link href="/profile">
                <Button variant="outline" size="sm">Edit Profile</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-4">
              {user.specialty && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Specialty:</span>
                  <Badge variant="secondary" className="ml-2">{user.specialty}</Badge>
                </div>
              )}
              {user.credentials && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Credentials:</span>
                  <span className="ml-2 text-sm text-gray-900">{user.credentials}</span>
                </div>
              )}
              {user.hospital && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Hospital:</span>
                  <span className="ml-2 text-sm text-gray-900">{user.hospital}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Medical Specialties */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">AI Medical Specialists</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MEDICAL_SPECIALTIES.map((specialty) => (
              <Link key={specialty.id} href={`/chat/${specialty.id}`}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-3">{specialty.icon}</div>
                    <CardTitle className="text-lg">{specialty.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-sm mb-4">
                      {specialty.description}
                    </CardDescription>
                    <div className={`w-full h-2 rounded-full ${specialty.color} opacity-20 mb-3`}></div>
                    <Button variant="outline" size="sm" className="w-full">
                      Start Consultation
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Consultations</CardTitle>
              <CardDescription>Your latest AI chat sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No recent consultations</p>
                <p className="text-xs mt-1">Start a chat to see your history here</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Features</CardTitle>
              <CardDescription>Available capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">AI Chat Assistants</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Medical Image Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Document Upload</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Session History</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Export Consultations</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}