import { useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { useEffect } from "react";
import pendingImg from "./assets/pending1.png";
// import pendingImg from "./assets/pending.svg";
import completedImg from "./assets/completed.svg";

function App() {
  const [task, setTask] = useState("");
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // console.log("starts fetching");

      const { data, error } = await supabase.from("todolist").select();
      if (error) {
        // console.log("Error in fetching : " + error);
      } else {
        setTodoList(data);
      }
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   console.log("todo:", todoList);
  // }, [todoList]);

  const upload = async (e) => {
    e.preventDefault();
    task.trim();
    const { error } = await supabase.from("todolist").insert({
      task,
    });
    if (error) {
      // console.log("Error in upload : " + error.code);
      if (error.code == "23505") {
        alert("Task Already Assigned");
      }
    } else {
      console.log("Data uploaded");
      setTask("")
      setTodoList((prev) => [...prev, { task: task, status: false }]);
    }
  };

  const changeStatus = async (task, status) => {
    const { error } = await supabase
      .from("todolist")
      .update({
        status: !status,
      })
      .eq("task", task);
    if (error) {
      console.log("Error in status change : " + error);
    } else {
      // console.log("Status Changed");
      const updatedStatus = todoList.map((todo) =>
        todo.task === task ? { ...todo, status: !status } : todo
      );
      setTodoList(updatedStatus);
    }
  };

  const deleteTask = async (task) => {
    const { error } = await supabase.from("todolist").delete().eq("task", task);
    if (error) console.log("Error in deleting : ", error);
    else console.log("Successfully delted");
    const newTodo = todoList.filter((todo) => todo.task !== task);
    setTodoList(newTodo);
  };

  return (
    <div className="bg-gray-100 h-screen md:p-0 sm:px-2 py-2 flex-col">
      <div className="p-4 font-serif gap-4 max-w-md flex flex-col mb-5 justify-center items-center mx-auto bg-white shadow rounded-xl">
        <center className="text-2xl">📝 Todo List</center>
        <form className="flex-col flex gap-4 w-full px-3" onSubmit={upload}>
          {/* <label htmlFor="task">Enter Task : </label> */}
          <input
            type="text"
            id="task"
            className="border-2 text-center border-slate-200 p-2 w-full rounded focus:border-blue-500 h-10"
            value={task}
            autoComplete="off"
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter the Task . . ."
          />
          <button
            type="submit"
            className="bg-[#2057fbfa] cursor-pointer hover:scale-105 transition-all ease-in-out duration-700 hover:shadow-xl  mx-auto text-white rounded p-1 w-1/2"
          >
            +Add Todo
          </button>
        </form>
      </div>
      {/* Dummy */}

      {todoList &&
        todoList.map((todo) => (
          <div className="p-2 flex max-w-md bg-slate-200 mx-auto m-2 rounded-md">
            <div className="w-3/4 text-justify">{todo.task}</div>
            <div className="w-1/4 flex justify-between px-2">
              <div
                className="img my-auto duration-1000"
                onClick={() => changeStatus(todo.task, todo.status)}
              >
                {todo.status ? (
                  <img
                    src={completedImg}
                    className="w-6 h-6 cursor-pointer"
                    alt="Completed Icon"
                  />
                ) : (
                  <img
                    src={pendingImg}
                    className="w-6 h-6 cursor-pointer animate-spin duration-[5000ms]"
                    alt="Pending Icon"
                  />
                )}
              </div>
              <button className="text-red-500 hover:text-red-600 cursor-pointer" onClick={() => deleteTask(todo.task)}>
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M7 4V2H17V4H22V6H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V6H2V4H7ZM6 6V20H18V6H6ZM9 9H11V17H9V9ZM13 9H15V17H13V9Z"></path></svg>
              </button>
            </div>
          </div>
        ))}

      {/* dummy */}

      {/* <table className="p-4 w-md border-2 mx-auto rounded-2xl">
        <thead>
          <tr className="border-2">
            <th className="border-2">Task</th>
            <th className="border-2">Status</th>
            <th>Del</th>
          </tr>
        </thead>
        <tbody>
          {todoList &&
            todoList.map((todo) => (
              <tr className="border-2 p-2" key={todo.task}>
                <td className="border-2">{todo.task}</td>
                <td
                  onClick={() => changeStatus(todo.task, todo.status)}
                  className="cursor-pointer border-2"
                >
                  {todo.status ? (
                    <img src={completedImg} alt="Completed Icon" />
                  ) : (
                    <img src={pendingImg} alt="Pending Icon" />
                  )}
                </td>
                <td
                  onClick={() => deleteTask(todo.task)}
                  className="cursor-pointer rounded-xl bg-red-400 text-white text-center"
                >
                  delete
                </td>
              </tr>
            ))}
        </tbody>
      </table> */}
    </div>
  );
}

export default App;
