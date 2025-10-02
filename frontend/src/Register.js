import React, { useState } from "react";
import { Carousel, Container } from "react-bootstrap";
import { motion } from "framer-motion";
import './register.css';
import { DropdownButton, Dropdown, ButtonGroup } from "react-bootstrap";

function Register({ switchToLogin }) {
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    correo_electronico: "",
    password: "",
    documento_identidad: "",
    id_rol: ""
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.nombre_usuario) newErrors.nombre_usuario = "Nombre obligatorio";
    if (!formData.correo_electronico) newErrors.correo_electronico = "Correo obligatorio";
    if (!formData.password) newErrors.password = "Contraseña obligatoria";
    if (!formData.documento_identidad) newErrors.documento_identidad = "Documento obligatorio";
    if (!formData.id_rol) newErrors.id_rol = "Debes elegir un rol";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch(
        "http://localhost:3000/api/users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();
      console.log("Registro:", data);

      setMessage(data.message);
      setStatus(data.status);

      if (data.status === "success") {
        setTimeout(() => { switchToLogin(); }, 3000);
      }

    } catch (error) {
      console.error("Error al registrar:", error);
      setMessage("Algo salió mal 😔");
      setStatus("error");
    }
  };

  const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <Container fluid className="vh-100 d-flex justify-content-center align-items-center" style={{ position: 'relative' }}>
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
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.8 }}
        className="d-flex shadow-lg rounded-4 overflow-hidden"
        style={{ width: "800px", maxHeight: "90vh", minHeight: "500px" }}
      >
        {/* Carrusel */}
        <div className="d-none d-md-block" style={{ width: "50%", minHeight: "100%", maxHeight: "90vh" }}>
          <Carousel fade className="h-100">
            <Carousel.Item className="h-100">
              <img src="/img/food-3250439.jpg" alt="visual1" className="d-block w-100 h-100" style={{objectFit: "cover"}} />
            </Carousel.Item>
            <Carousel.Item className="h-100">
              <img src="/img/grapevine-7368800.jpg" alt="visual2" className="d-block w-100 h-100" style={{objectFit: "cover"}} />
            </Carousel.Item>
            <Carousel.Item className="h-100">
              <img src="/img/corn-5151505.jpg" alt="visual3" className="d-block w-100 h-100" style={{objectFit: "cover"}} />
            </Carousel.Item>
            <Carousel.Item className="h-100">
              <img src="/img/fruits-4728754.jpg" alt="visual4" className="d-block w-100 h-100" style={{objectFit: "cover"}} />
            </Carousel.Item>
            <Carousel.Item className="h-100">
              <img src="/img/peaches-7353447.jpg" alt="visual5" className="d-block w-100 h-100" style={{objectFit: "cover"}} />
            </Carousel.Item>
            <Carousel.Item className="h-100">
              <img src="/img/coffee-3911706.jpg" alt="visual6" className="d-block w-100 h-100" style={{objectFit: "cover"}} />
            </Carousel.Item>
            <Carousel.Item className="h-100">
              <img src="/img/pepper-1914117_1280.jpg" alt="visual6" className="d-block w-100 h-100" style={{objectFit: "cover"}} />
            </Carousel.Item>
            <Carousel.Item className="h-100">
              <img src="/img/papaya-7267391.jpg" alt="visual6" className="d-block w-100 h-100" style={{objectFit: "cover"}} />
            </Carousel.Item>
          </Carousel>
        </div>

        {/* Formulario */}
        <motion.div
          className="bg-light p-5"
          style={{ width: "50%", overflowY: "auto" }}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
        >
          <motion.h3 className="titulo-usuario mb-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            Registro de usuario 
          </motion.h3>

          <form onSubmit={handleSubmit}>
            {["nombre_usuario", "correo_electronico", "password", "documento_identidad"].map((field, index) => (
              <motion.div key={field} className="mb-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 * index }}>
                <label className="form-label">
                  {field === "nombre_usuario" ? "Nombre de usuario"
                    : field === "correo_electronico" ? "Correo electrónico"
                    : field === "password" ? "Contraseña"
                    : "Documento de identidad"}
                </label>
                <input
                  type={field === "password" ? "password" : "text"}
                  className={`form-control ${errors[field] ? "input-error" : ""}`}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={errors[field] ? errors[field] :
                    field === "nombre_usuario" ? "Escribe tu nombre" :
                    field === "correo_electronico" ? "ejemplo@correo.com" :
                    field === "password" ? "********" :
                    "123456789"
                  }
                />
              </motion.div>
            ))}

            <motion.div className="mb-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
              <label className="form-label px-3">Elige tu rol</label>
              <DropdownButton
                as={ButtonGroup}
                className={`dropdown-naranja ${errors.id_rol ? "input-error" : ""}`}
                title={
                  formData.id_rol
                    ? formData.id_rol === "1" ? "Cliente"
                    : formData.id_rol === "2" ? "Administrador"
                    : "Agricultor"
                    : errors.id_rol ? errors.id_rol : "Selecciona un rol"
                }
                onSelect={(eventKey) => setFormData({ ...formData, id_rol: eventKey })}
              >
                <Dropdown.Item eventKey="1">Cliente</Dropdown.Item>
                <Dropdown.Item eventKey="2">Administrador</Dropdown.Item>
                <Dropdown.Item eventKey="3">Agricultor</Dropdown.Item>
              </DropdownButton>
            </motion.div>

            <motion.button type="submit" className="btn-naranja mt-3" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Unirse a la familia
            </motion.button>
          </form>

          {message && (
            <div className={`toast-message ${status === "success" ? "toast-success" : "toast-error"} toast-show`}>
              {message}
            </div>
          )}

          <div className="text-center mt-3">
            <button type="button" className="btn btn-link-custom mt-3" onClick={switchToLogin}>
              ¿Tienes cuenta? Inicia sesión aquí
            </button>
          </div>
        </motion.div>
      </motion.div>
    </Container>
  );
}

export default Register;
