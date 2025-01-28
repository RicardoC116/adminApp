// Función para capitalizar la primera letra
export const capitalizeFirstLetter = (text) => {
  if (!text) return ""; // Manejar caso nulo o vacío
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
