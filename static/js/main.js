/**
 * Generador de Hilos para X.com (Twitter)
 * ---------------------------------------
 * Gestiona la interactividad del frontend para la generación de hilos.
 * Incluye funcionalidades para:
 * - Selección de tweets para hashtags y emojis
 * - Gestión de estilos de escritura
 * - Manejo de formularios y respuestas
 * - Sistema de copiado de tweets
 * 
 * @author @686f6c61
 * @license MIT
 */

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const numTweetsInput = document.querySelector('[name="num_tweets"]');
    const hashtagsToggle = document.querySelector('[name="usar_hashtags"]');
    const emojisToggle = document.querySelector('[name="usar_emojis"]');
    const hashtagsMode = document.querySelectorAll('[name="hashtags_mode"]');
    const emojisMode = document.querySelectorAll('[name="emojis_mode"]');
    const hashtagSelector = document.getElementById('hashtagTweetSelector');
    const emojiSelector = document.getElementById('emojiTweetSelector');
    const estiloSelector = document.getElementById('estiloSelector');
    const estiloDescripcion = document.getElementById('estiloDescripcion');
    const estiloEjemplo = document.getElementById('estiloEjemplo');
    
    /**
     * Crea los selectores numéricos para tweets
     * @param {HTMLElement} container - Contenedor para los números
     * @param {string} type - Tipo de selector ('hashtags' o 'emojis')
     */
    function createTweetNumbers(container, type) {
        const numTweets = parseInt(numTweetsInput.value);
        const numbersContainer = container.querySelector('.tweet-numbers');
        numbersContainer.innerHTML = '';
        
        for (let i = 1; i <= numTweets; i++) {
            const numberDiv = document.createElement('div');
            numberDiv.className = 'tweet-number';
            numberDiv.textContent = i;
            numberDiv.dataset.number = i;
            
            numberDiv.addEventListener('click', function() {
                this.classList.toggle('selected');
                updateSelectedTweets(container, type);
            });
            
            numbersContainer.appendChild(numberDiv);
        }
    }
    
    /**
     * Actualiza los tweets seleccionados en el input hidden
     * @param {HTMLElement} container - Contenedor de los números
     * @param {string} type - Tipo de selector ('hashtags' o 'emojis')
     */
    function updateSelectedTweets(container, type) {
        const selected = Array.from(container.querySelectorAll('.tweet-number.selected'))
            .map(el => el.dataset.number)
            .join(',');
            
        let input = container.querySelector(`input[name="selected_${type}"]`);
        if (!input) {
            input = document.createElement('input');
            input.type = 'hidden';
            input.name = `selected_${type}`;
            container.appendChild(input);
        }
        input.value = selected;
    }
    
    // Event Listeners para la gestión de hashtags
    hashtagsToggle.addEventListener('change', function() {
        const options = document.getElementById('hashtagsOptions');
        options.style.display = this.checked ? 'block' : 'none';
    });
    
    hashtagsMode.forEach(radio => {
        radio.addEventListener('change', function() {
            hashtagSelector.classList.toggle('hidden', this.value !== 'custom');
            if (this.value === 'custom') {
                createTweetNumbers(hashtagSelector, 'hashtags');
            }
        });
    });

    // Event Listeners para Emojis
    emojisToggle.addEventListener('change', function() {
        const options = document.getElementById('emojisOptions');
        options.style.display = this.checked ? 'block' : 'none';
    });
    
    emojisMode.forEach(radio => {
        radio.addEventListener('change', function() {
            emojiSelector.classList.toggle('hidden', this.value !== 'custom');
            if (this.value === 'custom') {
                createTweetNumbers(emojiSelector, 'emojis');
            }
        });
    });
    
    // Event listener para cambios en número de tweets
    numTweetsInput.addEventListener('change', function() {
        if (!hashtagSelector.classList.contains('hidden')) {
            createTweetNumbers(hashtagSelector, 'hashtags');
        }
        if (!emojiSelector.classList.contains('hidden')) {
            createTweetNumbers(emojiSelector, 'emojis');
        }
    });
    
    // Inicialización
    createTweetNumbers(hashtagSelector, 'hashtags');
    createTweetNumbers(emojiSelector, 'emojis');

    // Añadir al JavaScript existente
    const estilos = {
        formal: {
            nombre: 'Formal y profesional',
            descripcion: 'Lenguaje corporativo y serio, ideal para temas de negocios, tecnología o análisis',
            ejemplo: '🔍 Análisis detallado: el impacto de la inteligencia artificial en el sector financiero durante 2024\n\nDatos, tendencias y predicciones basadas en informes de Goldman Sachs y McKinsey\n\nAbro hilo 🧵'
        },
        casual: {
            nombre: 'Casual y conversacional',
            descripcion: 'Tono relajado y cercano, como una charla entre amigos, perfecto para explicar temas complejos',
            ejemplo: 'Hey! 👋 ¿Te has preguntado cómo funciona realmente Bitcoin pero te da pereza leer textos técnicos?\n\nTe lo explico en este hilo de forma súper sencilla, como si estuviéramos tomando un café ☕\n\nVamos allá 👇'
        },
        humoristico: {
            nombre: 'Humorístico',
            descripcion: 'Divertido y entretenido, usa analogías graciosas y situaciones cotidianas para explicar conceptos',
            ejemplo: '😅 Guía definitiva para sobrevivir a reuniones que podrían haber sido un email\n\nO como perder tu tiempo de forma profesional mientras finges interés en powerpoints infinitos\n\nHilo para no dormir(te) 💤'
        },
        sarcastico: {
            nombre: 'Sarcástico',
            descripcion: 'Ironía inteligente y comentarios ingeniosos, perfecto para críticas constructivas o análisis diferentes',
            ejemplo: '🎭 Ah, el maravilloso mundo de las criptomonedas\n\nDonde todo el mundo es experto... hasta que no lo es\n\nGuía sarcástica de cómo perder dinero mientras finges saber de lo que hablas\n\nHilo imperdible 👇'
        },
        educativo: {
            nombre: 'Educativo',
            descripcion: 'Explicativo y didáctico, organizado en pasos claros y con ejemplos prácticos',
            ejemplo: '📚 Machine Learning explicado paso a paso\n\nDe 0 a "ahora lo entiendo" en un solo hilo\n\nConceptos básicos + ejemplos prácticos + recursos gratuitos\n\nGuarda este hilo para consultas futuras 🧵'
        },
        inspirador: {
            nombre: 'Inspirador y motivacional',
            descripcion: 'Positivo y motivador, combina historias reales con consejos prácticos',
            ejemplo: '✨ Tu viaje hacia el éxito comienza hoy\n\n3 historias reales de emprendedores que empezaron desde cero\n\nLecciones + consejos prácticos + recursos\n\nHilo para cambiar tu mentalidad 🧠'
        },
        storytelling: {
            nombre: 'Narrativo (storytelling)',
            descripcion: 'Cuenta historias cautivadoras, ideal para casos de estudio y experiencias',
            ejemplo: '🌟 "Nunca funcionará"\n\nEso le dijeron a Brian Chesky cuando presentó la idea de Airbnb\n\nHoy vale más de 100B$\n\nLa historia completa en este hilo 🧵'
        },
        tecnico: {
            nombre: 'Técnico y detallado',
            descripcion: 'Profundiza en detalles técnicos manteniendo la claridad, ideal para tutoriales y guías',
            ejemplo: '⚡ Tutorial paso a paso: Crea una API REST en Node.js\n\nCódigo + explicaciones + mejores prácticas\n\nDe principiante a producción en un solo hilo\n\nGuarda este recurso 💾'
        },
        debate: {
            nombre: 'Debate y análisis',
            descripcion: 'Presenta diferentes perspectivas de forma objetiva, ideal para temas controvertidos',
            ejemplo: '⚖️ ¿Regulación cripto?\n\nPros y contras analizados objetivamente\n\nArgumentos de expertos + casos reales + conclusiones basadas en datos\n\nHilo para pensar 🤔'
        },
        minimalista: {
            nombre: 'Minimalista y directo',
            descripcion: 'Va al grano sin rodeos, perfecto para consejos rápidos y tips prácticos',
            ejemplo: '💡 5 hábitos para ser más productivo:\n\n1. Planifica la noche anterior\n2. No revises el móvil al despertar\n3. Técnica pomodoro\n4. Pausas activas\n5. Revisa y ajusta\n\nFin del hilo.'
        }
    };

    function actualizarInfoEstilo() {
        const estilo = estilos[estiloSelector.value];
        estiloDescripcion.textContent = estilo.descripcion;
        estiloEjemplo.textContent = estilo.ejemplo;
    }

    estiloSelector.addEventListener('change', actualizarInfoEstilo);
    actualizarInfoEstilo(); // Inicializar con el primer valor

    // Gestión de botones de ayuda y tooltips
    const helpButtons = document.querySelectorAll('.help-button');
    
    helpButtons.forEach(button => {
        const field = button.closest('.field');
        const tooltip = field.querySelector('.example-tooltip');
        
        // Mostrar/ocultar ejemplos al hacer click
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Cerrar otros tooltips abiertos
            document.querySelectorAll('.example-tooltip').forEach(tip => {
                if (tip !== tooltip) {
                    tip.style.display = 'none';
                }
            });
            
            // Toggle del tooltip actual
            if (tooltip.style.display === 'block') {
                tooltip.style.display = 'none';
            } else {
                tooltip.style.display = 'block';
            }
        });
    });
    
    // Cerrar tooltips al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.field')) {
            document.querySelectorAll('.example-tooltip').forEach(tooltip => {
                tooltip.style.display = 'none';
            });
        }
    });

    const tweetCountInput = document.querySelector('[name="num_tweets"]');
    const decreaseBtn = document.querySelector('.count-btn.decrease');
    const increaseBtn = document.querySelector('.count-btn.increase');

    function updateTweetCount(change) {
        let currentValue = parseInt(tweetCountInput.value);
        let newValue = currentValue + change;
        
        // Validar límites
        if (newValue >= 2 && newValue <= 20) {
            tweetCountInput.value = newValue;
            // Disparar evento change para actualizar selectores
            tweetCountInput.dispatchEvent(new Event('change'));
        }
    }

    decreaseBtn.addEventListener('click', () => updateTweetCount(-1));
    increaseBtn.addEventListener('click', () => updateTweetCount(1));

    // Validar input manual
    tweetCountInput.addEventListener('input', function() {
        let value = parseInt(this.value);
        if (value < 2) this.value = 2;
        if (value > 20) this.value = 20;
    });

    // Añadir el event listener al formulario
    const form = document.getElementById('threadForm');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const resultDiv = document.getElementById('result');
        const loadingDiv = document.querySelector('.loading');
        
        try {
            // Mostrar estado de carga
            submitButton.style.display = 'none';
            loadingDiv.style.display = 'block';
            resultDiv.style.display = 'none';
            
            const formData = new FormData(form);
            const response = await fetch('/generate', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Error generando el hilo');
            }
            
            // Mostrar los tweets
            resultDiv.style.display = 'block';
            const tweetsContainer = resultDiv.querySelector('.tweets-container');
            tweetsContainer.innerHTML = data.tweets.map((tweet, index) => `
                <div class="tweet-box">
                    <button class="copy-button" onclick="copyTweet(this)">
                        <i class="mdi mdi-content-copy"></i>
                    </button>
                    <p>${tweet}</p>
                </div>
            `).join('');
            
        } catch (error) {
            console.error('Error:', error);
            // Mostrar error
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = `
                <div class="notification is-danger">
                    <button class="delete"></button>
                    ${error.message}
                </div>
            `;
        } finally {
            // Restaurar estado
            loadingDiv.style.display = 'none';
            submitButton.style.display = 'block';
        }
    });

    /**
     * Copia el contenido de un tweet al portapapeles
     * @param {HTMLElement} tweetBox - Elemento que contiene el tweet
     */
    window.copyTweet = function(tweetBox) {
        try {
            const tweetText = tweetBox.innerText;
            navigator.clipboard.writeText(tweetText)
                .then(() => {
                    tweetBox.classList.add('tweet-copied');
                    setTimeout(() => {
                        tweetBox.classList.remove('tweet-copied');
                    }, 200);
                    showCopyNotification();
                })
                .catch(err => console.error('Error al copiar:', err));
        } catch (error) {
            console.error('Error al copiar tweet:', error);
        }
    };

    /**
     * Muestra una notificación temporal de copiado exitoso
     */
    window.showCopyNotification = function() {
        const notification = document.getElementById('copyNotification');
        if (!notification) return;
        
        notification.style.display = 'flex';
        notification.classList.add('show-notification');
        
        setTimeout(() => {
            notification.classList.remove('show-notification');
            setTimeout(() => {
                notification.style.display = 'none';
            }, 300);
        }, 2000);
    };

    // Actualizar la función que muestra los tweets
    function displayTweets(tweets) {
        const resultDiv = document.getElementById('result');
        if (!resultDiv) return;
        
        resultDiv.style.display = 'block';
        const tweetsContainer = resultDiv.querySelector('.tweets-container');
        
        tweetsContainer.innerHTML = tweets.map(tweet => `
            <div class="tweet-box" onclick="copyTweet(this)">
                ${tweet}
            </div>
        `).join('');
    }
}); 