import { useEffect, useState } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, LineElement, PointElement,
  CategoryScale, LinearScale, Tooltip, Legend, Filler
} from 'chart.js';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { getMonthlySummary } from '../api/summary';
import { getExpenses } from '../api/expenses';

ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);

const CATEGORY_COLORS = ['#8b5cf6', '#3b82f6', '#f59e0b', '#ec4899', '#10b981', '#6b7280'];

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const month = currentMonth();

  useEffect(() => {
    async function load() {
      try {
        const [summaryRes, expensesRes] = await Promise.all([
          getMonthlySummary(month),
          getExpenses({ startDate: `${month}-01`, endDate: `${month}-31` }),
        ]);
        setSummary(summaryRes.data);
        setRecentExpenses(expensesRes.data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [month]);

  if (loading) {
    return (
      <Layout>
        <p className="text-gray-400">Loading...</p>
      </Layout>
    );
  }

  const donutData = {
    labels: summary?.categoryBreakdown.map((c) => c.categoryName) || [],
    datasets: [
      {
        data: summary?.categoryBreakdown.map((c) => c.amount) || [],
        backgroundColor: CATEGORY_COLORS,
        borderWidth: 0,
      },
    ],
  };

  const trendData = {
    labels: recentExpenses.map((e) => new Date(e.date).getDate()).reverse(),
    datasets: [
      {
        data: recentExpenses.map((e) => e.amount).reverse(),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#6b7280' } },
      y: { grid: { color: '#2a2a38' }, ticks: { color: '#6b7280' } },
    },
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-gray-400 text-sm">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Spent"
          value={`$${summary?.totalSpent?.toFixed(2) || '0.00'}`}
        />
        <StatCard
          label="This Month Budget"
          value={`$${summary?.totalBudget?.toFixed(2) || '0.00'}`}
        />
        <StatCard
          label="Remaining"
          value={`$${summary?.remaining?.toFixed(2) || '0.00'}`}
          sublabel={summary?.remaining >= 0 ? 'On track' : 'Over budget'}
          sublabelColor={summary?.remaining >= 0 ? 'text-green-400' : 'text-red-400'}
        />
        <StatCard
          label="Total Transactions"
          value={summary?.totalTransactions || 0}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#13131a] border border-[#2a2a38] rounded-xl p-5">
          <h3 className="font-semibold mb-4">Spending by Category</h3>
          {summary?.categoryBreakdown?.length > 0 ? (
            <div className="flex items-center gap-6">
              <div className="w-40 h-40">
                <Doughnut data={donutData} options={{ plugins: { legend: { display: false } }, cutout: '70%' }} />
              </div>
              <div className="space-y-2 flex-1">
                {summary.categoryBreakdown.map((c, i) => (
                  <div key={c.categoryId} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
                      <span className="text-gray-300">{c.categoryName}</span>
                    </div>
                    <span className="text-gray-400">${c.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No expenses yet this month</p>
          )}
        </div>

        <div className="bg-[#13131a] border border-[#2a2a38] rounded-xl p-5">
          <h3 className="font-semibold mb-4">Expense Trend</h3>
          {recentExpenses.length > 0 ? (
            <Line data={trendData} options={chartOptions} />
          ) : (
            <p className="text-gray-500 text-sm">No data to display</p>
          )}
        </div>
      </div>

      <div className="bg-[#13131a] border border-[#2a2a38] rounded-xl p-5">
        <h3 className="font-semibold mb-4">Recent Expenses</h3>
        {recentExpenses.length > 0 ? (
          <div className="space-y-3">
            {recentExpenses.map((e) => (
              <div key={e.id} className="flex items-center justify-between py-2 border-b border-[#2a2a38] last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{e.categoryIcon}</span>
                  <div>
                    <p className="text-sm font-medium">{e.description}</p>
                    <p className="text-xs text-gray-500">{e.categoryName} • {e.date}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-red-400">-${e.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No expenses yet</p>
        )}
      </div>
    </Layout>
  );
}