import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestoreDB } from "../config/firebase-config";
import { useGetUserInfo } from "./useGetUserInfo";

export const useAddTransaction = (collectionName) => {
  const transactionCollectionRef = collection(firestoreDB, collectionName);
  const { userId } = useGetUserInfo();

  const addTransaction = async ({
    description,
    transactionAmount,
    transactionType,
  }) => {
    await addDoc(transactionCollectionRef, {
      userId,
      description,
      transactionAmount,
      transactionType,
      createdAt: serverTimestamp(),
    });
  };
  return { addTransaction };
};
