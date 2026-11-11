import { useState } from 'react';
import './AddExpenseForm.css'; 

// NEW: Receive currency as a prop
function AddExpenseForm({ onAddExpense, editingExpense, onCancelEdit, categories, currency }) {
  const today = new Date().toISOString().split('T')[0];

  const [description, setDescription] = useState(editingExpense ? editingExpense.description : '');
  const [amount, setAmount] = useState(editingExpense ? editingExpense.amount.toString() : '');
  const [category, setCategory] = useState(editingExpense ? editingExpense.category : categories[0]);
  const [date, setDate] = useState(editingExpense ? editingExpense.date : today);

  function handleSubmit(e) {
    e.preventDefault(); 
    if (!description || !amount) return;

    const expenseData = {
      id: editingExpense ? editingExpense.id : Date.now().toString(),
      description: description,
      amount: parseFloat(amount),
      category: category,
      date: date
    };

    onAddExpense(expenseData);
    
    setDescription('');
    setAmount('');
    setDate(today); 
  }

  return (
    <form onSubmit={handleSubmit} className="expense-form" style={{ backgroundColor: editingExpense ? '#fef3c7' : 'transparent', padding: editingExpense ? '10px' : '0' }}>
      <input type="text" placeholder="What did you buy?" value={description} onChange={(e) => setDescription(e.target.value)} />
      
      {/* CHANGED: Show the currency inside the placeholder */}
      <input type="number" placeholder={`Amount (${currency})`} value={amount} onChange={(e) => setAmount(e.target.value)} />
      
      <input type="date" value={date} max={today} onChange={(e) => setDate(e.target.value)} />
      
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      
      <button type="submit">{editingExpense ? 'Update' : 'Add'}</button>
      
      {editingExpense && (
        <button type="button" onClick={onCancelEdit} style={{ backgroundColor: '#ef4444' }}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default AddExpenseForm;