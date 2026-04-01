import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
		<div className="mobile-wrapper">
			<section className="mobile-card card">
				<div className="login-header">
					<div className="login-icon" aria-hidden="true">
						<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M9 16L13 12L9 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							<path d="M13 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							<path d="M14 4H19C20.1 4 21 4.9 21 6V18C21 19.1 20.1 20 19 20H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</div>
					<h2>Bienvenido</h2>
					<p>Ingresa a tu cuenta</p>
				</div>

				<form onSubmit={handleSubmit} className="login-form">
				<div className="row login-row">
					<input
						id="email"
						name="email"
						type="email"
						placeholder="Email"
						value={form.email}
						onChange={handleChange}
						autoComplete="email"
						className="login-input"
					/>
				</div>

				<div className="row login-row">
					<input
						id="password"
						name="password"
						type="password"
						placeholder="Contraseña"
						value={form.password}
						onChange={handleChange}
						className="login-input"
					/>
				</div>

				{message && (
					<p style={{ color: error ? "#b42318" : "#027a48", marginBottom: "1rem" }}>
						{message}
					</p>
				)}

				<button className="login-submit-btn" type="submit" disabled={loading}>
					{loading ? "Ingresando..." : "Ingresar"}
				</button>

				<div className="login-forgot-row">
					<Link to="/recover-password" className="login-forgot-link">
						¿Olvidaste tu contraseña?
					</Link>
					
				</div>

				</form>
			</section>
		</div>
	);
};

export default Login;
