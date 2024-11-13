/**
 * Gestor de Tema (Claro/Oscuro) para X.com Thread Generator
 * -------------------------------------------------------
 * Maneja el cambio de tema y su persistencia en localStorage.
 * 
 * Funcionalidades:
 * - Cambio entre tema claro y oscuro
 * - Persistencia del tema seleccionado
 * - Carga del tema guardado al iniciar
 * 
 * @author @686f6c61
 * @license MIT
 */

document.addEventListener('DOMContentLoaded', () => {
    // Obtener referencias a elementos del DOM
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme');

    /**
     * Inicializar tema guardado si existe
     * Establece el tema guardado y actualiza el estado del switch
     */
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
        }
    }

    /**
     * Cambia el tema de la aplicación
     * @param {Event} e - Evento del cambio de switch
     */
    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }    
    }

    // Event listener para cambios en el switch
    toggleSwitch.addEventListener('change', switchTheme, false);
}); 