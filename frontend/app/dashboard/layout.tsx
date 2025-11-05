/**
 * Dashboard Layout
 * 
 * Protected layout for authenticated dashboard pages.
 * Requires wallet connection for access. Implements wallet-based
 * authentication guard and provides consistent dashboard UI structure.
 * 
 * @module app/dashboard/layout
 */

'use client';

import { ReactNode } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import WalletGuard from '@/components/auth/WalletGuard';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <WalletGuard>
            <div className="min-h-screen bg-black">
                {/* Sidebar */}
                <DashboardSidebar />

                {/* Main Content Area */}
                <div className="lg:pl-64">
                    {/* Header */}
                    <DashboardHeader />

                    {/* Page Content */}
                    <main className="min-h-[calc(100vh-4rem)]">
                        {children}
                    </main>
                </div>
            </div>
        </WalletGuard>
    );
}
