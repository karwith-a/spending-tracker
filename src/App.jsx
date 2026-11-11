import { useState, useEffect } from 'react';
import AddExpenseForm from './AddExpenseForm';
import { getExpenses, saveExpenses } from './storage';
import Charts from './Charts';
import './App.css'; 

const DEFAULT_CATEGORIES = ['Food', 'Transport', 'Fun', 'Other'];

function App() {
  const [expenses, setExpenses] = useState(() => getExpenses());
  const [editingId, setEditingId] = useState(null);
  
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('my-categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('my-currency') || 'USD';
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // NEW: State for Dark Mode
  const [darkMode, setDarkMode] = useState(() => {
    // Check if the user already had it saved, otherwise default to false (light mode)
    return localStorage.getItem('my-theme') === 'dark';
  });

  // NEW: This applies the "dark" class to the whole HTML body when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('my-theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('my-theme', 'light');
    }
  }, [darkMode]);

  function handleCurrencyChange(e) {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    localStorage.setItem('my-currency', newCurrency);
  }

  function handleAddCategory(newCategory) {
    if (!categories.includes(newCategory) && newCategory.trim() !== '') {
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      localStorage.setItem('my-categories', JSON.stringify(updatedCategories));
    }
  }

  function handleSaveExpense(expenseData) {
    if (editingId) {
      const updatedExpenses = expenses.map((exp) => 
        exp.id === editingId ? expenseData : exp
      );
      setExpenses(updatedExpenses);
      saveExpenses(updatedExpenses);
      setEditingId(null); 
    } else {
      const updatedExpenses = [expenseData, ...expenses];
      setExpenses(updatedExpenses);
      saveExpenses(updatedExpenses);
    }
  }

  function handleDelete(id) {
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
  }

  function handleClearAll() {
    const confirmDelete = window.confirm("Are you sure you want to delete ALL expenses? This cannot be undone.");
    if (confirmDelete) {
      setExpenses([]);
      saveExpenses([]);
      setEditingId(null); 
    }
  }

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || expense.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const expenseBeingEdited = expenses.find((exp) => exp.id === editingId);
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="app-container">
      <div className="header">
        <h1>My Spending Tracker</h1>
        
        <div className="header-controls">
          {/* NEW: Dark Mode Toggle Button */}
          <button onClick={() => setDarkMode(!darkMode)} className="theme-btn" title="Toggle Dark Mode">
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>

          <select value={currency} onChange={handleCurrencyChange} className="currency-select">
            <option value="USD">$ USD</option>
            <option value="KES">KSh KES</option>
            <option value="EUR">€ EUR</option>
            <option value="GBP">£ GBP</option>
            <option value="NGN">₦ NGN</option>
            <option value="ZAR">R ZAR</option>
          </select>
        </div>
      </div>
      
      <div className="top-row">
        <div className="total-box">
          <h2>Total Spent</h2>
          <p>{currency} {total.toFixed(2)}</p>
        </div>
      </div>

      <div className="form-row">
        <AddExpenseForm 
          key={editingId || 'new'} 
          onAddExpense={handleSaveExpense} 
          editingExpense={expenseBeingEdited}
          onCancelEdit={() => setEditingId(null)}
          categories={categories} 
          currency={currency}
        />

        <div className="add-category-box">
          <input 
            type="text" 
            placeholder="Add new category..." 
            id="new-category-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddCategory(e.target.value);
                e.target.value = ''; 
              }
            }}
          />
          <button onClick={() => {
            const input = document.getElementById('new-category-input');
            handleAddCategory(input.value);
            input.value = '';
          }}>
            + Add Category
          </button>
        </div>
      </div>

      <div className="bottom-row">
        <div className="list-column">
          
          <div className="filter-bar">
            <input 
              type="text" 
              placeholder="🔍 Search expenses..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <ul className="expense-list">
            {filteredExpenses.map((expense) => (
              <li key={expense.id} className="expense-item">
                <div className="expense-info">
                  <strong>{currency} {expense.amount.toFixed(2)}</strong> - {expense.description}
                  <span className="expense-category">{expense.category}</span>
                  {expense.date && (
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                      {expense.date}
                    </div>
                  )}
                </div>
                
                <div>
                  <button onClick={() => setEditingId(expense.id)} style={{ marginRight: '10px', cursor: 'pointer', background: 'none', border: 'none', color: '#3b82f6', fontWeight: 'bold' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(expense.id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {filteredExpenses.length === 0 && expenses.length > 0 && (
            <p className="empty-state">No expenses match your search.</p>
          )}

          {expenses.length === 0 && (
            <p className="empty-state">No expenses yet. Add one above!</p>
          )}

          {expenses.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button onClick={handleClearAll} className="clear-all-btn">
                Clear All Data
              </button>
            </div>
          )}
        </div>

        <div className="chart-column">
          <Charts expenses={expenses} currency={currency} />
        </div>
      </div>

    </div>
  );
}

export default App;