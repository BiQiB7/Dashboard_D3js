export default class Slider {
    /**
 * Initializes a slider component.
 * @param {HTMLElement} container - The container element for the slider.
 * @param {number} minBound - The minimum value of the slider.
 * @param {number} maxBound - The maximum value of the slider.
 * @param {Function} onChange - The function to call when the slider value changes.
 */
    constructor(container, minBound, maxBound, onChange) {
        this.container = container;
        this.onChange = onChange;
        this.minBound = minBound;
        this.maxBound = maxBound;

        this.initializeSlider();
    }

    /**
    * Initializes the slider DOM elements.
    */
    initializeSlider() {
        // Create slider DOM element for the range
        this.slider = document.createElement('input');
        this.slider.type = 'range';
        this.slider.min = this.minBound;
        this.slider.max = this.maxBound;
        this.slider.value = (this.minBound + this.maxBound) / 2;
        console.log("slider value" + this.slider.value)

        const minLabel = document.createElement('span');
        minLabel.textContent = this.minBound;
        minLabel.classList.add('slider-label', 'min-label');

        const maxLabel = document.createElement('span');
        maxLabel.textContent = this.maxBound;
        maxLabel.classList.add('slider-label', 'max-label');

        const valueLabel = document.createElement('span');
        valueLabel.classList.add('slider-value-label');
        valueLabel.textContent = this.slider.value;


        // Assign ID based on container ID
        if (this.container.id === 'slider-entrance-fee-container') {
            this.slider.id = 'slider-entrance-fee';

        } else if (this.container.id === 'slider-rating-container') {
            this.slider.id = 'slider-rating';


        }

        // Calculate step size based on the range of values
        const range = this.maxBound - this.minBound;
        this.slider.step = range / 100; // Adjust 100 according to your preference

        // Add event listener to slider
        this.slider.addEventListener('input', (event) => {
            // Check if the event was triggered by the slider associated with this instance
            if (event.target === this.slider) {
                // Update the value of this slider
                const value = parseFloat(this.slider.value);
                this.onChange(value);
                valueLabel.textContent = value;

                // Update the CSS for the slider track
                const thumbPosition = (value - this.slider.min) / (this.slider.max - this.slider.min);
                const leftWidth = thumbPosition * 100;
                const rightWidth = 100 - leftWidth;

                document.styleSheets[0].addRule(`#${this.slider.id}::before`, `width: ${leftWidth}%;`);
                document.styleSheets[0].addRule(`#${this.slider.id}::after`, `width: ${rightWidth}%;`);
            }
        });

        this.container.appendChild(minLabel);
        this.container.appendChild(this.slider);
        this.container.appendChild(maxLabel);
        this.container.appendChild(valueLabel);
        valueLabel.style.paddingLeft = '71px';

        // Explicitly set the position of maxLabel
        maxLabel.style.position = 'absolute';
        maxLabel.style.right = '-10';

    }

    /**
    * Sets the value of the slider.
    ** @param {number} value - The value to set for the slider.
     */
    setValue(value) {
        this.slider.value = value;
    }
    /**
     * Retrieves the current value of the slider.
     * @returns {number} The current value of the slider.
     */
    getValues() {
        return this.slider.value;
    }

}
