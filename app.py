import os
import math
import logging
from io import BytesIO
import base64
from flask import Flask, render_template, request, jsonify, flash, redirect, url_for
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import numpy as np

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")

def calc_shadow_spacing(lat, tilt, length):
    """
    Calcula la declinación solar, la altura solar a mediodía y la distancia mínima entre filas de módulos para el 21 de diciembre.
    :param lat: Latitud en grados
    :param tilt: Inclinación de los paneles en grados
    :param length: Longitud del panel en metros
    :return: (delta, ho, dmin)
    """
    day_julian = 355  # 21 de diciembre
    delta = 23.45 * math.sin(math.radians(360 * (284 + day_julian) / 365))
    ho = 90 - lat + delta
    dmin = length * math.sin(math.radians(ho + tilt)) / math.sin(math.radians(ho))
    return delta, ho, dmin

def generate_panel_diagram(tilt, length, dmin, drec, lat):
    """
    Genera un diagrama de dos filas de paneles separadas por dmin y drec.
    Retorna la imagen como string base64.
    """
    try:
        beta = math.radians(tilt)
        x1 = np.array([0, length * math.cos(beta)])
        y1 = np.array([0, length * math.sin(beta)])
        x2 = x1 + dmin
        y2 = y1
        max_h = y1[1]

        # Create figure with specific size and DPI for web display
        fig, ax = plt.subplots(figsize=(10, 6), dpi=100)
        
        # Set dark theme colors for better web integration
        fig.patch.set_facecolor('#1a1a1a')
        ax.set_facecolor('#1a1a1a')
        ax.tick_params(colors='white')
        ax.xaxis.label.set_color('white')
        ax.yaxis.label.set_color('white')
        ax.title.set_color('white')
        
        # Suelo (ground line)
        ax.plot([-0.1*dmin, x2[1] + length*0.2], [0, 0], 'white', linewidth=2)
        
        # Filas de paneles (panel rows)
        ax.plot(x1, y1, '#007bff', linewidth=4, label='Fila 1')
        ax.plot(x2, y2, '#007bff', linewidth=4, label='Fila 2')

        # Anotación de dmin en la base de las filas
        y_base = -0.1
        ax.annotate('', xy=(0, y_base), xytext=(dmin, y_base), 
                   arrowprops=dict(arrowstyle='<->', color='white', lw=1.5))
        ax.text(dmin/2, y_base - 0.15, f'dmin = {dmin:.3f} m', 
               ha='center', va='top', color='white', fontsize=10, fontweight='bold')

        # Anotación de distancia recomendada (25% más)
        y_rec = y_base - 0.35
        ax.annotate('', xy=(0, y_rec), xytext=(drec, y_rec), 
                   arrowprops=dict(arrowstyle='<->', color='#28a745', lw=1.5))
        ax.text(drec/2, y_rec - 0.15, f'drec = {drec:.3f} m', 
               ha='center', va='top', color='#28a745', fontsize=10, fontweight='bold')

        # Texto de entrada
        textstr = f"Latitud: {lat:.3f}°\nInclinación: {tilt:.3f}°\nLongitud: {length:.3f} m"
        ax.text(0.02, 0.98, textstr, transform=ax.transAxes, fontsize=11,
                verticalalignment='top', color='white',
                bbox=dict(boxstyle='round,pad=0.5', facecolor='#333333', alpha=0.8))

        # Límites y aspecto
        max_x = max(drec, x2[1] + length*0.2)
        ax.set_xlim(-0.2*dmin, max_x)
        ax.set_ylim(-0.8, max_h + 0.5)
        ax.set_aspect('equal', 'box')
        ax.set_xlabel('Distancia horizontal (m)', fontsize=12)
        ax.set_ylabel('Altura (m)', fontsize=12)
        
        # Legend with white text
        legend = ax.legend(loc='upper right', fancybox=True, framealpha=0.8)
        legend.get_frame().set_facecolor('#333333')
        for text in legend.get_texts():
            text.set_color('white')
        
        ax.set_title('Distancia mínima entre paneles solares', fontsize=14, fontweight='bold', pad=20)
        ax.grid(True, alpha=0.3, color='white')
        
        plt.tight_layout()
        
        # Save plot to BytesIO and convert to base64
        img_buffer = BytesIO()
        plt.savefig(img_buffer, format='png', facecolor='#1a1a1a', edgecolor='none', 
                   bbox_inches='tight', dpi=100)
        img_buffer.seek(0)
        
        # Convert to base64 string
        img_str = base64.b64encode(img_buffer.getvalue()).decode()
        plt.close(fig)  # Important: close the figure to free memory
        
        return img_str
    
    except Exception as e:
        logging.error(f"Error generating diagram: {str(e)}")
        return None

@app.route('/')
def index():
    """Main calculator page"""
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    """Handle calculation request"""
    try:
        # Get form data
        lat = float(request.form.get('latitude', 0))
        tilt = float(request.form.get('tilt', 0))
        length = float(request.form.get('length', 0))
        
        # Validate input ranges
        if not (-90 <= lat <= 90):
            flash('La latitud debe estar entre -90° y 90°', 'error')
            return redirect(url_for('index'))
        
        if not (0 <= tilt <= 90):
            flash('La inclinación debe estar entre 0° y 90°', 'error')
            return redirect(url_for('index'))
        
        if length <= 0:
            flash('La longitud debe ser mayor que 0', 'error')
            return redirect(url_for('index'))
        
        # Perform calculations
        delta, ho, dmin = calc_shadow_spacing(lat, tilt, length)
        
        # Check for valid solar altitude
        if ho <= 0:
            flash('Altura solar no válida. Verifique la latitud ingresada.', 'error')
            return redirect(url_for('index'))
        
        # Round results to 3 decimals
        delta_rounded = round(delta, 3)
        ho_rounded = round(ho, 3)
        dmin_rounded = round(dmin, 3)
        drec_rounded = round(dmin * 1.25, 3)
        
        # Generate diagram
        diagram_base64 = generate_panel_diagram(tilt, length, dmin_rounded, drec_rounded, lat)
        
        # Prepare results
        results = {
            'delta': delta_rounded,
            'ho': ho_rounded,
            'dmin': dmin_rounded,
            'drec': drec_rounded,
            'inputs': {
                'latitude': lat,
                'tilt': tilt,
                'length': length
            }
        }
        
        return render_template('index.html', results=results, diagram=diagram_base64)
        
    except ValueError as e:
        flash('Por favor, introduzca valores numéricos válidos.', 'error')
        logging.error(f"ValueError in calculation: {str(e)}")
        return redirect(url_for('index'))
    except Exception as e:
        flash('Error en el cálculo. Por favor, verifique los valores ingresados.', 'error')
        logging.error(f"Error in calculation: {str(e)}")
        return redirect(url_for('index'))

@app.errorhandler(404)
def not_found(error):
    return render_template('index.html'), 404

@app.errorhandler(500)
def internal_error(error):
    flash('Error interno del servidor. Por favor, intente nuevamente.', 'error')
    return render_template('index.html'), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
