import React, { useEffect, useRef, useState, useContext } from "react";
import CreateTransactionModal from "../components/CreateTransactionModal";
import axios from "axios";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Income = () => {
  const [user, setUser] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [incomesTotal, setIncomesTotal] = useState(0);
  const [incomeMenu, setIncomeMenu] = useState(false);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [incomeCategoryMenu,setIncomeCategoryMenu] = useState(false)
  const [searchIncome,setSearchIncome] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const panelRef = useRef();
  const categoriesRef = useRef();

  useEffect(() => {
      if (selectedCategory) {
        setFilteredIncomes(incomes.filter((income) => income.category === selectedCategory))
      } else {
        setFilteredIncomes(incomes);
      }
    }, [selectedCategory, incomes]);
  
    useEffect(() => {
      if (searchIncome) {
        setFilteredIncomes(incomes.filter((income) => income.tag.toLowerCase().startsWith(searchIncome.toLowerCase())));
      } else {
        setFilteredIncomes(incomes);
      }
    }, [searchIncome, incomes]);

    useEffect(() => {
      if (filteredIncomes.length > 0) {
        setIncomesTotal(filteredIncomes.reduce((acc, income) => acc + income.amount,
      0))
      }
    }, [filteredIncomes])

  useGSAP(
    function () {
      if (incomeMenu) {
        gsap.fromTo(
          panelRef.current,
          { opacity: 0, right: 0 },
          { opacity: 1, right: "45px", duration: 0.2, scrub: true }
        );
      }
    },
    [incomeMenu]
  );
  useGSAP(
    function () {
      if (incomeCategoryMenu) {
        gsap.fromTo(
          categoriesRef.current,
          { opacity: 0, left: "-45px" },
          { opacity: 1, left: "0", duration: 0.2, scrub: true }
        );
      }
    },
    [incomeCategoryMenu]
  );

  useEffect(() => {
    axios
      .get("/api/users/current-user", {
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
          "/api/incomes/user/get-incomes",
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
          setIncomes(response.data.store);
        })
        .catch((error) => {
          console.log(error);
        });

      axios
        .post("/api/incomes/get-total", {
          userId: user._id,
        })
        .then((response) => {
          setIncomesTotal(response.data.store);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [user]);

  const handleIncomeDelete = (income) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/incomes/delete`, {
        id: income._id,
      })
      .then((response) => {
        if (response.data.statusCode === 200) {
          setIncomes(incomes.filter((t) => t._id !== income._id));
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="home p-5 h-full w-full overflow-hidden overflow-y-auto relative">
      <CreateTransactionModal tag="income" />
      <div className="my-5">
        <h1 className="text-2xl text-center">Total Incomes</h1>
        <h1 className="text-3xl text-center text-emerald-500">
          ₹{incomesTotal || 0}
        </h1>
      </div>
      <div className="h-fit py-5 relative">
      <section className="sort flex items-center gap-3 mb-5">
          <button
            className="bg-zinc-500 hover:bg-zinc-500/70 duration-100 text-white px-5 py-1 rounded"
            onClick={() => setIncomeCategoryMenu(!incomeCategoryMenu)}
          >
            Sort
          </button>
          <input 
          className="w-full bg-zinc-100/60 py-1 px-2 outline-neutral-300 rounded"
          placeholder="Search Expense"
          value={searchIncome}
          onChange={e => setSearchIncome(e.target.value)}
          />
          {incomeCategoryMenu && (
            <div ref={categoriesRef} className="absolute top-14 z-20 opacity-0 bg-white shadow-md rounded mt-2">
              <ul>
                <li
                  className="cursor-pointer p-2 hover:bg-gray-200 px-7"
                  onClick={() => {
                    setSelectedCategory(null);
                    setIncomeCategoryMenu(false);
                  }}
                >
                  None
                </li>
                {incomes
                  .map((income) => income.category)
                  .filter((category, index, self) => category && self.indexOf(category) === index)
                  .map((category, index) => (
                    <li
                      key={index}
                      className="cursor-pointer p-2 hover:bg-gray-200 px-7"
                      onClick={() => {
                        setSelectedCategory(category);
                        setIncomeCategoryMenu(false);
                      }}
                    >
                      {category}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </section>
        {filteredIncomes && filteredIncomes.length > 0 ? (
          filteredIncomes.map((income) => (
            <div
              className={`bg-gray-100/50 my-2 w-full text-emerald-500 relative flex items-center justify-between px-5 py-2 rounded`}
            >
              <div className="flex flex-col gap-2 w-1/4">
                {income?.project?.name && (
                  <div className="text-xs text-gray-600 opacity-80">{income?.project?.name}</div>
                )}
                <div>{income?.tag}</div>
              </div>

              <div className="text-center opacity-60 text-gray-500/70 flex flex-col text-sm">
              <p className="italic text-xs">{income?.createdAt?.split("T")[0]}</p>
              <p>{income?.category}</p>
              </div>
              <div className={`flex items-center gap-3`}>
                <div className="">₹{income.amount}</div>
                <i
                  onClick={() =>
                    setIncomeMenu(incomeMenu === income._id ? null : income._id)
                  }
                  className="text-black cursor-pointer px-2 ri-more-2-fill"
                ></i>
              </div>
              {incomeMenu === income._id && (
                <div
                  ref={panelRef}
                  className="absolute opacity-0 right-8 top-3"
                >
                  <ul className="z-10 relative bg-white rounded-md p-2">
                    <li
                      onClick={() => handleIncomeDelete(income)}
                      className="hover:bg-neutral-100/60 text-red-400 cursor-pointer p-2 px-4 text-sm shadow-sm flex items-center gap-2 "
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
          <h1 className="text-center text-2xl">No incomes yet</h1>
        )}
      </div>
    </div>
  );
};

export default Income;
