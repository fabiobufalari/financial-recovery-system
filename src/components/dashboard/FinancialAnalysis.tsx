import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

// Sample data - in a real application, this would come from an API
const monthlyData = [
  { month: 'Jan', income: 125000, expenses: 95000, profit: 30000 },
  { month: 'Feb', income: 132000, expenses: 98500, profit: 33500 },
  { month: 'Mar', income: 128000, expenses: 97000, profit: 31000 },
  { month: 'Apr', income: 135000, expenses: 99500, profit: 35500 },
  { month: 'May', income: 142000, expenses: 102000, profit: 40000 },
  { month: 'Jun', income: 138000, expenses: 100500, profit: 37500 }
];

const expenseCategories = [
  { name: 'Labor', value: 450000, color: '#0088FE' },
  { name: 'Materials', value: 320000, color: '#00C49F' },
  { name: 'Equipment', value: 150000, color: '#FFBB28' },
  { name: 'Permits', value: 50000, color: '#FF8042' },
  { name: 'Subcontractors', value: 80000, color: '#8884d8' }
];

const projectData = [
  { name: 'Downtown', budget: 500000, expenses: 325000, completion: 65 },
  { name: 'Westside', budget: 750000, expenses: 375000, completion: 50 },
  { name: 'Northside', budget: 300000, expenses: 285000, completion: 95 },
  { name: 'Eastside', budget: 450000, expenses: 450000, completion: 100 },
  { name: 'Southside', budget: 600000, expenses: 150000, completion: 25 }
];

const FinancialAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'expenses'>('overview');
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [profitChange, setProfitChange] = useState(0);

  useEffect(() => {
    // Calculate totals and changes
    const income = monthlyData.reduce((sum, month) => sum + month.income, 0);
    const expenses = monthlyData.reduce((sum, month) => sum + month.expenses, 0);
    const profit = income - expenses;
    
    // Calculate profit change (comparing last two months)
    const lastMonth = monthlyData[monthlyData.length - 1];
    const previousMonth = monthlyData[monthlyData.length - 2];
    const change = lastMonth && previousMonth 
      ? ((lastMonth.profit - previousMonth.profit) / previousMonth.profit) * 100 
      : 0;
    
    setTotalIncome(income);
    setTotalExpenses(expenses);
    setTotalProfit(profit);
    setProfitChange(change);
  }, []);

  return (
    <div className="bg-white p-4 shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Financial Analysis</h3>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 rounded ${activeTab === 'overview' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`px-3 py-1 rounded ${activeTab === 'projects' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
          <button 
            className={`px-3 py-1 rounded ${activeTab === 'expenses' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('expenses')}
          >
            Expenses
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-50 p-3 rounded">
          <p className="text-sm text-gray-500">Total Income</p>
          <p className="text-xl font-bold">${(totalIncome / 1000).toFixed(1)}k</p>
        </div>
        <div className="bg-red-50 p-3 rounded">
          <p className="text-sm text-gray-500">Total Expenses</p>
          <p className="text-xl font-bold">${(totalExpenses / 1000).toFixed(1)}k</p>
        </div>
        <div className="bg-green-50 p-3 rounded">
          <p className="text-sm text-gray-500">Profit</p>
          <div className="flex items-center">
            <p className="text-xl font-bold">${(totalProfit / 1000).toFixed(1)}k</p>
            <span className={`ml-2 flex items-center ${profitChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {profitChange >= 0 ? <FiArrowUp /> : <FiArrowDown />}
              {Math.abs(profitChange).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Charts based on active tab */}
      <div className="h-64">
        {activeTab === 'overview' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#3b82f6" />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
              <Bar dataKey="profit" name="Profit" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'projects' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
              <Tooltip formatter={(value, name) => [
                name === 'completion' ? `${value}%` : `$${value.toLocaleString()}`,
                name === 'completion' ? 'Completion' : name
              ]} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="budget" name="Budget" stroke="#3b82f6" />
              <Line yAxisId="left" type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" />
              <Line yAxisId="right" type="monotone" dataKey="completion" name="Completion %" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'expenses' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {expenseCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500 text-right">
        <a href="/reports" className="text-blue-500 hover:underline">View detailed reports →</a>
      </div>
    </div>
  );
};

export default FinancialAnalysis;
