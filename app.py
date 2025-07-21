import math
import logging
from io import BytesIO
import base64
import matplotlib.pyplot as plt
import numpy as np
import streamlit as st

# --- ESTILOS PERSONALIZADOS ---
st.set_page_config(page_title="Calculadora de Distancia Mínima entre Paneles Solares", layout="centered")

st.markdown(
    """
    <style>
        .main {
            background-color: #222831;
            color: #EEEEEE;
        }
        .block-container {
            padding-top: 2rem;
        }
        .stButton>button {
            color: white;
            background: linear-gradient(90deg, #007bff 60%, #00c6ff 100%);
            border: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 1.1rem;
        }
        .stNumberInput>div>input {
            background: #393e46;
            color: #FFF;
        }
        .stForm {
            background-color: #393e46;
            border-radius: 12px;
            padding: 2rem 1rem 1rem 1rem;
        }
        /* Quita el espacio superior entre inputs y labels */
        label {
            margin-bottom: 0.2rem;
            margin-top: 0.5rem;
        }
    </style>
    """,
    unsafe_allow_html=True
)

# Título principal
st.markdown(
    "<h1 style='text-align: center; color: #67c1d3;'>Calculadora de Distancia Mínima entre Paneles Solares</h1>",
    unsafe_allow_html=True
)

# Instrucciones destacadas
st.markdown(
    """
    <div style="background-color:#393e46; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.2rem;">
        <h2 style="color:#ece75b">Instrucciones</h2>
        <p><b>¿Qué hace esta calculadora?</b></p>
        <p>Esta herramienta calcula la distancia óptima entre filas de paneles solares para minimizar el sombreado durante el solsticio de invierno (21 de diciembre).</p>
        <b>Parámetros requeridos:</b>
        <ul>
            <li><b style="color:#ece75b">Latitud:</b> Ubicación geográfica en grados</li>
            <li><b style="color:#67c1d3">Inclinación:</b> Ángulo de inclinación de los paneles</li>
            <li><b style="color:#26a484">Longitud:</b> Longitud física del panel solar</li>
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

# --- LÓGICA DEL CÓDIGO ---
logging.basicConfig(level=logging.DEBUG)

def calc_shadow_spacing(lat, tilt, length):
    day_julian = 355  # 21 de diciembre
    delta = 23.45 * math.sin(math.radians(360 * (284 + day_julian) / 365))
    ho = 90 - lat + delta
    dmin = length * math.sin(math.radians(ho + tilt)) / math.sin(math.radians(ho))
    return delta, ho, dmin

def generate_panel_diagram(tilt, length, dmin, drec, lat):
    try:
        beta = math.radians(tilt)
        x1 = np.array([0, length * math.cos(beta)])
        y1 = np.array([0, length * math.sin(beta)])
        x2 = x1 + dmin
        y2 = y1
        max_h = y1[1]

        fig, ax = plt.subplots(figsize=(10, 6), dpi=100)
        fig.patch.set_facecolor('#1a1a1a')
        ax.set_facecolor('#1a1a1a')
        ax.tick_params(colors='white')
        ax.xaxis.label.set_color('white')
        ax.yaxis.label.set_color('white')
        ax.title.set_color('white')

        ax.plot([-0.1*dmin, x2[1] + length*0.2], [0, 0], 'white', linewidth=2)
        ax.plot(x1, y1, '#007bff', linewidth=4, label='Fila 1')
        ax.plot(x2, y2, '#007bff', linewidth=4, label='Fila 2')

        y_base = -0.1
        ax.annotate('', xy=(0, y_base), xytext=(dmin, y_base),
                    arrowprops=dict(arrowstyle='<->', color='white', lw=1.5))
        ax.text(dmin/2, y_base - 0.15, f'dmin = {dmin:.3f} m',
                ha='center', va='top', color='white', fontsize=10, fontweight='bold')

        y_rec = y_base - 0.35
        ax.annotate('', xy=(0, y_rec), xytext=(drec, y_rec),
                    arrowprops=dict(arrowstyle='<->', color='#28a745', lw=1.5))
        ax.text(drec/2, y_rec - 0.15, f'drec = {drec:.3f} m',
                ha='center', va='top', color='#28a745', fontsize=10, fontweight='bold')

        textstr = f"Latitud: {lat:.3f}°\nInclinación: {tilt:.3f}°\nLongitud: {length:.3f} m"
        ax.text(0.02, 0.98, textstr, transform=ax.transAxes, fontsize=11,
                verticalalignment='top', color='white',
                bbox=dict(boxstyle='round,pad=0.5', facecolor='#333333', alpha=0.8))

        max_x = max(drec, x2[1] + length*0.2)
        ax.set_xlim(-0.2*dmin, max_x)
        ax.set_ylim(-0.8, max_h + 0.5)
        ax.set_aspect('equal', 'box')
        ax.set_xlabel('Distancia horizontal (m)', fontsize=12)
        ax.set_ylabel('Altura (m)', fontsize=12)

        legend = ax.legend(loc='upper right', fancybox=True, framealpha=0.8)
        legend.get_frame().set_facecolor('#333333')
        for text in legend.get_texts():
            text.set_color('white')

        ax.set_title('Distancia mínima entre paneles solares', fontsize=14, fontweight='bold', pad=20)
        ax.grid(True, alpha=0.3, color='white')

        plt.tight_layout()
        img_buffer = BytesIO()
        plt.savefig(img_buffer, format='png', facecolor='#1a1a1a', edgecolor='none',
                   bbox_inches='tight', dpi=100)
        img_buffer.seek(0)
        plt.close(fig)
        return img_buffer
    except Exception as e:
        logging.error(f"Error generating diagram: {str(e)}")
        return None

# --- INTERFAZ STREAMLIT ---
with st.form(key='form_sombras'):
    st.markdown("<label style='color:#ece75b; font-size:16px; font-weight:bold;'>Latitud (°)</label>", unsafe_allow_html=True)
    lat = st.number_input('', min_value=-90.0, max_value=90.0, value=20.0, step=0.1, format="%.3f")
    st.markdown("<label style='color:#67c1d3; font-size:16px; font-weight:bold;'>Inclinación del panel (°)</label>", unsafe_allow_html=True)
    tilt = st.number_input('', min_value=0.0, max_value=90.0, value=20.0, step=0.1, format="%.3f")
    st.markdown("<label style='color:#26a484; font-size:16px; font-weight:bold;'>Longitud del panel (m)</label>", unsafe_allow_html=True)
    length = st.number_input('', min_value=0.01, value=1.7, step=0.01, format="%.3f")
    submit_btn = st.form_submit_button('Calcular')

if submit_btn:
    try:
        delta, ho, dmin = calc_shadow_spacing(lat, tilt, length)
        if ho <= 0:
            st.error('Altura solar no válida. Verifique la latitud ingresada.')
        else:
            delta_rounded = round(delta, 3)
            ho_rounded = round(ho, 3)
            dmin_rounded = round(dmin, 3)
            drec_rounded = round(dmin * 1.25, 3)

            # Resultados en azul
            st.markdown("<h3 style='color:#67c1d3;'>Resultados</h3>", unsafe_allow_html=True)
            st.write(f"**Declinación solar (delta):** {delta_rounded}°")
            st.write(f"**Altura solar al mediodía (ho):** {ho_rounded}°")
            st.write(f"**Distancia mínima entre filas (dmin):** {dmin_rounded} m")
            st.write(f"**Distancia recomendada (drec):** {drec_rounded} m")

            # Diagrama en verde
            st.markdown("<h3 style='color:#26a484;'>Diagrama</h3>", unsafe_allow_html=True)
            img_buffer = generate_panel_diagram(tilt, length, dmin_rounded, drec_rounded, lat)
            if img_buffer:
                st.image(img_buffer, use_container_width=True)
            else:
                st.error("No se pudo generar el diagrama.")
    except Exception as e:
        st.error("Error en el cálculo. Por favor, verifique los valores ingresados.")
        logging.error(f"Error in calculation: {str(e)}")
