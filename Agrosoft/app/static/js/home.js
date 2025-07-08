document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('cta-button');

  button.addEventListener('click', () => {
    alert('¡Bienvenido a AgroSoft! Conéctate o explora el catálogo.');
    window.location.href = '/login'; // Cambia si usas una ruta diferente
  });
});
