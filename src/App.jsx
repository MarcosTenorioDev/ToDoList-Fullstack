import { useEffect, useState } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { Spinner } from "@chakra-ui/spinner";

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [inputVisibility, setInputVisibility] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState();
  const [loading, setLoading] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false)

  const ToDo = ({ todo }) => {
    return (
      <div className="">
        {todo.map((todo) => {
          return (
            <div
              key={todo.id}
              className="flex justify-between p-3 px-4 border-2 border-gray-400 bg-slate-200"
            >
              {" "}
              <input
                type="checkbox"
                defaultChecked={todo.status}
                onClick={() => {
                  modifyStatusTodo(todo);
                }}
              />
              <p>{todo.name}</p>
              <div className="flex gap-2">
                <button onClick={() => handleWithEditButtonClick(todo)}>
                  <AiOutlineEdit size={20} />
                </button>
                <button
                  onClick={() => {
                    deleteTodo(todo);
                  }}
                >
                  <AiOutlineDelete size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  async function getTodos() {
    setLoading(true);
    const response = await axios.get(
      "https://adorable-worm-cap.cyclic.cloud/todos"
    );
    setTodos(response.data);
    setLoading(false);
    setBtnDisabled(false)
  }

  const handleButton = () => {
    setInputVisibility(!inputVisibility);
  };

  const editTodo = async () => {
    setLoading(true);
    setBtnDisabled(true)
    const response = await axios.put(
      "https://adorable-worm-cap.cyclic.cloud/todos",
      {
        id: selectedTodo.id,
        name: inputValue,
      }
    );
    setInputVisibility(false);
    setSelectedTodo();
    getTodos();
    setInputValue("");
  };

  async function addTodos() {
    setBtnDisabled(true)
    const response = await axios.post(
      "https://adorable-worm-cap.cyclic.cloud/todos",
      {
        name: inputValue,
      }
    );
    console.log(response);
    getTodos();
    setInputVisibility(!inputVisibility);
    setInputValue("");
  }

  async function deleteTodo(todo) {
    setLoading(true);
    const id = todo.id;
    const response = await axios.delete(
      `https://adorable-worm-cap.cyclic.cloud/todos/${id}`
    );
    getTodos();
  }

  async function modifyStatusTodo(todo) {
    const response = await axios.put(
      "https://adorable-worm-cap.cyclic.cloud/todos",
      {
        id: todo.id,
        status: !todo.status,
      }
    );
    getTodos();
  }

  async function handleWithEditButtonClick(todo) {
    setSelectedTodo(todo);
    setInputVisibility(true);
  }

  useEffect(() => {
    getTodos();
  }, [App]);

  return (
    <div className="w-screen flex flex-col justify-center items-center h-screen bg-blue-950 ">
      <header className="w-4/5 h-4/6 bg-white overflow-y-scroll md:max-w-[700px] max-h-[700px]">
        <div className="w-full border-2 text-center border-white bg-slate-500 p-2 mb-6 md:p-4">
          <h1 className="text-2xl text-white font-semibold">Daily Tasks</h1>
        </div>
        {loading ? (
          <div className="w-full h-5/6 flex justify-center items-center border-2">
            <Spinner color="red.500" w="50px" h="50px" />
          </div>
        ) : (
          <ToDo todo={todos} />
        )}
      </header>

      <div className="flex flex-col items-center md:w-[350px]">
        <input
          placeholder="Digite aqui"
          type="text"
          className={
            inputVisibility
              ? "h-14 w-[200px] mt-8 border-none px-4 rounded-lg md:w-full"
              : "hidden"
          }
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />

        <button
          className={btnDisabled? "bg-slate-500 p-4 rounded-2xl whitespace-nowrap border-[1px] border-white text-white font-semibold mt-8 opacity-20" : "bg-slate-500 p-4 rounded-2xl whitespace-nowrap border-[1px] border-white text-white font-semibold mt-8"}
          onClick={() => {
            inputVisibility
              ? selectedTodo
                ? editTodo()
                : addTodos()
              : handleButton();
          }}
          disabled={btnDisabled}
        >
          {inputVisibility ? "Confirmar" : "+ Nova tarefa"}
        </button>
      </div>
    </div>
  );
}

export default App;
