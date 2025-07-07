// Solar Panel Calculator JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize calculator functionality
    initializeCalculator();
    
    // Add form validation
    setupFormValidation();
    
    // Add loading states
    setupLoadingStates();
    
    // Add input formatters
    setupInputFormatters();
    
    // Add city search functionality
    setupCitySearch();
});

function initializeCalculator() {
    const form = document.getElementById('calculatorForm');
    const inputs = form.querySelectorAll('input[type="number"]');
    
    // Add real-time validation feedback
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
        });
        
        input.addEventListener('blur', function() {
            validateInput(this);
        });
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            form.submit();
        }
    });
}

function validateInput(input) {
    const value = parseFloat(input.value);
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    
    // Remove previous validation classes
    input.classList.remove('is-valid', 'is-invalid');
    
    // Validate based on input type
    if (input.value === '') {
        return; // Don't validate empty inputs
    }
    
    if (isNaN(value)) {
        input.classList.add('is-invalid');
        showInputError(input, 'Por favor, ingrese un número válido');
        return;
    }
    
    // Check range constraints
    if (min !== undefined && value < min) {
        input.classList.add('is-invalid');
        showInputError(input, `El valor debe ser mayor o igual a ${min}`);
        return;
    }
    
    if (max !== undefined && value > max) {
        input.classList.add('is-invalid');
        showInputError(input, `El valor debe ser menor o igual a ${max}`);
        return;
    }
    
    // Special validation for specific inputs
    if (input.name === 'latitude') {
        if (value < -90 || value > 90) {
            input.classList.add('is-invalid');
            showInputError(input, 'La latitud debe estar entre -90° y 90°');
            return;
        }
    }
    
    if (input.name === 'tilt') {
        if (value < 0 || value > 90) {
            input.classList.add('is-invalid');
            showInputError(input, 'La inclinación debe estar entre 0° y 90°');
            return;
        }
    }
    
    if (input.name === 'length') {
        if (value <= 0) {
            input.classList.add('is-invalid');
            showInputError(input, 'La longitud debe ser mayor que 0');
            return;
        }
    }
    
    // If all validations pass
    input.classList.add('is-valid');
    hideInputError(input);
}

function showInputError(input, message) {
    // Remove existing error message
    hideInputError(input);
    
    // Create error element
    const errorElement = document.createElement('div');
    errorElement.className = 'invalid-feedback';
    errorElement.textContent = message;
    
    // Insert after input
    input.parentNode.insertBefore(errorElement, input.nextSibling);
}

function hideInputError(input) {
    const errorElement = input.parentNode.querySelector('.invalid-feedback');
    if (errorElement) {
        errorElement.remove();
    }
}

function setupFormValidation() {
    const form = document.getElementById('calculatorForm');
    
    form.addEventListener('submit', function(e) {
        const inputs = form.querySelectorAll('input[type="number"]');
        let isValid = true;
        
        inputs.forEach(input => {
            validateInput(input);
            if (input.classList.contains('is-invalid') || input.value === '') {
                isValid = false;
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            showAlert('Por favor, corrija los errores en el formulario antes de continuar.', 'danger');
        }
    });
}

function setupLoadingStates() {
    const form = document.getElementById('calculatorForm');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    form.addEventListener('submit', function() {
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Calculando...';
        
        // Reset after 5 seconds as fallback
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }, 5000);
    });
}

function setupInputFormatters() {
    const numberInputs = document.querySelectorAll('input[type="number"]');
    
    numberInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Remove leading zeros
            if (this.value.length > 1 && this.value.startsWith('0') && this.value[1] !== '.') {
                this.value = this.value.replace(/^0+/, '');
            }
        });
        
        // Add placeholder examples based on input name
        if (input.name === 'latitude') {
            input.placeholder = 'Ej: 40.416 (Madrid)';
        } else if (input.name === 'tilt') {
            input.placeholder = 'Ej: 30.0';
        } else if (input.name === 'length') {
            input.placeholder = 'Ej: 2.0';
        }
    });
}

function showAlert(message, type = 'info') {
    // Create alert element
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} alert-dismissible fade show`;
    alertElement.innerHTML = `
        <i data-feather="${type === 'danger' ? 'alert-circle' : 'info'}"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert at top of container
    const container = document.querySelector('.container');
    const firstChild = container.firstElementChild;
    container.insertBefore(alertElement, firstChild);
    
    // Initialize feather icons
    feather.replace();
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alertElement.parentNode) {
            alertElement.remove();
        }
    }, 5000);
}

// Utility functions
function formatNumber(num, decimals = 3) {
    return Number(num).toFixed(decimals);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add smooth scrolling for better UX
function smoothScrollToResults() {
    const resultsSection = document.querySelector('.card:nth-child(2)');
    if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize tooltips if needed
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// City database with major cities
const MAJOR_CITIES = {
    // España
    'Madrid': { lat: 40.416, country: 'España' },
    'Barcelona': { lat: 41.389, country: 'España' },
    'Valencia': { lat: 39.470, country: 'España' },
    'Sevilla': { lat: 37.389, country: 'España' },
    'Bilbao': { lat: 43.263, country: 'España' },
    'Málaga': { lat: 36.721, country: 'España' },
    'Zaragoza': { lat: 41.649, country: 'España' },
    'Murcia': { lat: 37.987, country: 'España' },
    'Palma': { lat: 39.570, country: 'España' },
    'Las Palmas': { lat: 28.100, country: 'España' },
    'Santa Cruz de Tenerife': { lat: 28.464, country: 'España' },
    
    // Europa
    'París': { lat: 48.857, country: 'Francia' },
    'Londres': { lat: 51.509, country: 'Reino Unido' },
    'Roma': { lat: 41.902, country: 'Italia' },
    'Berlín': { lat: 52.520, country: 'Alemania' },
    'Ámsterdam': { lat: 52.370, country: 'Países Bajos' },
    'Lisboa': { lat: 38.722, country: 'Portugal' },
    'Atenas': { lat: 37.976, country: 'Grecia' },
    'Estocolmo': { lat: 59.334, country: 'Suecia' },
    'Copenhague': { lat: 55.676, country: 'Dinamarca' },
    'Oslo': { lat: 59.913, country: 'Noruega' },
    'Varsovia': { lat: 52.237, country: 'Polonia' },
    'Viena': { lat: 48.208, country: 'Austria' },
    'Praga': { lat: 50.075, country: 'República Checa' },
    'Budapest': { lat: 47.498, country: 'Hungría' },
    'Bruselas': { lat: 50.850, country: 'Bélgica' },
    'Dublín': { lat: 53.349, country: 'Irlanda' },
    'Zurich': { lat: 47.368, country: 'Suiza' },
    'Helsinki': { lat: 60.170, country: 'Finlandia' },
    
    // América
    'Nueva York': { lat: 40.713, country: 'Estados Unidos' },
    'Los Ángeles': { lat: 34.052, country: 'Estados Unidos' },
    'Chicago': { lat: 41.878, country: 'Estados Unidos' },
    'Miami': { lat: 25.761, country: 'Estados Unidos' },
    'San Francisco': { lat: 37.775, country: 'Estados Unidos' },
    'Washington': { lat: 38.907, country: 'Estados Unidos' },
    'Boston': { lat: 42.361, country: 'Estados Unidos' },
    'Las Vegas': { lat: 36.170, country: 'Estados Unidos' },
    'Ciudad de México': { lat: 19.433, country: 'México' },
    'Buenos Aires': { lat: -34.603, country: 'Argentina' },
    'São Paulo': { lat: -23.551, country: 'Brasil' },
    'Río de Janeiro': { lat: -22.907, country: 'Brasil' },
    'Lima': { lat: -12.047, country: 'Perú' },
    'Bogotá': { lat: 4.711, country: 'Colombia' },
    'Santiago': { lat: -33.457, country: 'Chile' },
    'Caracas': { lat: 10.480, country: 'Venezuela' },
    'Toronto': { lat: 43.651, country: 'Canadá' },
    'Montreal': { lat: 45.501, country: 'Canadá' },
    'Vancouver': { lat: 49.282, country: 'Canadá' },
    
    // Asia
    'Tokio': { lat: 35.676, country: 'Japón' },
    'Pekín': { lat: 39.904, country: 'China' },
    'Shanghai': { lat: 31.230, country: 'China' },
    'Hong Kong': { lat: 22.279, country: 'China' },
    'Singapur': { lat: 1.352, country: 'Singapur' },
    'Seúl': { lat: 37.566, country: 'Corea del Sur' },
    'Mumbai': { lat: 19.076, country: 'India' },
    'Nueva Delhi': { lat: 28.614, country: 'India' },
    'Bangkok': { lat: 13.756, country: 'Tailandia' },
    'Manila': { lat: 14.599, country: 'Filipinas' },
    'Yakarta': { lat: -6.175, country: 'Indonesia' },
    'Kuala Lumpur': { lat: 3.139, country: 'Malasia' },
    'Dubái': { lat: 25.204, country: 'Emiratos Árabes Unidos' },
    'Tel Aviv': { lat: 32.085, country: 'Israel' },
    'Estambul': { lat: 41.008, country: 'Turquía' },
    
    // África
    'El Cairo': { lat: 30.044, country: 'Egipto' },
    'Ciudad del Cabo': { lat: -33.925, country: 'Sudáfrica' },
    'Johannesburgo': { lat: -26.204, country: 'Sudáfrica' },
    'Lagos': { lat: 6.524, country: 'Nigeria' },
    'Nairobi': { lat: -1.292, country: 'Kenia' },
    'Casablanca': { lat: 33.573, country: 'Marruecos' },
    'Argel': { lat: 36.752, country: 'Argelia' },
    'Túnez': { lat: 36.806, country: 'Túnez' },
    
    // Oceanía
    'Sídney': { lat: -33.869, country: 'Australia' },
    'Melbourne': { lat: -37.814, country: 'Australia' },
    'Brisbane': { lat: -27.470, country: 'Australia' },
    'Perth': { lat: -31.953, country: 'Australia' },
    'Auckland': { lat: -36.849, country: 'Nueva Zelanda' },
    'Wellington': { lat: -41.289, country: 'Nueva Zelanda' }
};

function setupCitySearch() {
    const cityInput = document.getElementById('citySearch');
    const latitudeInput = document.getElementById('latitude');
    const resultsDiv = document.getElementById('cityResults');
    const searchBtn = document.getElementById('searchBtn');
    
    if (!cityInput || !latitudeInput || !resultsDiv) return;
    
    // Search function
    function searchCities(query) {
        if (!query || query.length < 2) {
            resultsDiv.innerHTML = '';
            resultsDiv.classList.remove('show');
            return;
        }
        
        const matches = Object.keys(MAJOR_CITIES)
            .filter(city => city.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 8); // Limit to 8 results
        
        if (matches.length === 0) {
            resultsDiv.innerHTML = '<div class="dropdown-item-text text-muted">No se encontraron ciudades</div>';
        } else {
            resultsDiv.innerHTML = matches.map(city => {
                const cityData = MAJOR_CITIES[city];
                return `<button type="button" class="dropdown-item" data-city="${city}" data-lat="${cityData.lat}">
                    <i data-feather="map-pin" class="me-2"></i>
                    ${city}, ${cityData.country}
                    <small class="text-muted ms-2">${cityData.lat}°</small>
                </button>`;
            }).join('');
            
            // Re-initialize feather icons
            setTimeout(() => feather.replace(), 10);
        }
        
        resultsDiv.classList.add('show');
    }
    
    // Event listeners
    cityInput.addEventListener('input', debounce(function() {
        searchCities(this.value);
    }, 300));
    
    cityInput.addEventListener('focus', function() {
        if (this.value) {
            searchCities(this.value);
        }
    });
    
    searchBtn.addEventListener('click', function() {
        searchCities(cityInput.value);
    });
    
    // Handle city selection
    resultsDiv.addEventListener('click', function(e) {
        const button = e.target.closest('.dropdown-item');
        if (button) {
            const city = button.dataset.city;
            const lat = button.dataset.lat;
            
            cityInput.value = city;
            latitudeInput.value = lat;
            resultsDiv.classList.remove('show');
            
            // Trigger validation
            validateInput(latitudeInput);
        }
    });
    
    // Hide results when clicking outside
    document.addEventListener('click', function(e) {
        if (!cityInput.contains(e.target) && !resultsDiv.contains(e.target)) {
            resultsDiv.classList.remove('show');
        }
    });
    
    // Handle Enter key
    cityInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const firstResult = resultsDiv.querySelector('.dropdown-item');
            if (firstResult) {
                firstResult.click();
            }
        }
    });
}

// Export functions for global access
window.SolarCalculator = {
    validateInput,
    showAlert,
    formatNumber,
    smoothScrollToResults,
    setupCitySearch
};
