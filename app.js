/**
 * Yorvion - Industrial Sensors Catalog
 * Main Application Logic
 *
 * Security Features:
 * - IIFE for scope isolation
 * - Strict mode enabled
 * - HTML sanitization for XSS prevention
 * - No inline event handlers
 * - Safe DOM manipulation
 */

(function() {
    'use strict';

    // ============================================
    // DARK MODE SETUP
    // ============================================

    function initDarkMode() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        }

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (event.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        });
    }

    // ============================================
    // SENSOR DATABASE
    // ============================================

    const sensors = [
        {
            id: 'PS-100-24V',
            name: 'Proximity Sensor PS-100',
            category: 'proximity',
            type: 'Inductive',
            voltage: '24 VDC',
            range: '0-10mm',
            output: 'PNP/NPN',
            protection: 'IP67',
            specs: 'Sensing distance: 10mm, Response time: 1ms, Operating temp: -25°C to +70°C',
            icon: 'fa-magnet'
        },
        {
            id: 'PE-200-24V',
            name: 'Photoelectric Sensor PE-200',
            category: 'photoelectric',
            type: 'Through-beam',
            voltage: '24 VDC',
            range: '0-30m',
            output: 'Relay Output',
            protection: 'IP65',
            specs: 'Detection range: 30m, Light source: Infrared LED, Response: 0.5ms',
            icon: 'fa-lightbulb'
        },
        {
            id: 'PR-300-24V',
            name: 'Pressure Sensor PR-300',
            category: 'pressure',
            type: 'Piezoelectric',
            voltage: '24 VDC',
            range: '0-100 bar',
            output: '4-20mA',
            protection: 'IP68',
            specs: 'Pressure range: 0-100 bar, Accuracy: ±0.5%, Thread: G1/4"',
            icon: 'fa-gauge-high'
        },
        {
            id: 'TE-400-24V',
            name: 'Temperature Sensor TE-400',
            category: 'temperature',
            type: 'RTD Pt100',
            voltage: '24 VDC',
            range: '-50°C to +250°C',
            output: '4-20mA',
            protection: 'IP65',
            specs: 'Range: -50 to 250°C, Accuracy: ±0.3°C, Probe length: 100mm',
            icon: 'fa-temperature-high'
        },
        {
            id: 'US-500-24V',
            name: 'Ultrasonic Sensor US-500',
            category: 'ultrasonic',
            type: 'Distance Measurement',
            voltage: '24 VDC',
            range: '0.3-5m',
            output: 'Analog 0-10V',
            protection: 'IP67',
            specs: 'Range: 0.3-5m, Blind zone: 30cm, Beam angle: 8°',
            icon: 'fa-wave-square'
        },
        {
            id: 'FL-600-24V',
            name: 'Flow Sensor FL-600',
            category: 'flow',
            type: 'Magnetic Flow',
            voltage: '24 VDC',
            range: '0-100 L/min',
            output: 'Pulse Output',
            protection: 'IP68',
            specs: 'Flow range: 0-100 L/min, Accuracy: ±2%, Connection: 1" NPT',
            icon: 'fa-water'
        },
        {
            id: 'PS-150-24V',
            name: 'Proximity Sensor PS-150',
            category: 'proximity',
            type: 'Capacitive',
            voltage: '24 VDC',
            range: '0-15mm',
            output: 'NO/NC',
            protection: 'IP67',
            specs: 'Sensing distance: 15mm, Material: All types, Hysteresis: 10%',
            icon: 'fa-magnet'
        },
        {
            id: 'PE-250-24V',
            name: 'Photoelectric Sensor PE-250',
            category: 'photoelectric',
            type: 'Retroreflective',
            voltage: '24 VDC',
            range: '0-5m',
            output: 'PNP',
            protection: 'IP67',
            specs: 'Range: 5m with reflector, Polarized filter, LED indicator',
            icon: 'fa-lightbulb'
        },
        {
            id: 'PR-350-24V',
            name: 'Pressure Sensor PR-350',
            category: 'pressure',
            type: 'Differential',
            voltage: '24 VDC',
            range: '0-10 bar',
            output: '0-10V',
            protection: 'IP65',
            specs: 'Differential pressure: 0-10 bar, Display: LCD, Media: Gas/Liquid',
            icon: 'fa-gauge-high'
        }
    ];

    // ============================================
    // SECURITY: HTML SANITIZATION
    // ============================================

    /**
     * Escapes HTML to prevent XSS attacks
     * Uses textContent for safe encoding
     * @param {string} text - Text to escape
     * @returns {string} - Escaped HTML-safe text
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ============================================
    // DATASHEET GENERATION
    // ============================================

    /**
     * Generates and downloads a datasheet for a sensor
     * @param {Object} sensor - Sensor object
     */
    function generateDatasheet(sensor) {
        const content = `YORVION - INDUSTRIAL SENSORS
Product Datasheet

Model: ${sensor.id}
Name: ${sensor.name}
Category: ${sensor.category.toUpperCase()}

TECHNICAL SPECIFICATIONS:
- Type: ${sensor.type}
- Operating Voltage: ${sensor.voltage}
- Range: ${sensor.range}
- Output: ${sensor.output}
- Protection Class: ${sensor.protection}

DETAILED SPECIFICATIONS:
${sensor.specs}

APPLICATIONS:
- Industrial automation
- Process control
- Quality inspection
- Machine safety systems

ORDERING INFORMATION:
Model Number: ${sensor.id}
Standard delivery: 2-3 weeks
Custom configurations available

---
Yorvion - Industrial Automation Solutions
https://yorvion.com | info@yorvion.com
`;

        // Create and trigger download
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${sensor.id}_Datasheet.txt`;
        a.setAttribute('aria-label', `Download datasheet for ${sensor.name}`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ============================================
    // RENDER SENSORS
    // ============================================

    /**
     * Renders sensor cards to the grid
     * @param {Array} sensorsToRender - Array of sensor objects
     */
    function renderSensors(sensorsToRender) {
        const grid = document.getElementById('sensorsGrid');
        grid.innerHTML = '';

        // Handle empty results
        if (sensorsToRender.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'col-span-full text-center py-12 text-gray-500 dark:text-gray-400';
            noResults.innerHTML = '<i class="fas fa-search text-4xl mb-3" aria-hidden="true"></i><p>No sensors found matching your criteria</p>';
            grid.appendChild(noResults);
            return;
        }

        // Render each sensor card
        sensorsToRender.forEach(sensor => {
            const card = document.createElement('div');
            card.className = 'sensor-card bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 fade-in';

            // Build card HTML with escaped values
            card.innerHTML = `
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center" aria-hidden="true">
                            <i class="fas ${escapeHtml(sensor.icon)} text-2xl text-primary"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-lg">${escapeHtml(sensor.name)}</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">${escapeHtml(sensor.id)}</p>
                        </div>
                    </div>
                </div>

                <div class="space-y-2 mb-4">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Type:</span>
                        <span class="font-medium">${escapeHtml(sensor.type)}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Voltage:</span>
                        <span class="font-medium">${escapeHtml(sensor.voltage)}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Range:</span>
                        <span class="font-medium">${escapeHtml(sensor.range)}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Output:</span>
                        <span class="font-medium">${escapeHtml(sensor.output)}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Protection:</span>
                        <span class="font-medium">${escapeHtml(sensor.protection)}</span>
                    </div>
                </div>

                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
                    <p class="text-xs text-gray-600 dark:text-gray-400">${escapeHtml(sensor.specs)}</p>
                </div>

                <button
                    data-sensor-id="${escapeHtml(sensor.id)}"
                    class="download-btn w-full bg-primary hover:bg-indigo-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2"
                    aria-label="Download datasheet for ${escapeHtml(sensor.name)}"
                >
                    <i class="fas fa-download" aria-hidden="true"></i>
                    Download Datasheet
                </button>
            `;

            // Attach event listener to download button (no inline handlers)
            const downloadBtn = card.querySelector('.download-btn');
            downloadBtn.addEventListener('click', function() {
                const sensorId = this.getAttribute('data-sensor-id');
                const sensor = sensors.find(s => s.id === sensorId);
                if (sensor) {
                    generateDatasheet(sensor);
                }
            });

            grid.appendChild(card);
        });
    }

    // ============================================
    // SEARCH & FILTER
    // ============================================

    /**
     * Filters sensors based on search term and category
     */
    function filterSensors() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const category = document.getElementById('categoryFilter').value;

        let filtered = sensors;

        // Filter by category
        if (category !== 'all') {
            filtered = filtered.filter(s => s.category === category);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(s =>
                s.name.toLowerCase().includes(searchTerm) ||
                s.id.toLowerCase().includes(searchTerm) ||
                s.type.toLowerCase().includes(searchTerm)
            );
        }

        renderSensors(filtered);
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    /**
     * Initialize the application
     */
    function init() {
        // Setup dark mode
        initDarkMode();

        // Attach event listeners
        document.getElementById('searchInput').addEventListener('input', filterSensors);
        document.getElementById('categoryFilter').addEventListener('change', filterSensors);

        // Initial render
        renderSensors(sensors);

        // Log initialization (can be removed in production)
        console.log('Yorvion Sensor Catalog initialized successfully');
        console.log(`Loaded ${sensors.length} sensors`);
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
