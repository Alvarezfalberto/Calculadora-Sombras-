# ... [importaciones y estilos personalizados previos] ...

# Cambia el color del título a azul
st.markdown("<h1 style='text-align: center; color: #67c1d3;'>Calculadora de Distancia Mínima entre Paneles Solares</h1>", unsafe_allow_html=True)

# Cambia el color de "Instrucciones" a verde
st.markdown(
    """
    <div style="background-color:#393e46; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.2rem;">
    <h2 style="color:#26a484">Instrucciones</h2>
    <p><b>¿Qué hace esta calculadora?</b></p>
    <p>Esta herramienta calcula la distancia óptima entre filas de paneles solares para minimizar el sombreado durante el solsticio de invierno (21 de diciembre).</p>
    <b>Parámetros requeridos:</b>
    <ul>
        <li><b style="color:#ece75b;">Latitud:</b> Ubicación geográfica en grados</li>
        <li><b style="color:#26a484;">Inclinación:</b> Ángulo de inclinación de los paneles</li>
        <li><b style="color:#67c1d3;">Longitud:</b> Longitud física del panel solar</li>
    </ul>
    <b>Resultados obtenidos:</b>
    <ul>
        <li><b>Declinación Solar:</b> Ángulo del sol respecto al ecuador</li>
        <li><b>Altura Solar:</b> Ángulo del sol a mediodía</li>
        <li><b>Distancia Mínima:</b> Separación mínima sin sombreado</li>
        <li><b>Distancia Recomendada:</b> Separación con margen de seguridad</li>
    </ul>
    <b>Consejo:</b> Use la distancia recomendada para tener un margen de seguridad adicional.
    </div>
    """,
    unsafe_allow_html=True
)

# --- INTERFAZ STREAMLIT ---
with st.form(key='form_sombras'):
    lat = st.number_input('Latitud (°)', min_value=-90.0, max_value=90.0, value=20.0, step=0.1, format="%.3f")
    tilt = st.number_input('Inclinación del panel (°)', min_value=0.0, max_value=90.0, value=20.0, step=0.1, format="%.3f")
    length = st.number_input('Longitud del panel (m)', min_value=0.01, value=1.7, step=0.01, format="%.3f")
    submit_btn = st.form_submit_button('Calcular')

# ... [resto del código igual] ...
