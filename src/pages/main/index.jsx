import { useRef } from "react";
import { useAddTransaction } from "../../hooks/useAddTransaction";
import { useGetTransactions } from "../../hooks/useGetTransactions";
import "./styles.css";

export const ExpenseTracker = () => {
  const collectionName = "transactions";
  const { addTransaction } = useAddTransaction();
  const { transactions } = useGetTransactions(collectionName);

  const formRefs = {
    description: useRef(),
    transactionAmount: useRef(),
    isExpense: useRef(),
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addTransaction({
      description: formRefs.description.current.value,
      transactionType: formRefs.isExpense.current.checked
        ? "expense"
        : "income",
      transactionAmount: formRefs.transactionAmount.current.value,
    });
  };

  return (
    <>
      <div className="expense-tracker">
        <div className="container">
          <h1>ExpenseTracker</h1>
          <div className="balance">
            <h3>Your Balance</h3>
            <h2>$0.00</h2>
          </div>

          <div className="summary">
            <div className="income">
              <h4>Income</h4>
              <p>$0.00</p>
            </div>

            <div className="expenses">
              <h4>Expenses</h4>
              <p>$0.00</p>
            </div>
          </div>

          <form className="add-transaction" onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Description"
              required
              ref={formRefs.description}
            />
            <input
              type="number"
              placeholder="Amount"
              required
              ref={formRefs.transactionAmount}
            />
            <input
              type="radio"
              name="transactionType"
              value="expense"
              ref={formRefs.isExpense}
            />
            <label htmlFor="expense">Expense</label>
            <input type="radio" name="transactionType" value="income" />
            <label htmlFor="income">Income</label>
            <button type="Submit">Add Transaction</button>
          </form>
        </div>
      </div>
      <div className="transactions">
        <h3>Transactions</h3>
        <ul>
          {transactions.map((trans) => {
            return (
              <li key={trans.docId}>
                ${trans.transactionAmount} -{" "}
                <label
                  style={{
                    color:
                      trans.transactionType === "expense" ? "red" : "green",
                  }}
                >
                  {trans.transactionType}
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

// export default ExpenseTracker;
