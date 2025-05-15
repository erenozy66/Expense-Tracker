import React, { useState, useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const printRef = useRef();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('expenses'));
    if (saved) setExpenses(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!name || !amount) {
      setError('Please enter both name and amount.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      setError('Amount must be a valid number.');
      return;
    }

    const newExpense = { name, amount: parsedAmount };
    setExpenses([...expenses, newExpense]);
    setName('');
    setAmount('');
    setError('');
  };

  const clearAllExpenses = () => {
    setExpenses([]);
    localStorage.removeItem('expenses');
    setError('');
  };

  const saveToPdf = () => {
    const input = printRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('expenses.pdf');
    });
  };

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .input-group {
            flex-direction: column;
            align-items: stretch;
          }

          .input-group input,
          .input-group button {
            width: 100% !important;
            margin-right: 0 !important;
            margin-bottom: 10px !important;
          }

          .button-group {
            flex-direction: column;
          }

          .button-group button {
            width: 100%;
          }
        }
      `}</style>

      <div
        style={{
          padding: '20px',
          maxWidth: '600px',
          margin: '0 auto',
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#2b2a33',
          color: 'white',
          minHeight: '100vh',
        }}
      >
        <h1>💸 Expense Tracker</h1>

        <div
          className="input-group"
          style={{
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <input
            type="text"
            placeholder="Expense Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              marginRight: '10px',
              padding: '10px',
              height: '40px',
              fontSize: '16px',
              flex: '1',
              backgroundColor: '#444452',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
            }}
          />
          <input
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              marginRight: '10px',
              padding: '10px',
              height: '40px',
              fontSize: '16px',
              width: '120px',
              backgroundColor: '#444452',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
            }}
          />

          <div
            className="button-group"
            style={{
              display: 'flex',
              gap: '10px',
              marginTop: '10px',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={addExpense}
              style={{
                padding: '0 15px',
                height: '40px',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: '#555560',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              Add
            </button>

            <button
              onClick={clearAllExpenses}
              style={{
                padding: '0 15px',
                height: '40px',
                fontSize: '16px',
                backgroundColor: '#f44336',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '4px',
              }}
            >
              Clear All
            </button>

            <button
              onClick={saveToPdf}
              style={{
                padding: '0 15px',
                height: '40px',
                fontSize: '16px',
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '4px',
              }}
            >
              Save to PDF
            </button>
          </div>
        </div>

        {error && <p style={{ color: '#f44336' }}>{error}</p>}

        <div
          ref={printRef}
          style={{
            color: 'black',
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '8px',
          }}
        >
          <ul
            style={{
              fontSize: '18px',
              paddingLeft: '20px',
              marginBottom: '30px',
            }}
          >
            {expenses.map((exp, index) => (
              <li key={index}>
                {exp.name}: ${exp.amount.toFixed(2)}
              </li>
            ))}
          </ul>

          {expenses.length > 0 && (
            <div
              style={{
                maxWidth: '400px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              <h2 style={{ color: 'black' }}>Spending Breakdown</h2>
              <Pie
                data={{
                  labels: expenses.map((e) => e.name),
                  datasets: [
                    {
                      data: expenses.map((e) => e.amount),
                      backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#F7464A',
                      ],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      labels: {
                        color: 'black',
                      },
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
