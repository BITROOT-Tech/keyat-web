// src/app/landlord/earnings/page.tsx - EARNINGS & ANALYTICS
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, Wallet, Calendar, Download, Filter,
  BarChart3, PieChart, DollarSign, Users, Building2,
  ArrowUpRight, ArrowDownRight, Eye, Sparkles
} from 'lucide-react';

interface FinancialData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  occupancy: number;
}

export default function EarningsPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('6m');
  const [activeChart, setActiveChart] = useState('revenue');

  const financialData: FinancialData[] = [
    { month: 'Sep 2023', revenue: 39500, expenses: 4200, profit: 35300, occupancy: 85 },
    { month: 'Oct 2023', revenue: 39500, expenses: 3800, profit: 35700, occupancy: 85 },
    { month: 'Nov 2023', revenue: 44300, expenses: 4500, profit: 39800, occupancy: 92 },
    { month: 'Dec 2023', revenue: 44300, expenses: 5200, profit: 39100, occupancy: 92 },
    { month: 'Jan 2024', revenue: 44300, expenses: 4100, profit: 40200, occupancy: 92 },
    { month: 'Feb 2024', revenue: 44300, expenses: 3800, profit: 40500, occupancy: 92 },
  ];

  const summaryStats = {
    totalRevenue: financialData.reduce((sum, item) => sum + item.revenue, 0),
    totalProfit: financialData.reduce((sum, item) => sum + item.profit, 0),
    avgOccupancy: Math.round(financialData.reduce((sum, item) => sum + item.occupancy, 0) / financialData.length),
    properties: 3,
    growth: 12.4
  };

  const portfolioBreakdown = [
    { property: 'The Residences', revenue: 14500, percentage: 33, occupancy: 100 },
    { property: 'Phakalane Villa', revenue: 25000, percentage: 56, occupancy: 100 },
    { property: 'City Center Studio', revenue: 4800, percentage: 11, occupancy: 0 },
  ];

  const recentTransactions = [
    { id: 1, property: 'The Residences', tenant: 'Sarah Johnson', amount: 14500, date: '2024-02-01', status: 'completed', type: 'rent' },
    { id: 2, property: 'Phakalane Villa', tenant: 'David Smith', amount: 25000, date: '2024-02-05', status: 'completed', type: 'rent' },
    { id: 3, property: 'Maintenance', tenant: 'Plumbing Services', amount: -1200, date: '2024-02-10', status: 'completed', type: 'expense' },
    { id: 4, property: 'City Center Studio', tenant: 'Security Services', amount: -800, date: '2024-02-15', status: 'pending', type: 'expense' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 safe-area-padding">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Earnings & Analytics</h1>
              <p className="text-slate-600">Track your property portfolio performance</p>
            </div>
            <div className="flex gap-2">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
              >
                <option value="3m">Last 3 Months</option>
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last Year</option>
                <option value="all">All Time</option>
              </select>
              <button className="px-4 py-3 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-600 text-sm">Total Revenue</div>
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">P{summaryStats.totalRevenue.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-emerald-600 text-sm">
                <ArrowUpRight className="h-3 w-3" />
                <span>+{summaryStats.growth}%</span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-600 text-sm">Net Profit</div>
                <Wallet className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">P{summaryStats.totalProfit.toLocaleString()}</div>
              <div className="text-slate-600 text-sm">After expenses</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-600 text-sm">Avg Occupancy</div>
                <Users className="h-4 w-4 text-violet-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{summaryStats.avgOccupancy}%</div>
              <div className="text-slate-600 text-sm">Portfolio rate</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-600 text-sm">Properties</div>
                <Building2 className="h-4 w-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{summaryStats.properties}</div>
              <div className="text-slate-600 text-sm">Active</div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="text-blue-100 text-sm">ROI</div>
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="text-2xl font-bold">8.7%</div>
              <div className="text-blue-100 text-sm">Annual return</div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-5 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Revenue & Profit</h3>
              <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveChart('revenue')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    activeChart === 'revenue' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setActiveChart('profit')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    activeChart === 'profit' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Profit
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {financialData.map((item, index) => (
                <div key={item.month} className="flex items-center justify-between">
                  <div className="text-sm font-medium text-slate-900 w-20">{item.month}</div>
                  <div className="flex-1 mx-4">
                    <div className="relative h-8 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                        style={{ width: `${(activeChart === 'revenue' ? item.revenue : item.profit) / 50000 * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm font-bold text-slate-900 w-20 text-right">
                    P{(activeChart === 'revenue' ? item.revenue : item.profit).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Portfolio Breakdown</h3>
            <div className="space-y-4">
              {portfolioBreakdown.map((item, index) => (
                <div key={item.property} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{item.property}</div>
                      <div className="text-slate-600 text-sm">{item.occupancy}% occupied</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">P{item.revenue.toLocaleString()}</div>
                    <div className="text-slate-600 text-sm">{item.percentage}% of revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
            <button className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    transaction.type === 'rent' 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-amber-100 text-amber-600'
                  }`}>
                    {transaction.type === 'rent' ? <DollarSign className="h-5 w-5" /> : <Wallet className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{transaction.property}</div>
                    <div className="text-slate-600 text-sm">{transaction.tenant}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${
                    transaction.amount > 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}P{Math.abs(transaction.amount).toLocaleString()}
                  </div>
                  <div className="text-slate-600 text-sm">{new Date(transaction.date).toLocaleDateString()}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  transaction.status === 'completed' 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                    : 'bg-amber-100 text-amber-700 border border-amber-200'
                }`}>
                  {transaction.status.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
