import { useEffect, useState } from 'react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, BarElement, LineElement, PointElement,
  CategoryScale, LinearScale, Tooltip, Legend, Filler
} from 'chart.js';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { getMonthlySummary } from '../api/summary';
import { getBudgets } from '../api/budgets';
import { getExpenses } from '../api/expenses';

ChartJS.register(ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);

const CATEGORY_COLORS = ['#8b5cf6', '#3b82f6', '#f59e0b', '#ec4899', '#10b981', '#6b7280', '#ef4444', '#14b8a6'];

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [monthExpenses, setMonthExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const month = currentMonth();

  const loadData = async () => {
    setLoading(true);
    try {
      const [summaryRes, budgetsRes, expensesRes] = await Promise.all([
        getMonthlySummary(month),
        getBudgets(month),
        getExpenses({ startDate: `${month}-01`, endDate: `${month}-31` }),
      ]);
      setSummary(summaryRes.data);
      setBudgets(budgetsRes.data);
      setMonthExpenses(expensesRes.data);
    } catch (err) {
      console.error('Failed to load reports data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const budgetVsSpentData = {
    labels: budgets.map((b) => b.categoryName),
    datasets: [
      {
        label: 'Budget',
        data: budgets.map((b) => b.limitAmount),
        backgroundColor: '#3b82f6',
        borderRadius: 4,
      },
      {
        label: 'Spent',
        data: budgets.map((b) => b.spentAmount),
        backgroundColor: '#8b5cf6',
        borderRadius: 4,
      },
    ],
  };

  const sortedExpenses = [...monthExpenses].sort((a, b) => new Date(a.date) - new Date(b.date));
  const trendData = {
    labels: sortedExpenses.map((e) => new Date(e.date).getDate()),
    datasets: [
      {
        data: sortedExpenses.map((e) => e.amount),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#9ca3af', usePointStyle: true } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#6b7280' } },
      y: { grid: { color: '#2a2a38' }, ticks: { color: '#6b7280' } },
    },
  };

  const lineOptions = {
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
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-gray-400 text-sm">Detailed insights of your spending</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Spent" value={`$${summary?.totalSpent?.toFixed(2) || '0.00'}`} />
        <StatCard label="Total Budget" value={`$${summary?.totalBudget?.toFixed(2) || '0.00'}`} />
        <StatCard
          label="Remaining"
          value={`$${summary?.remaining?.toFixed(2) || '0.00'}`}
          sublabel={summary?.remaining >= 0 ? 'On track' : 'Over budget'}
          sublabelColor={summary?.remaining >= 0 ? 'text-green-400' : 'text-red-400'}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#13131a] border border-[#2a2a38] rounded-xl p-5">
          <h3 className="font-semibold mb-4">Spending by Category</h3>
          {summary?.categoryBreakdown?.length > 0 ? (
            <div className="w-48 h-48 mx-auto">
              <Doughnut data={donutData} options={{ plugins: { legend: { display: false } }, cutout: '65%' }} />
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No data yet</p>
          )}
        </div>

        <div className="bg-[#13131a] border border-[#2a2a38] rounded-xl p-5">
          <h3 className="font-semibold mb-4">Category vs Budget</h3>
          {budgets.length > 0 ? (
            <Bar data={budgetVsSpentData} options={barOptions} />
          ) : (
            <p className="text-gray-500 text-sm">No budgets set this month</p>
          )}
        </div>
      </div>

      <div className="bg-[#13131a] border border-[#2a2a38] rounded-xl p-5">
        <h3 className="font-semibold mb-4">Top Spending Trends</h3>
        {sortedExpenses.length > 0 ? (
          <Line data={trendData} options={lineOptions} />
        ) : (
          <p className="text-gray-500 text-sm">No expenses to show</p>
        )}
      </div>
    </Layout>
  );
}