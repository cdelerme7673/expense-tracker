import { useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase-config";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { useAddTransaction } from "../../hooks/useAddTransaction";
import { useGetTransactions } from "../../hooks/useGetTransactions";

import "./styles.css";

export const ExpenseTracker = () => {
  const { name, profilePhoto, isAuth } = useGetUserInfo();
  const { addTransaction } = useAddTransaction(
    process.env.REACT_APP_FIRBASE_COLLECTION_NAME
  );
  const { transactions, transactionTotals } = useGetTransactions(
    process.env.REACT_APP_FIRBASE_COLLECTION_NAME
  );
  const navigate = useNavigate();

  const { balance, expenses, income } = transactionTotals;

  const formRefs = {
    description: useRef(),
    transactionAmount: useRef(),
    isExpense: useRef(),
  };

  const clearFormRefs = () => {
    const { description, transactionAmount } = formRefs;
    description.current.value = "";
    transactionAmount.current.value = 0;
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
    clearFormRefs();
  };

  const signUserOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuth) return <Navigate to="/" />;

  return (
    <>
      <div className="expense-tracker">
        <div className="container">
          <h1>{name}'s ExpenseTracker</h1>
          <div className="balance">
            <h3>Your Balance</h3>
            <h2>{balance < 0 ? `-$${balance * -1}` : `$${balance}`}</h2>
          </div>

          <div className="summary">
            <div className="income">
              <h4>Income</h4>
              <p>${income}</p>
            </div>

            <div className="expenses">
              <h4>Expenses</h4>
              <p>${expenses}</p>
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

        {profilePhoto && (
          <div className="profile">
            <img className="profile-photo" src={profilePhoto} />
            <button
              className="sign-out-button"
              onClick={() => {
                signUserOut();
              }}
            >
              Sign Out
            </button>
          </div>
        )}
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
