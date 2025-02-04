// import { useEffect, useState } from "react";
import { ChangeEvent, FormEvent, useState } from "react";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import { ITodo } from "../interfaces";
import axiosInstance from "../config/axios.config";
import TodoSkeleton from "./TodoSkeleton";

const TodoList = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [queryVersion, setQueryVersion] = useState(1);
  const [todoToEdit, setTodoToEdit] = useState<ITodo>({
    id: 0,
    title: "",
    description: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  // const [todoToAdd, setTodoToAdd] = useState({
  //   title: "",
  //   description: "",
  // });
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  // const [isOpenAddModal, setIsOpenAddModal] = useState(false);

  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;


  const { isPending, data } = useAuthenticatedQuery({
    queryKey: ['todoList', `${queryVersion}`],
    url: '/users/me?populate=todos',
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      }
    }
  });

  function onOpenEditModal(todo: ITodo) {
    // console.log(todo)
    setTodoToEdit(todo)
    setIsEditModalOpen(true)
  }

  function closeEditModal() {
    setTodoToEdit({
      id: 0,
      title: "",
      description: "",
    });

    setIsEditModalOpen(false)
  }

  function openConfirmModal(todo: ITodo) {
    setTodoToEdit(todo)
    setIsOpenConfirmModal(true)
  }

  function closeConfirmModal() {
    setIsOpenConfirmModal(false)
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value, name } = e.target;
    setTodoToEdit({
      ...todoToEdit,
      [name]: value,
    });
    // console.log(todoToEdit)
  };



  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsUpdating(true)
    try {
      const { status } = await axiosInstance.put(`/todos/${todoToEdit.documentId}`, {
        data: {
          title: todoToEdit.title,
          description: todoToEdit.description,
        }
      }, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        }
      })

      if (status === 200) {
        closeEditModal();
        setQueryVersion((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsUpdating(false)
    }
  };


  const onRemove = async () => {
    try {
      const { status } = await axiosInstance.delete(`/todos/${todoToEdit.documentId}`, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        },
      });
      if (status === 204) {
        closeConfirmModal();
        setQueryVersion((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };




  // useEffect(() => {
  //   try {
  //     axiosInstance.get('/users/me?populate=todos', {
  //       headers: {
  //         Authorization: `Bearer ${userData.jwt}`,
  //       }
  //     }).then((res) => {
  //       // console.log(res.data.todos);
  //       setTodos(res.data.todos);
  //     }).catch((error) => {
  //       console.log(error);
  //     });
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [userData.jwt]);

  // const { isPending, error, data } = useQuery({
  //   queryKey: ['todos'],
  //   queryFn: async () => {
  //     const { data } = await axiosInstance.get('/users/me?populate=todos', {
  //       headers: {
  //         Authorization: `Bearer ${userData.jwt}`,
  //       }
  //     })
  //     return data
  //   }
  // })

  // console.log({ isPending, error, data })

  // if (isPending) return 'Loading...'

  if (isPending) return (
    <div className="space-y-10 animate-pulse" role="status" >
      {Array.from({ length: 3 }).map((_, index) => (
        <TodoSkeleton key={index} />
      ))}
    </div>
  );

  // if (error) return 'An error has occurred: ' + error.message

  return (
    <div className="space-y-1 ">

      <div className="flex w-fit mx-auto my-10 gap-x-2">
        <Button variant="default"  size={"sm"}>
          Post new todo
        </Button>
        <Button variant="outline"  size={"sm"}>
          Generate todos
        </Button>
      </div>

      {data.todos.length ? data.todos.map((todo: ITodo, index: number) => {
        return (
          <div key={todo.id} className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100">
            <p className="w-full font-semibold">{++index} - {todo.title}</p>
            <div className="flex items-center justify-end w-full space-x-3">
              <Button onClick={() => onOpenEditModal(todo)} size={"sm"}>Edit</Button>
              <Button onClick={() => openConfirmModal(todo)} variant={"danger"} size={"sm"}>
                Remove
              </Button>
            </div>
          </div>
        )
      }) : <h3>No Todos Yet!</h3>}



      {/* Edit todo Modal */}
      <Modal
        isOpen={isEditModalOpen}
        closeModal={closeEditModal}
        title="Edit this todo"
      >
        <form className="space-y-3" onSubmit={onSubmitHandler} >
          <Input
            name="title"
            value={todoToEdit.title}
            onChange={onChangeHandler}
          />
          <Textarea
            name="description"
            value={todoToEdit.description}
            onChange={onChangeHandler}
          />
          <div className="flex items-center space-x-3 mt-4">
            <Button
              className="bg-indigo-700 hover:bg-indigo-800"
              isLoading={isUpdating}
            >
              Update
            </Button>
            <Button onClick={closeEditModal} variant={"cancel"} >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete todo Modal */}
      <Modal
        isOpen={isOpenConfirmModal}
        closeModal={closeConfirmModal}
        title="Are you sure you want to remove this todo from your store ?"
        description="Deleting this todo will remove it permenantly from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
      >
        <div className="flex items-center space-x-3 mt-4">
          <Button variant="danger" onClick={onRemove}>
            Yes , Remove
          </Button>
          <Button variant="cancel" type="button" onClick={closeConfirmModal}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
