import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Loading from "./Loading";

const CreateTransactoinModal = ({ tag = "Transaction" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [fetchedProject, setFetchedProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const createTransactoinRef = useRef();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/projects/get-all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.statusCode === 200) {
          setProjects(res.data.store);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (selectedProject) {
      axios
        .get(
          `${import.meta.env.VITE_API_URL}/api/projects/get/${selectedProject}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          if (res.data.statusCode === 200) {
            setFetchedProject(res.data.store);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [selectedProject]);

  const handleCreate = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    if (!formData["projectId"]) {
      formData["projectId"] = "";
    }

    axios
      .post(`${import.meta.env.VITE_API_URL}/api/${tag}s/create`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.data.statusCode === 201) {
          setIsModalOpen(false);
          setLoading(false);
          location.reload();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`sticky top-0 left-0 z-20 shadow-lg shadow-zinc-500/20 ${
          tag === "income"
            ? "bg-emerald-400 hover:bg-emerald-500"
            : "bg-rose-400 hover:bg-rose-500"
        }  text-white my-2 mx-auto p-2 px-3 rounded-lg ease-in duration-100`}
      >
        <i className="ri-add-line"></i> Create {tag}
      </button>
      {loading ? (
        <Loading loading={loading} />
      ) : (
        <div
          className={`${
            isModalOpen ? "" : "hidden"
          } absolute z-10 h-full w-full bg-zinc-300/60 backdrop-blur-sm top-0 left-0 flex items-center justify-center`}
        >
          <div className="bg-white rounded-lg md:min-w-2/6 h-fit md:w-[30vw] py-5 relative">
            <div
              onClick={() => setIsModalOpen(false)}
              className="absolute top-0 right-1 cursor-pointer p-2 text-xl justify-self-end"
            >
              <i className="ri-close-line"></i>
            </div>

            <div className="">
              <h1 className="text-xl text-center p-2 capitalize">
                {tag} details
              </h1>

              <form
                ref={createTransactoinRef}
                onSubmit={handleCreate}
                className="flex flex-col gap-3 relative my-3"
              >
                <input
                  autoComplete="off"
                  required
                  className="bg-neutral-100/60 rounded-md py-2 px-2 w-auto mx-6 relative"
                  placeholder="Name"
                  type="text"
                  name="tag"
                />
                <input
                  autoComplete="off"
                  className="bg-neutral-100/60 rounded-md py-2 px-2 w-auto mx-6 relative"
                  placeholder="Category"
                  type="text"
                  name="category"
                />
                <input
                  autoComplete="off"
                  className="bg-neutral-100/60 rounded-md py-2 px-2 w-auto mx-6 relative"
                  placeholder="Amount"
                  type="number"
                  name="amount"
                />

                <select
                  className="bg-neutral-100/60 rounded-md py-2 px-2 w-auto mx-6 relative"
                  name="projectId"
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="" disabled selected>
                    Select a project
                  </option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {}
                <button
                  type="submit"
                  className={`mt-4 capitalize ${
                    tag === "income"
                      ? "bg-emerald-400 hover:bg-emerald-500"
                      : "bg-rose-400 hover:bg-rose-500"
                  } w-auto mx-10 text-white py-2 rounded-md ease-in duration-100`}
                >
                  Create {tag}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateTransactoinModal;
