import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Layout from "../assets/layout/Layout";
import Footer from "../assets/layout/footer/Footer";
import Header from "../assets/layout/header/Header";
import Sidebar from "../assets/components/Sidebar";
import LandingPage from "../assets/pages/landing/LandingPage";
import About from "../assets/pages/about/About";
import Contact from "../assets/pages/contact/Contact";
import { getUserLists } from "../assets/pages/services/listServices";
import { getUserProfile } from "../assets/pages/services/userServices";

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
}));

jest.mock("../assets/pages/services/userServices", () => ({
  getUserProfile: jest.fn(),
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

test("Layout agrega y elimina la clase del body", () => {
  const { unmount } = renderWithRouter(
    <Layout>
      <div>Contenido</div>
    </Layout>,
  );

  expect(document.body).toHaveClass("app-layout-active");
  expect(screen.getByText("Contenido")).toBeInTheDocument();

  unmount();

  expect(document.body).not.toHaveClass("app-layout-active");
});

test("Header muestra enlaces anonimos y abre el menu", () => {
  const { container } = renderWithRouter(<Header />);

  expect(container.querySelector(".navbar-nav")).toHaveTextContent("Iniciar sesion");
  expect(container.querySelector(".navbar-nav")).toHaveTextContent("Registro");

  fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));

  expect(container.querySelector(".navbar-nav")).toHaveClass("open");
});

test("Header muestra enlaces autenticados", () => {
  localStorage.setItem("token", "token-demo");

  const { container } = renderWithRouter(<Header />);

  expect(container.querySelector(".navbar-nav")).toHaveTextContent("Dashboard");
  expect(container.querySelector(".navbar-nav")).toHaveTextContent("Tareas");
  expect(container.querySelector(".navbar-nav")).toHaveTextContent("Perfil");
  expect(container.querySelector(".navbar-nav")).toHaveTextContent("Cerrar sesion");
});

test("Footer renderiza el anio actual y enlaces", () => {
  renderWithRouter(<Footer />);

  expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  expect(screen.getByText("Inicio")).toBeInTheDocument();
  expect(screen.getByText("Acerca de")).toBeInTheDocument();
  expect(screen.getByText("Contacto")).toBeInTheDocument();
});

test("LandingPage muestra login y registro cuando no hay sesion", async () => {
  renderWithRouter(<LandingPage />);

  expect(screen.getByText("Log in")).toBeInTheDocument();
  expect(screen.getByText("Register")).toBeInTheDocument();
  expect(getUserProfile).not.toHaveBeenCalled();
});

test("LandingPage muestra acceso al dashboard si la sesion es valida", async () => {
  localStorage.setItem("token", "token-demo");
  getUserProfile.mockResolvedValue({ firstName: "Ana" });

  renderWithRouter(<LandingPage />);

  await waitFor(() => {
    expect(screen.getByText("Ir al Dashboard")).toBeInTheDocument();
  });
});

test("Sidebar carga listas y permite seleccionar una", async () => {
  localStorage.setItem("token", "token-demo");
  getUserProfile.mockResolvedValue({ firstName: "Ana", lastName: "Perez" });
  getUserLists.mockResolvedValue([
    { _id: "list-1", title: "Trabajo" },
    { _id: "list-2", title: "Personal" },
  ]);

  renderWithRouter(<Sidebar />);

  await waitFor(() => {
    expect(screen.getByText("Ana Perez")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole("button", { name: /listas/i }));
  fireEvent.click(screen.getByRole("button", { name: "Trabajo" }));

  expect(localStorage.getItem("currentListId")).toBe("list-1");
  expect(localStorage.getItem("currentListTitle")).toBe("Trabajo");
  expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
});

test("About y Contact renderizan sus titulos principales", () => {
  renderWithRouter(
    <>
      <About />
      <Contact />
    </>,
  );

  expect(screen.getByText(/Somos más que un simple planificador/i)).toBeInTheDocument();
  expect(screen.getByText("Contáctanos")).toBeInTheDocument();
});