"""
Generador de Hilos para X.com (Twitter)
--------------------------------------
Aplicación Flask que genera hilos de tweets usando el modelo Grok de X.AI.
Permite a los usuarios crear hilos personalizados con diferentes estilos,
hashtags y opciones de emojis.

Autor: @686f6c61
Licencia: MIT
Repositorio: https://github.com/686f6c61/generador-hilos-twitter-x-grok
"""

import os
from openai import OpenAI
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify

# Cargar variables de entorno desde archivo .env
load_dotenv()

app = Flask(__name__)

# Diccionario de estilos de escritura disponibles y sus características
ESTILOS = {
    'formal': {
        'nombre': 'Formal y Profesional',
        'descripcion': 'Lenguaje corporativo y serio, ideal para temas de negocios',
        'ejemplo': 'Análisis del impacto de la IA en el sector financiero: tendencias clave para 2024'
    },
    'casual': {
        'nombre': 'Casual y Conversacional',
        'descripcion': 'Tono relajado y cercano, como hablar con amigos',
        'ejemplo': 'Oye, ¿te has preguntado alguna vez cómo funciona realmente Bitcoin? Te lo explico de forma sencilla'
    },
    'humoristico': {
        'nombre': 'Humorístico',
        'descripcion': 'Divertido y entretenido, con toques de humor',
        'ejemplo': 'Guía para sobrevivir a una reunión que podría haber sido un email 😅'
    },
    'sarcastico': {
        'nombre': 'Sarcástico',
        'descripcion': 'Ironía inteligente y comentarios ingeniosos',
        'ejemplo': 'Ah, el maravilloso mundo de las criptomonedas, donde todo el mundo es experto... hasta que no lo es'
    },
    'educativo': {
        'nombre': 'Educativo',
        'descripcion': 'Explicativo y didáctico, ideal para enseñar',
        'ejemplo': 'Hoy aprenderemos paso a paso cómo funciona el machine learning. Conceptos básicos explicados de forma sencilla.'
    },
    'inspirador': {
        'nombre': 'Inspirador y Motivacional',
        'descripcion': 'Positivo y motivador, para inspirar acción',
        'ejemplo': 'Tu viaje hacia el éxito comienza con un solo paso. Hoy compartimos historias reales de emprendedores que lo lograron.'
    },
    'tecnico': {
        'nombre': 'Técnico y Detallado',
        'descripcion': 'Profundo y específico, para temas especializados',
        'ejemplo': 'Análisis detallado del nuevo algoritmo de consenso en ETH 2.0: Proof of Stake'
    },
    'storytelling': {
        'nombre': 'Narrativo (Storytelling)',
        'descripcion': 'Cuenta historias de forma cautivadora',
        'ejemplo': 'Todo comenzó una tarde de verano en un pequeño garage de Silicon Valley...'
    }
}

def format_tweet_number(index, total, formato):
    """
    Formatea el número del tweet según el formato especificado.
    
    Argumentos:
        index (int): Número actual del tweet (base 0)
        total (int): Número total de tweets
        formato (str): Estilo de formato ('clasico', 'punto', 'parentesis', 'corchetes')
    
    Retorna:
        str: Número de tweet formateado
    """
    if formato == 'clasico':
        return f"{index + 1}/{total}"
    elif formato == 'punto':
        return f"{index + 1}."
    elif formato == 'parentesis':
        return f"({index + 1})"
    elif formato == 'corchetes':
        return f"[{index + 1}]"
    return f"{index + 1}/{total}"  # Formato por defecto

def generate_thread(tema, contexto, num_tweets, estilo, usar_hashtags, hashtag_tweets, usar_emojis, emoji_tweets):
    """
    Genera un hilo usando el modelo Grok de X.AI.
    
    Argumentos:
        tema (str): Tema principal del hilo
        contexto (str): Contexto adicional para el hilo
        num_tweets (int): Número de tweets a generar
        estilo (str): Clave del estilo de escritura de ESTILOS
        usar_hashtags (bool): Si se deben incluir hashtags
        hashtag_tweets (list): Lista de números de tweets donde incluir hashtags
        usar_emojis (bool): Si se deben incluir emojis
        emoji_tweets (list): Lista de números de tweets donde incluir emojis
    
    Retorna:
        list: Tweets generados
        
    Lanza:
        Exception: Si hay un error en la llamada a la API o en el procesamiento
    """
    try:
        # Inicializar cliente de X.AI
        client = OpenAI(
            api_key=os.getenv("XAI_API_KEY"),
            base_url="https://api.x.ai/v1"
        )

        # Construir el prompt para la generación
        prompt = f"""Genera {num_tweets} tweets sobre: {tema}
        
Requisitos:
- Máximo 280 caracteres por tweet
- Estilo: {ESTILOS[estilo]['nombre']}
- NO uses formato Markdown
- Numera los tweets como [1/{num_tweets}], [2/{num_tweets}], etc.
- Separa cada tweet con ---

{f'Contexto adicional: {contexto}' if contexto else ''}
{f'Incluir hashtags en tweets: {hashtag_tweets}' if usar_hashtags else ''}
{f'Incluir emojis en tweets: {emoji_tweets}' if usar_emojis else ''}"""

        # Realizar llamada a la API
        completion = client.chat.completions.create(
            model="grok-beta",
            messages=[
                {"role": "system", "content": "Eres un experto creador de hilos en X.com. Genera tweets sin formato Markdown, usando texto plano."},
                {"role": "user", "content": prompt}
            ]
        )

        # Procesar y limpiar tweets generados
        tweets = [
            tweet.strip()
            for tweet in completion.choices[0].message.content.split('---')
            if tweet.strip()
        ]

        return tweets

    except Exception as e:
        app.logger.error(f"Error en generate_thread: {str(e)}")
        raise

@app.route('/')
def home():
    """Ruta principal que renderiza la página de inicio"""
    return render_template('index.html', estilos=ESTILOS)

@app.route('/generate', methods=['POST'])
def generate():
    """
    Endpoint para generar hilos de tweets.
    Procesa la solicitud POST y devuelve los tweets generados.
    """
    try:
        # Obtener y procesar datos del formulario
        tema = request.form.get('tema')
        contexto = request.form.get('contexto')
        num_tweets = int(request.form.get('num_tweets', 5))
        estilo = request.form.get('estilo', 'casual')
        usar_hashtags = request.form.get('usar_hashtags') == 'on'
        hashtags_mode = request.form.get('hashtags_mode')
        selected_hashtags = request.form.get('selected_hashtags', '')
        usar_emojis = request.form.get('usar_emojis') == 'on'
        emojis_mode = request.form.get('emojis_mode')
        selected_emojis = request.form.get('selected_emojis', '')

        # Registro para depuración
        app.logger.info(f"Recibida petición para generar hilo sobre: {tema}")
        app.logger.info(f"Parámetros: {request.form}")

        # Procesar tweets seleccionados para hashtags
        hashtag_tweets = []
        if usar_hashtags:
            if hashtags_mode == 'all':
                hashtag_tweets = list(range(1, num_tweets + 1))
            else:
                hashtag_tweets = [int(x) for x in selected_hashtags.split(',')] if selected_hashtags else []

        # Procesar tweets seleccionados para emojis
        emoji_tweets = []
        if usar_emojis:
            if emojis_mode == 'all':
                emoji_tweets = list(range(1, num_tweets + 1))
            else:
                emoji_tweets = [int(x) for x in selected_emojis.split(',')] if selected_emojis else []

        # Generar el hilo
        tweets = generate_thread(
            tema=tema,
            contexto=contexto,
            num_tweets=num_tweets,
            estilo=estilo,
            usar_hashtags=usar_hashtags,
            hashtag_tweets=hashtag_tweets,
            usar_emojis=usar_emojis,
            emoji_tweets=emoji_tweets
        )

        return jsonify({'success': True, 'tweets': tweets})

    except Exception as e:
        app.logger.error(f"Error generando el hilo: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 