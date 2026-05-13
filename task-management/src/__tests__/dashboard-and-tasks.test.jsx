import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "../assets/pages/dashboard/Dashboard";
import Tasks from "../assets/pages/tasks/Tasks";
import { getUserLists, deleteList, updateList } from "../assets/pages/services/listServices";
import { getTasks, deleteTask, updateTask, getAllTasks } from "../assets/pages/services/taskService";

const mockNavigate = jest.fn();
let mockSearchParams = "";

jest.mock("react-router-dom", () => {
  return {
    Link: ({ children }) => children,
    Navigate: () => null,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams(mockSearchParams), jest.fn()],
  };
});

jest.mock("../assets/pages/services/listServices", () => ({
  getUserLists: jest.fn(),
  deleteList: jest.fn(),
  updateList: jest.fn(),
}));

jest.mock("../assets/pages/services/taskService", () => ({
  getTasks: jest.fn(),
  deleteTask: jest.fn(),
  updateTask: jest.fn(),
  getAllTasks: jest.fn(),
}));

const renderWithRouter = (ui, route = "/") => {
  mockSearchParams = route.includes("?") ? route.split("?")[1] : "";
  return render(ui);
};

beforeEach(() => {
  localStorage.clear();
  mockNavigate.mockReset();
  jest.clearAllMocks();
});

test("Tasks carga tareas, filtra y elimina una tarea", async () => {
  localStorage.setItem("token", "token-demo");
  getAllTasks.mockResolvedValue([
    {
      _id: "task-1",
      title: "Diseñar UI",
      status: "pendiente",
      description: "Boceto inicial",
    },
    {
      _id: "task-2",
      title: "Publicar demo",
      status: "finalizada",
    },
  ]);
  deleteTask.mockResolvedValue({ ok: true });

  renderWithRouter(<Tasks />);

  await waitFor(() => {
    expect(screen.getByText("Diseñar UI")).toBeInTheDocument();
    expect(screen.getByText("Publicar demo")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole("button", { name: "Completadas" }));
  expect(screen.queryByText("Diseñar UI")).not.toBeInTheDocument();
  expect(screen.getByText("Publicar demo")).toBeInTheDocument();

  fireEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
  expect(screen.getByText(/¿Eliminar tarea\?/i)).toBeInTheDocument();

  fireEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[1]);

  await waitFor(() => {
    expect(deleteTask).toHaveBeenCalledWith("token-demo", "task-2");
  });
});

test("Dashboard carga listas, tareas y permite cambiar de lista", async () => {
  localStorage.setItem("token", "token-demo");
  getUserLists.mockResolvedValue([
    { _id: "list-1", title: "Lista principal" },
    { _id: "list-2", title: "Otra lista" },
  ]);
  getTasks.mockResolvedValue([
    {
      _id: "task-1",
      title: "Diseñar pantalla",
      status: "pendiente",
      description: "Pendiente de estilo",
    },
  ]);
  updateTask.mockResolvedValue({ ok: true });
  deleteList.mockResolvedValue({ ok: true });
  updateList.mockResolvedValue({ ok: true });

  renderWithRouter(<Dashboard />);

  await waitFor(() => {
    expect(screen.getByRole("heading", { name: "Lista principal" })).toBeInTheDocument();
    expect(screen.getByText("Diseñar pantalla")).toBeInTheDocument();
  });

  expect(screen.getByText(/0 de 1 tareas completadas/i)).toBeInTheDocument();

  fireEvent.change(screen.getByRole("combobox"), {
    target: { value: "finalizada" },
  });

  await waitFor(() => {
    expect(updateTask).toHaveBeenCalledWith("token-demo", "task-1", { status: "finalizada" });
  });

  fireEvent.click(screen.getByRole("button", { name: "Otra lista" }));

  await waitFor(() => {
    expect(getTasks).toHaveBeenCalledTimes(2);
  });
});

test("Dashboard redirige al login sin token", () => {
  renderWithRouter(<Dashboard />);

  expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
});