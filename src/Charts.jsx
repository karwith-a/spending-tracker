import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts/umd/Recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// 1. Move the CustomTooltip OUTSIDE the Charts component
const CustomTooltip = ({ active, payload, currency }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{payload[0].name}</p>
        <p style={{ margin: 0, color: '#3b82f6' }}>
          {currency} {payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

function Charts({ expenses, currency }) {
  // 1. Group by category and calculate total
  const data = expenses.reduce((acc, expense) => {
    const existingCategory = acc.find(item => item.name === expense.category);
    if (existingCategory) {
      existingCategory.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount });
    }
    return acc;
  }, []);

  // 2. Calculate percentages for the labels
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  const dataWithPercentages = data.map(item => ({
    ...item,
    percentage: total > 0 ? Math.round((item.value / total) * 100) : 0
  }));

  if (dataWithPercentages.length === 0) return null;

  return (
    <div style={{ marginTop: '30px', borderTop: '2px solid #e5e7eb', paddingTop: '20px' }}>
      <h2 style={{ textAlign: 'center', fontSize: '18px', color: '#4b5563' }}>Where your money went</h2>
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <PieChart width={320} height={300}>
          <Pie
            data={dataWithPercentages}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            // This displays the percentage on the pie slices
            label={({ percentage }) => `${percentage}%`}
          >
            {dataWithPercentages.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          
          {/* Use our custom tooltip */}
          <Tooltip content={<CustomTooltip currency={currency} />} />
          
          <Legend />
        </PieChart>
      </div>
    </div>
  );
}

export default Charts;