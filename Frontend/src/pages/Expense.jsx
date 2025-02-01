import React, { useEffect, useRef, useState, useContext } from "react";
import CreateTransactionModal from "../components/CreateTransactionModal";
import axios from "axios";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Expense = () => {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [expensesTotal, setExpensesTotal] = useState(0);
  const [expenseMenu, setExpenseMenu] = useState(false);
  const [expenseCategoryMenu, setExpenseCategoryMenu] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchExpense, setSearchExpense] = useState(null);
  const panelRef = useRef();
  const categoriesRef = useRef();

  useEffect(() => {
    if (selectedCategory) {
      setFilteredExpenses(expenses.filter((expense) => expense.category === selectedCategory));
    } else {
      setFilteredExpenses(expenses);
    }
  }, [selectedCategory, expenses]);

  useEffect(() => {
    if (searchExpense) {
      setFilteredExpenses(expenses.filter((expense) => expense.tag.toLowerCase().startsWith(searchExpense.toLowerCase())));
    } else {
      setFilteredExpenses(expenses);
    }
  }, [searchExpense, expenses]);

  useEffect(() => {
        if (filteredExpenses.length > 0) {
          setExpensesTotal(filteredExpenses.reduce((acc, expense) => acc + expense.amount,
        0))
        }
      }, [filteredExpenses])

  
  useGSAP(
    function () {
      if (expenseMenu) {
        gsap.fromTo(
          panelRef.current,
          { opacity: 0, right: 0 },
          { opacity: 1, right: "45px", duration: 0.2, scrub: true }
        );
      }
    },
    [expenseMenu]
  );

  useGSAP(
    function () {
      if (expenseCategoryMenu) {
        gsap.fromTo(
          categoriesRef.current,
          { opacity: 0, left: "-45px" },
          { opacity: 1, left: "0", duration: 0.2, scrub: true }
        );
      }
    },
    [expenseCategoryMenu]
  );


  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/current-user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setUser(response.data.store);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (user) {
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/api/expenses/user/get-expenses`,
          {
            userId: user._id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          setExpenses(response.data.store);
        })
        .catch((error) => {
          console.log(error);
        });

      axios
        .post(`${import.meta.env.VITE_API_URL}/api/expenses/get-total`, {
          userId: user._id,
        })
        .then((response) => {
          setExpensesTotal(response.data.store);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [user]);

  const handleExpenseDelete = (expense) => {
    axios
      .post(`/api/expenses/delete`, {
        id: expense._id,
      })
      .then((response) => {
        if (response.data.statusCode === 200) {
          setExpenses(expenses.filter((t) => t._id !== expense._id));
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="home p-5 h-full w-full overflow-hidden overflow-y-auto relative">
      <CreateTransactionModal tag="expense" />
      <div className="my-5">
        <h1 className="text-2xl text-center">Total Expenses</h1>
        <h1 className="text-3xl text-center text-rose-400">
          ₹{expensesTotal}
        </h1>
      </div>
      <div className="h-fit py-5 relative">
        <section className="sort flex items-center gap-3 mb-5">
          <button
            className="bg-zinc-500 hover:bg-zinc-500/70 duration-100 text-white px-5 py-1 rounded"
            onClick={() => setExpenseCategoryMenu(!expenseCategoryMenu)}
          >
            Sort
          </button>
          <input 
          className="w-full bg-zinc-100/60 py-1 px-2 outline-neutral-300 rounded"
          placeholder="Search Expense"
          value={searchExpense}
          onChange={e => setSearchExpense(e.target.value)}
          />
          {expenseCategoryMenu && (
            <div ref={categoriesRef} className="absolute top-14 z-20 opacity-0 bg-white shadow-md rounded mt-2">
              <ul>
                <li
                  className="cursor-pointer p-2 hover:bg-gray-200 px-7"
                  onClick={() => {
                    setSelectedCategory(null);
                    setExpenseCategoryMenu(false);
                  }}
                >
                  None
                </li>
                {expenses
                  .filter((expense) => expense.category)
                  .map((expense, index) => (
                    <li
                      key={index}
                      className="cursor-pointer p-2 hover:bg-gray-200 px-7"
                      onClick={() => {
                        setSelectedCategory(expense.category);
                        setExpenseCategoryMenu(false);
                      }}
                    >
                      {expense.category}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </section>
        {filteredExpenses && filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => (
            <div
              key={expense._id}
              className={`bg-gray-100/50 my-2 w-full text-rose-400 relative flex items-center justify-between px-5 py-2 rounded`}
            >
              <div className="flex flex-col gap-2 w-1/4">
                {expense?.project?.name && (
                  <div className="text-xs text-gray-600 opacity-80">{expense?.project?.name}</div>
                )}
                <div>{expense?.tag}</div>
              </div>

              <div className="text-center opacity-60 text-gray-500/70 text-sm">
                <p className="italic text-xs">{expense?.createdAt?.split("T")[0]}</p>
                <p>{expense?.category}</p>
              </div>
              <div className={`flex items-center gap-3`}>
                <div className="">₹{expense.amount}</div>
                <i
                  onClick={() =>
                    setExpenseMenu(expenseMenu === expense._id ? null : expense._id)
                  }
                  className="text-black cursor-pointer px-2 ri-more-2-fill"
                ></i>
              </div>
              {expenseMenu === expense._id && (
                <div
                  ref={panelRef}
                  className="absolute opacity-0 right-8 top-3"
                >
                  <ul className="z-10 relative bg-white rounded-md p-2">
                    <li
                      onClick={() => handleExpenseDelete(expense)}
                      className="hover:bg-neutral-100/60 text-rose-400 cursor-pointer p-2 px-4 text-sm shadow-sm flex items-center gap-2 "
                    >
                      <i className="ri-delete-bin-7-line"></i>
                      <p>Delete</p>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ))
        ) : (
          <h1 className="text-center text-2xl">No expenses yet</h1>
        )}
      </div>
    </div>
  );
};

export default Expense;
