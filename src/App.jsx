import { useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { useEffect } from "react";

function App() {
  const [task, setTask] = useState("");
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("starts fetching");

      const { data, error } = await supabase.from("todolist").select();
      if (error) {
        console.log("Error in fetching : " + error);
      } else {
        setTodoList(data);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("todo:", todoList);
  }, [todoList]);

  const upload = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("todolist").insert({
      task,
    });
    if (error) {
      console.log("Error in upload : " + error);
    } else {
      console.log("Data uploaded");
      // if (todoList)
        setTodoList((prev) => [...prev, { task: task, status: false }]);
      // else setTodoList({ task: task, status: false });
    }
  };

  const changeStatus = async (task, status) => {
    // e.preventDefault();
    const { error } = await supabase
      .from("todolist")
      .update({
        status: !status,
      })
      .eq("task", task);
    if (error) {
      console.log("Error in status change : " + error);
    } else {
      console.log("Status Changed");
      const updatedStatus = todoList.map((todo)=>(
        todo.task===task?{...todo,status:!status}:todo
      ))
      setTodoList(updatedStatus);
      // const newtodo = todoList.filter((todo)=>todo.task!==task);
      // setTodoList(newtodo);
    }
  };

  const deleteTask = async (task)=>{
    const {error} = await supabase.from('todolist').delete().eq('task',task);
    if(error)console.log("Error in deleting : ",error);
    else console.log("Successfully delted");
    const newTodo = todoList.filter((todo)=>(
      todo.task!==task
    ))
    setTodoList(newTodo);
    
    
  }

  return (
    <div className="p-4 font-serif">
      <form className="flex gap-2 " onSubmit={upload}>
        <label htmlFor="task">Enter Task : </label>
        <input
          type="text"
          id="task"
          className="border-2 rounded focus:border-blue-500"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-400 to-amber-600 rounded p-1"
        >
          submit
        </button>
      </form>

      <table className="p-4 w-full border-2">
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
                <td onClick={()=>changeStatus(todo.task, todo.status)} className="cursor-pointer border-2">
                  {todo.status ? "Done" : "Pending"}
                </td>
                <td onClick={()=>deleteTask(todo.task)} className="cursor-pointer rounded-xl bg-red-400 text-white text-center">delete</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
