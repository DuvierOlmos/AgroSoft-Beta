import React, { useState } from "react";
import Register from "./components/register";
import Login from "./components/login";

function App() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div>
      {showLogin ? (
        <Login switchToRegister={() => setShowLogin(false)} />
      ) : (
        <Register switchToLogin={() => setShowLogin(true)} />
      )}
    </div>
  );
}

export default App;
