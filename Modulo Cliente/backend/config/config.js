module.exports = {
  // Configuración de la paginación para las listas de productos
  pagination: {
    itemsPerPage: 10,
    maxItemsPerPage: 50,
  },

  // Niveles de roles de usuario
  userRoles: {
    ADMIN: 'admin',
    USER: 'user',
    GUEST: 'guest',
  },

  // Configuración general de la API
  api: {
    version: 'v1',
    name: 'Tienda Online API',
  },

  // Otros parámetros del sistema
  system: {
    defaultCurrency: 'USD',
  },
};