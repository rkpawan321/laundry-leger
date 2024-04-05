import React, { useState } from 'react';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ type: 'credit', amount: '', performedBy: 'Pawan' });

  const participants = ['Pawan', 'Peter', 'Sravan', 'Harshit'];

  const addTransaction = (e) => {
    e.preventDefault();
  
    // Check if the transaction type is credit and the performedBy is not Pawan
    if (form.type === 'credit' && form.performedBy !== 'Pawan') {
      alert("Only Pawan can perform credit transactions."); // Alert the user
      return; // Prevent the transaction from being added
    }
  
    // Calculate the current total balance
    const currentTotal = transactions.reduce((acc, transaction) =>
      transaction.type === 'credit' ? acc + transaction.amount : acc - transaction.amount,
      0
    );
  
    // Check if it's a debit transaction and if there are sufficient funds
    if (form.type === 'debit' && currentTotal < parseFloat(form.amount)) {
      alert("Insufficient balance for this debit transaction."); // Alert the user
      return; // Prevent the transaction from being added
    }
  
    setTransactions([
      ...transactions,
      { ...form, amount: parseFloat(form.amount), id: transactions.length }
    ]);
  
    // Reset form after submission
    setForm({ type: 'credit', amount: '', performedBy: 'Pawan' });
  };
  
  

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    return transactions.reduce(
      (acc, transaction) =>
        transaction.type === 'credit' ? acc + transaction.amount : acc - transaction.amount,
      0
    );
  };

  const calculateBalances = () => {
    const initialBalances = participants.reduce((acc, person) => ({ ...acc, [person]: 0 }), {});
  
    transactions.forEach(transaction => {
      if (transaction.type === 'credit') {
        initialBalances[transaction.performedBy] += transaction.amount;
      } else if (transaction.type === 'debit' && transaction.performedBy !== 'Pawan') {
        initialBalances[transaction.performedBy] -= transaction.amount;
      }
    });
  
    // If Pawan is the only one who debited or if no debits occurred, set Pawan's balance to zero
    const debitTransactions = transactions.filter(t => t.type === 'debit');
    if (debitTransactions.length === 0 || (debitTransactions.length === 1 && debitTransactions[0].performedBy === 'Pawan')) {
      initialBalances['Pawan'] = 0;
    }
  
    return initialBalances;
  };

  // Adjusting the calculateOwes function
const calculateOwes = (balances) => {
  let owes = participants.reduce((acc, person) => ({ ...acc, [person]: {} }), {});

  participants.forEach(person => {
    if (balances[person] < 0) { // If the person's balance is negative, they owe money
      participants.forEach(owedPerson => {
        if (person !== owedPerson && balances[owedPerson] > 0) {
          // If the owedPerson has a positive balance and is not Pawan, calculate the owed amount
          if (owedPerson !== 'Pawan' || person !== 'Pawan') {
            const amountOwed = Math.min(balances[owedPerson], -balances[person]);
            if (amountOwed > 0) {
              owes[person][owedPerson] = amountOwed.toFixed(2);
            }
          }
        }
      });
    }
  });

  return owes;
};


const downloadCSV = () => {
  const csvRows = [
    ['Type', 'Amount', 'Performed By'], // headers
    ...transactions.map(t => [t.type, t.amount, t.performedBy])
  ];

  const csvString = csvRows.map(e => e.join(',')).join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  // Create a link and trigger the download
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'transaction_history.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const sendEmailWithCSV = async () => {
  const csvRows = [
    ['Type', 'Amount', 'Performed By'], // headers
    ...transactions.map(t => [t.type, t.amount, t.performedBy])
  ];
  const csvString = csvRows.map(e => e.join(',')).join('\n');

  try {
    const response = await fetch('YOUR_SERVER_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ csv: csvString, email: 'rkpawan321@gmail.com' })
    });

    if (response.ok) {
      alert('Email sent successfully.');
    } else {
      alert('Failed to send email.');
    }
  } catch (error) {
    alert('Error sending email.');
    console.error('There was an error!', error);
  }
};



  const totalBalance = calculateTotal();
  const balances = calculateBalances();
  const owes = calculateOwes(balances);

  // return (
    // <div className="App">
    //   <h1>Laundry Expense Tracker</h1>
    //   <form onSubmit={addTransaction}>
    //     <select name="type" value={form.type} onChange={handleInputChange}>
    //       <option value="credit">Credit</option>
    //       <option value="debit">Debit</option>
    //     </select>
    //     <input type="number" name="amount" placeholder="Amount ($)" value={form.amount} onChange={handleInputChange} required />
    //     <select name="performedBy" value={form.performedBy} onChange={handleInputChange}>
    //       <option value="Pawan">Pawan</option>
    //       <option value="Peter">Peter</option>
    //       <option value="Sravan">Sravan</option>
    //       <option value="Harshit">Harshit</option>
    //     </select>
    //     <button type="submit">Add Transaction</button>
    //   </form>
  

   



return (
<>
  <div className="app">



    <header className="header">
      <h1>Laundry Expense Tracker</h1>
    </header>


    <div className="form-container">
      <form onSubmit={addTransaction} className="transaction-form">
        <select name="type" value={form.type} onChange={handleInputChange} className="input-field">
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
        <input type="number" name="amount" placeholder="Amount ($)" value={form.amount} onChange={handleInputChange} required className="input-field" />
        <select name="performedBy" value={form.performedBy} onChange={handleInputChange} className="input-field">
          <option value="Pawan">Pawan</option>
          <option value="Peter">Peter</option>
          <option value="Sravan">Sravan</option>
          <option value="Harshit">Harshit</option>
        </select>
        <button type="submit" className="submit-btn">Add Transaction</button>
      </form>
    </div>





   {/* Display the total balance */}
   <h3>Total Balance: ${totalBalance.toFixed(2)}</h3>

{/* Display who owes whom */}
<h2>Balance Sheet</h2>
<div>
{participants.map(person => (
balances[person] > 0 ? (
<div key={person}>
<p>{person} gets back ${balances[person].toFixed(2)} in total.</p>
<ul>
  {Object.entries(owes).flatMap(([debtor, debt]) =>
    debt[person] ? (
      <li key={debtor}>
        {debtor} owes ${debt[person]} to {person}
      </li>
    ) : []
  )}
</ul>
</div>
) : null
))}
</div>


{/* Transaction History Table */}
<div>
<h2>Transaction History</h2>
<table>
<thead>
<tr>
  <th>Type</th>
  <th>Amount ($)</th>
  <th>Performed By</th>
</tr>
</thead>
<tbody>
{transactions.map((transaction, index) => (
  <tr key={index}>
    <td>{transaction.type}</td>
    <td>{transaction.amount.toFixed(2)}</td>
    <td>{transaction.performedBy}</td>
  </tr>
))}
</tbody>
</table>
</div>


<div className="buttons-container">
      <button onClick={downloadCSV} className="button">Download CSV</button>
      <button onClick={sendEmailWithCSV} className="button">Send Email</button>
</div>


</div>


</>
);
}

export default App;
