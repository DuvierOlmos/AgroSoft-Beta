import React, { useState } from "react";
import { motion } from "framer-motion";
import './login.css';

function Login({ switchToRegister }) {
  const [formData, setFormData] = useState({
    correo_electronico: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.correo_electronico) newErrors.correo_electronico = "Correo obligatorio";
    if (!formData.password) newErrors.password = "Contraseña obligatoria";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch(
        "http://localhost:3000/api/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) throw new Error("No se pudo conectar con el servidor");

      const data = await response.json();
      console.log("Login:", data);

      if (data.status === "error") {
        setErrors({ ...errors, password: data.message });
        setMessage("");
      } else if (data.status === "success") {
        setMessage(data.message);
        setErrors({});
        // Aquí puedes redirigir al dashboard si lo necesitas
      }

    } catch (error) {
      console.error(error);
      setMessage("ups..contraseña incorrecta.");
      setErrors({});
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="video-background-container" style={{ position: 'relative' }}>
      <img
        src="/img/1.png"
        alt="Logo"
        style={{
          position: "absolute",
          top: "30px",
          left: "30px",
          width: "70px",
          height: "auto",
          zIndex: 2,
          filter: "brightness(0) invert(0)"
        }}
      />
      {/* VIDEO DE FONDO */}
      <video autoPlay loop muted className="video-background">
        <source src="/video/vecteezy_the-farmer-is-working-and-inspecting-the-vegetables-in-the_7432637.mov" type="video/mp4" />
        Tu navegador no soporta videos de fondo.
      </video>

      {/* TARJETA DE LOGIN */}
      <motion.div
        className="login-container"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.8 }}
      >
        <div className="login-card">
          <motion.h3
            className="login-title login-title-underline"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Iniciar sesión
          </motion.h3>

          <form className="login-form" onSubmit={handleSubmit}>
            {["correo_electronico", "password"].map((field, index) => (
              <motion.div
                key={field}
                className="login-field"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
              >
                <label>
                  {field === "correo_electronico" ? "Correo electrónico" : "Contraseña"}
                </label>
                <input
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className={errors[field] ? "input-error" : ""}
                  placeholder={errors[field] ? errors[field] : field === "correo_electronico" ? "ejemplo@correo.com" : "********"}
                />
              </motion.div>
            ))}

            <motion.button
              type="submit"
              className="btn-login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Iniciar sesión
            </motion.button>
          </form>

          {message && <div className="login-message">{message}</div>}

          <div className="login-footer">
            <button type="button" className="btn-link-login" onClick={switchToRegister}>
              ¿No tienes cuenta? Regístrate aquí
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
