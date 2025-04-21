document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('userForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const userList = document.getElementById('userList');
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
  
      if (!name || !email) {
        alert("Completa todos los campos.");
        return;
      }
  
      const li = document.createElement('li');
      li.innerHTML = `${name} (${email}) <button class="delete-btn">Eliminar</button>`;
  
      userList.appendChild(li);
  
      nameInput.value = '';
      emailInput.value = '';
    });
  
    userList.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) {
        e.target.parentElement.remove();
      }
    });
  });
  