const KEY = 'my-expenses';

export function getExpenses() {
  const saved = localStorage.getItem(KEY);
  return saved ? JSON.parse(saved) : [];
}

export function saveExpenses(expenses) {
  localStorage.setItem(KEY, JSON.stringify(expenses));
}