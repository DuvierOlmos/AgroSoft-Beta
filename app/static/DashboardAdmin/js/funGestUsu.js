
function showModule(id) {
    document.querySelectorAll("aside ul li").forEach(li => li.classList.remove("active"));
    event.target.classList.add("active");
    document.querySelectorAll("main section").forEach(section => section.classList.remove("active"));
    document.getElementById(id).classList.add("active");
  }

  const userForm = document.getElementById("userForm");
  const usersTable = document.querySelector("#usersTable tbody");
function getUsers() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
  }

  function saveUsers(users) {
    localStorage.setItem("usuarios", JSON.stringify(users));
  }

  function renderUsers() {
    const users = getUsers();
    usersTable.innerHTML = "";
    users.forEach((user, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.nombre}</td>
        <td>${user.email}</td>
        <td>${user.rol}</td>
        <td>
          <button class="edit-btn" onclick='editUser(${index})'><i class="fas fa-edit"></i></button>
          <button class="delete-btn" onclick='deleteUser(${index})'><i class="fas fa-trash-alt"></i></button>
        </td>
      `;
      usersTable.appendChild(row);
    });
  }

  function editUser(index) {
    const users = getUsers();
    const user = users[index];
    document.getElementById("userId").value = index;
    document.getElementById("nombre").value = user.nombre;
    document.getElementById("email").value = user.email;
    document.getElementById("rol").value = user.rol;
  }

  function deleteUser(index) {
    let users = getUsers();
    users.splice(index, 1);
    saveUsers(users);
    renderUsers();
  }

  userForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const id = document.getElementById("userId").value;
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const rol = document.getElementById("rol").value;

    let users = getUsers();
    if (id) {
      users[id] = { nombre, email, rol };
    } else {
      users.push({ nombre, email, rol });
    }
    saveUsers(users);
    renderUsers();
    userForm.reset();
  });

  renderUsers();
  function buscarUsuarios() {
    const termino = document.getElementById("buscarUsuario").value.trim().toLowerCase();
    const users = getUsers();
    usersTable.innerHTML = "";
  
    users.forEach((user, index) => {
      const id = (index + 1).toString(); // Convertimos el ID a string para compararlo
      if (
        id.includes(termino) ||
        user.nombre.toLowerCase().includes(termino) ||
        user.email.toLowerCase().includes(termino) ||
        user.rol.toLowerCase().includes(termino)
      ) {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${user.nombre}</td>
          <td>${user.email}</td>
          <td>${user.rol}</td>
          <td>
            <button class="edit-btn" onclick='editUser(${index})'><i class="fas fa-edit"></i></button>
            <button class="delete-btn" onclick='deleteUser(${index})'><i class="fas fa-trash-alt"></i></button>
          </td>
        `;
        usersTable.appendChild(row);
      }
    });
  }