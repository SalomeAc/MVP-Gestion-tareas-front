import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import Login from "../assets/pages/login/Login";
import CreateList from "../assets/pages/create-list/CreateList";
import CreateTask from "../assets/pages/create-task/CreateTask";
import EditProfile from "../assets/pages/edit-profile/EditProfile";
import RecoverPassword from "../assets/pages/recover-password/RecoverPassword";
import ResetPassword from "../assets/pages/reset-password/ResetPassword";
import { loginUser, getUserProfile, updateUserProfile } from "../assets/pages/services/userServices";
import { createList, getUserLists } from "../assets/pages/services/listServices";
import { createTask } from "../assets/pages/services/taskService";

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

jest.mock("../assets/pages/services/userServices", () => ({
  loginUser: jest.fn(),
  getUserProfile: jest.fn(),
  updateUserProfile: jest.fn(),
}));

jest.mock("../assets/pages/services/listServices", () => ({
  createList: jest.fn(),
  getUserLists: jest.fn(),
}));

jest.mock("../assets/pages/services/taskService", () => ({
  createTask: jest.fn(),
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

test("Login valida campos vacios", () => {
  renderWithRouter(<Login />);

  fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

  expect(screen.getByText("Completa correo y contraseña")).toBeInTheDocument();
});

test("Login guarda token y navega si es correcto", async () => {
  loginUser.mockResolvedValue({ token: "jwt-123" });

  renderWithRouter(<Login />);

  fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "ana@mail.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
    target: { value: "Secreto123!" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

  await waitFor(() => {
    expect(localStorage.getItem("token")).toBe("jwt-123");
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});

test("CreateList muestra error si el titulo esta vacio", () => {
  localStorage.setItem("token", "token-demo");

  renderWithRouter(<CreateList />);

  fireEvent.click(screen.getByRole("button", { name: "Crear Lista" }));

  expect(screen.getByText("El título no puede estar vacío")).toBeInTheDocument();
});

test("CreateList crea una lista y vuelve al dashboard", async () => {
  localStorage.setItem("token", "token-demo");
  createList.mockResolvedValue({ _id: "list-1", title: "Trabajo" });

  renderWithRouter(<CreateList />);

  fireEvent.change(screen.getByLabelText("Nombre de la lista"), {
    target: { value: "Trabajo" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Crear Lista" }));

  await waitFor(() => {
    expect(createList).toHaveBeenCalledWith("Trabajo", "token-demo");
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});

test("CreateTask valida y envia una tarea nueva", async () => {
  localStorage.setItem("token", "token-demo");
  getUserLists.mockResolvedValue([{ _id: "list-1", title: "Trabajo" }]);
  createTask.mockResolvedValue({ _id: "task-1" });

  renderWithRouter(<CreateTask />, "/create-task?listId=list-1");

  await waitFor(() => {
    expect(screen.getByRole("option", { name: "Trabajo" })).toBeInTheDocument();
  });

  fireEvent.change(screen.getByLabelText(/Título \*/i), {
    target: { value: "Hacer prueba" },
  });
  fireEvent.change(screen.getByLabelText("Descripción"), {
    target: { value: "Descripcion corta" },
  });
  fireEvent.change(screen.getByLabelText("Fecha Límite"), {
    target: { value: new Date(Date.now() + 86400000).toISOString().slice(0, 16) },
  });
  fireEvent.click(screen.getByRole("button", { name: "Crear Tarea" }));

  await waitFor(() => {
    expect(createTask).toHaveBeenCalledWith(
      "token-demo",
      "list-1",
      expect.objectContaining({
        title: "Hacer prueba",
        description: "Descripcion corta",
        status: "pendiente",
      }),
    );
    expect(mockNavigate).toHaveBeenCalledWith("/tasks");
  });
});

test("EditProfile carga datos y envia cambios", async () => {
  localStorage.setItem("token", "token-demo");
  getUserProfile.mockResolvedValue({
    firstName: "Ana",
    lastName: "Perez",
    age: 22,
    email: "ana@mail.com",
  });
  updateUserProfile.mockResolvedValue({ ok: true });
  const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

  renderWithRouter(<EditProfile />);

  await waitFor(() => {
    expect(screen.getByDisplayValue("Ana")).toBeInTheDocument();
  });

  fireEvent.change(screen.getByDisplayValue("22"), {
    target: { value: "23" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Actualizar" }));

  await waitFor(() => {
    expect(updateUserProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: "Ana",
        lastName: "Perez",
        age: 23,
        email: "ana@mail.com",
      }),
      "token-demo",
    );
    expect(alertSpy).toHaveBeenCalledWith("Perfil actualizado con éxito ✅");
  });

  alertSpy.mockRestore();
});

test("RecoverPassword valida correo y envia enlace", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({}),
  });

  renderWithRouter(<RecoverPassword />);

  fireEvent.change(screen.getByPlaceholderText("usuario@ejemplo.com"), {
    target: { value: "correo-invalido" },
  });
  fireEvent.submit(screen.getByPlaceholderText("usuario@ejemplo.com").closest("form"));

  await waitFor(() => {
    expect(screen.getByText("Por favor ingresa un correo válido.")).toBeInTheDocument();
  });

  fireEvent.change(screen.getByPlaceholderText("usuario@ejemplo.com"), {
    target: { value: "ana@mail.com" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enviar enlace" }));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      "https://lumo-back-1.onrender.com/api/users/recover-password",
      expect.objectContaining({ method: "POST" }),
    );
    expect(screen.getByText("Se ha enviado un enlace a ana@mail.com")).toBeInTheDocument();
  });
});

test("ResetPassword bloquea contrasenas debiles y acepta una correcta", async () => {
  jest.useFakeTimers();
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({}),
  });

  renderWithRouter(<ResetPassword />, "/reset-password?token=reset-token");

  fireEvent.change(screen.getByPlaceholderText("Nueva contraseña"), {
    target: { value: "abc" },
  });
  fireEvent.change(screen.getByPlaceholderText("Confirmar contraseña"), {
    target: { value: "abc" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Guardar contraseña" }));

  expect(screen.getByText(/La contraseña necesita:/i)).toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText("Nueva contraseña"), {
    target: { value: "Secreto123!" },
  });
  fireEvent.change(screen.getByPlaceholderText("Confirmar contraseña"), {
    target: { value: "Secreto123!" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Guardar contraseña" }));

  await waitFor(() => {
    expect(screen.getByText("Contraseña actualizada correctamente")).toBeInTheDocument();
  });

  act(() => {
    jest.advanceTimersByTime(1500);
  });

  expect(mockNavigate).toHaveBeenCalledWith("/login");
  jest.useRealTimers();
});