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

// Export functions for global access
window.SolarCalculator = {
    validateInput,
    showAlert,
    formatNumber,
    smoothScrollToResults
};
