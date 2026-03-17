import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/userServices";
import "./Login.css";

const Login = () => {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		email: "",
		password: "",
	});
	const [message, setMessage] = useState("");
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!form.email || !form.password) {
			setMessage("Completa correo y contraseña");
			setError(true);
			return;
		}

		setLoading(true);
		setMessage("");

		try {
			const data = await loginUser(form);
			const token = data?.token || data?.accessToken;

			if (!token) {
				throw new Error("No se recibió token de autenticación");
			}

			localStorage.setItem("token", token);
			setError(false);
			navigate("/dashboard");
		} catch (err) {
			setMessage(err.message || "Credenciales inválidas");
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="card" style={{ maxWidth: 420, margin: "3rem auto" }}>
			<h2>Iniciar sesión</h2>
			<form onSubmit={handleSubmit}>
				<div className="row" style={{ marginBottom: "1rem" }}>
					<label htmlFor="email">Correo</label>
					<input
						id="email"
						name="email"
						type="email"
						value={form.email}
						onChange={handleChange}
						autoComplete="email"
					/>
				</div>

				<div className="row" style={{ marginBottom: "1rem" }}>
					<label htmlFor="password">Contraseña</label>
					<input
						id="password"
						name="password"
						type="password"
						value={form.password}
						onChange={handleChange}
						autoComplete="current-password"
					/>
				</div>

				{message && (
					<p style={{ color: error ? "#b42318" : "#027a48", marginBottom: "1rem" }}>
						{message}
					</p>
				)}

				<button type="submit" disabled={loading}>
					{loading ? "Ingresando..." : "Ingresar"}
				</button>
			</form>
		</section>
	);
};

export default Login;
