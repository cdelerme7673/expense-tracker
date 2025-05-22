import { useEffect, useState } from "react";
import {
  query,
  collection,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { firestoreDB } from "../config/firebase-config";
import { useGetUserInfo } from "./useGetUserInfo";

export const useGetTransactions = (collectionName) => {
  const [transactions, setTransactions] = useState([]);
  const [transactionTotals, setTransactionTotals] = useState({
    balance: 0.0,
    income: 0.0,
    expenses: 0.0,
  });

  const transactionCollectionRef = collection(firestoreDB, collectionName);
  const { userId } = useGetUserInfo();

  const getTransactions = async () => {
    let unsubscribe;
    try {
      const queryTransactions = query(
        transactionCollectionRef,
        where("userId", "==", userId),
        orderBy("createdAt")
      );
      unsubscribe = onSnapshot(queryTransactions, (snapshot) => {
        let documents = [];
        let totalIncome = 0;
        let totalExpenses = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();
          const docId = doc.id;

          documents.push({ ...data, docId });

          data.transactionType === "expense"
            ? (totalExpenses += Number(data.transactionAmount))
            : (totalIncome += Number(data.transactionAmount));
        });

        setTransactions(documents);
        setTransactionTotals({
          balance: totalIncome - totalExpenses,
          expenses: totalExpenses,
          income: totalIncome,
        });
      });
    } catch (err) {
      console.error(err);
    }

    return () => unsubscribe();
  };

  useEffect(() => {
    getTransactions();
  }, []);

  return { transactions, transactionTotals };
};
