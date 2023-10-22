"use client";
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

const Expense = (props) => {
  const initialItem = { name: "", price: "" };
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [newItem, setNewItem] = useState(initialItem);

  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== "" && newItem.price !== "") {
      await addDoc(collection(db, "expences"), {
        name: newItem.name.trim(),
        price: newItem.price,
      });
      setNewItem(initialItem);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "expences"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let expencesArr = [];

      querySnapshot.forEach((doc) => {
        expencesArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(expencesArr);

      const calculateTotal = () => {
        const totalPrice = expencesArr.reduce(
          (sum, item) => sum + parseFloat(item.price),
          0
        );
        setTotal(totalPrice);
        props.updateTotal(totalPrice);
      };
      calculateTotal();
      return () => unsubscribe();
    });
  }, []);

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "expences", id));
  };

  return (
    <div>
      <h1 className="text-4xl p-4 text-center">Expenses</h1>
      <div className="bg-slate-800 p-4 rounded=lg">
        <form className="grid grid-cols-6 items-center text-black">
          <input
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="col-span-3 p-3 border"
            type="text"
            placeholder="Enter Expense"
          />
          <input
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            className="col-span-2 p-3 border mx-3"
            type="number"
            placeholder="Enter $"
          />
          <button
            onClick={addItem}
            className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl"
            type="submit"
          >
            +
          </button>
        </form>
        <ul>
          {items.map((item, id) => (
            <li
              key={id}
              className="my-4 w-full flex justify-between bg-slate-950"
            >
              <div className="p-4 w-full flex justify-between">
                <span className="capitalize">{item.name}</span>
                <span>${item.price}</span>
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                className="ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16"
              >
                X
              </button>
            </li>
          ))}
        </ul>
        {items.length < 1 ? (
          ""
        ) : (
          <div className="flex justify-between p-3">
            <span>Total</span>
            <span>-${total}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Expense;
