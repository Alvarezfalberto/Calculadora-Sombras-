# Solar Panel Shadow Calculator

## Overview

This is a web-based solar panel shadow calculator built with Flask that helps users determine the optimal spacing between solar panel rows to minimize shading effects. The application calculates the minimum distance between panel rows based on latitude, panel tilt, and panel length, specifically for December 21st (winter solstice) when shadows are longest.

## System Architecture

### Frontend Architecture
- **Framework**: HTML5 with Bootstrap 5 (dark theme)
- **Styling**: Custom CSS with dark theme and responsive design
- **JavaScript**: Vanilla JavaScript for form validation and user interactions
- **Icons**: Feather Icons for UI elements
- **Responsive Design**: Bootstrap grid system with mobile-first approach

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **Template Engine**: Jinja2 (Flask's default templating)
- **Session Management**: Flask sessions with secret key configuration
- **Logging**: Python's built-in logging module

### Visualization Engine
- **Library**: Matplotlib with non-interactive backend (Agg)
- **Output Format**: Base64-encoded PNG images for web display
- **Charts**: 2D panel row diagrams showing optimal spacing

## Key Components

### Core Calculation Engine (`app.py`)
- **Shadow Spacing Calculator**: Implements solar geometry calculations
  - Solar declination angle calculation
  - Solar elevation angle at noon
  - Minimum distance calculation to avoid shading
- **Diagram Generator**: Creates visual representations of panel layouts
- **Mathematical Functions**: Uses trigonometry for precise solar calculations

### Web Interface
- **Main Route**: Serves the calculator form and displays results
- **Form Handling**: Processes user inputs with validation
- **Error Handling**: Flash messages for user feedback
- **AJAX Support**: Prepared for asynchronous calculations

### Static Assets
- **CSS**: Custom styling with CSS variables and dark theme
- **JavaScript**: Client-side validation and user experience enhancements
- **Responsive Design**: Mobile-friendly interface

## Data Flow

1. **User Input**: Users enter latitude, panel tilt angle, and panel length
2. **Server Processing**: Flask processes the form data
3. **Calculation**: Core algorithms compute optimal spacing
4. **Visualization**: Matplotlib generates diagram
5. **Response**: Results and diagram are rendered in the template
6. **Client Display**: User sees calculated values and visual representation

## External Dependencies

### Python Libraries
- **Flask**: Web framework for routing and templating
- **Matplotlib**: Scientific plotting for panel diagrams
- **NumPy**: Mathematical operations and array handling
- **Base64**: Image encoding for web display

### Frontend Dependencies
- **Bootstrap 5**: CSS framework with dark theme
- **Feather Icons**: Icon library for UI elements
- **CDN Delivery**: External resources loaded via CDN

### Environment Configuration
- **Session Secret**: Configurable via environment variable
- **Debug Mode**: Development-friendly error handling
- **Port Configuration**: Flexible port binding (default 5000)

## Deployment Strategy

### Development Environment
- **Entry Point**: `main.py` for local development
- **Debug Mode**: Enabled for development with auto-reload
- **Host Configuration**: Binds to all interfaces (0.0.0.0)
- **Port**: Configurable, defaults to 5000

### Production Considerations
- **Secret Key**: Must be set via environment variable
- **Debug Mode**: Should be disabled in production
- **WSGI Server**: Designed to work with production WSGI servers
- **Static Files**: Served via Flask in development, should use web server in production

### File Structure
```
├── app.py              # Main Flask application
├── main.py             # Development entry point
├── templates/          # Jinja2 templates
│   └── index.html      # Main calculator interface
├── static/             # Static web assets
│   ├── css/
│   │   └── custom.css  # Custom styling
│   └── js/
│       └── calculator.js # Client-side functionality
└── attached_assets/    # Legacy/reference code
```

## Changelog
- July 07, 2025. Initial setup and conversion from tkinter to Flask web application
- July 07, 2025. Successfully deployed Flask web application with full functionality

## User Preferences

Preferred communication style: Simple, everyday language.