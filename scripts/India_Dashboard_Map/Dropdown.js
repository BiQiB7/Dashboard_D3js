export default class MultiSelectDropdown {
    /**
     * Represents a multi-select dropdown component.
     * @param {HTMLElement} typeContainer - The container element for the dropdown.
     * @param {Array} options - The options available in the dropdown.
     * @param {Function} onChange - The function to be called when the selection changes.
     */

    constructor(typeContainer, options, onChange) {
        this.options = ['All', ...options];
        this.selectedOptions = this.options;
        this.onChange = onChange;
        this.isDropdownOpen = false; // Track dropdown state

        // Create dropdown container
        this.dropdownContainer = document.createElement('div');
        this.dropdownContainer.classList.add('dropdown');

        // Create button
        this.button = document.createElement('button');


        this.button.textContent = 'Select Items';
        this.button.classList.add('dropdown-button');
        this.button.innerHTML = `<i class="fas fa-sun">`

        this.button.onclick = () => this.toggleDropdown();


        // Create selected options container
        this.selectedOptionsContainer = document.createElement('div');
        this.selectedOptionsContainer.classList.add('selected-options-container');
        this.selectedOptionsContainer.style.width = '180px'; // Set a fixed width
        this.selectedOptionsContainer.style.height = '150px';
        this.selectedOptionsContainer.style.overflow = 'auto';

        // Append selected options container to dropdown container
        this.dropdownContainer.appendChild(this.button);
        this.dropdownContainer.appendChild(this.selectedOptionsContainer);


        // Create dropdown content
        this.dropdownContent = document.createElement('div');
        this.dropdownContent.classList.add('dropdown-content');
        this.dropdownContent.style.display = 'none';

        // Add options to dropdown content
        this.options.forEach(option => {
            const optionElement = document.createElement('a');
            optionElement.textContent = option;
            optionElement.onclick = () => this.toggleOption(optionElement.textContent);
            // optionElement.classList.add('selected-option'); // Add CSS class to selected option element

            // CSS styles for the selected option class

            this.dropdownContent.appendChild(optionElement);
        });

        // Append dropdown content to dropdown container
        this.dropdownContainer.appendChild(this.dropdownContent);

        // Append dropdown container to the parent container
        typeContainer.appendChild(this.dropdownContainer);

        // Update selected options display
        this.updateSelectedOptionsDisplay();
    }

    /**
    * Toggles the dropdown display.
     */
    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen; // Toggle dropdown state
        this.dropdownContent.style.display = this.isDropdownOpen ? 'block' : 'none';
        this.arrowIcon.classList.toggle('down'); // Toggle arrow direction class
        this.arrowIcon.classList.toggle('right');
    }
    /**
    * Toggles the selection of an option.
    * @param {string} option - The option to toggle.
    */
    toggleOption(option) {
        if (option === 'All') {
            this.selectedOptions = this.options.slice()

        }
        else {
            const index = this.selectedOptions.indexOf(option);
            if (index === -1) {
                this.selectedOptions.push(option);
            } else {
                this.selectedOptions.splice(index, 1);
            }
             // Update selected options display

        }
        this.updateSelectedOptionsDisplay();

        // Call the onChange function whenever the selection changes
        if (this.onChange) {
            this.onChange(this.selectedOptions);
        }


    }
    /**
     * Updates the display of selected options.
     */

    updateSelectedOptionsDisplay() {
        // Clear previous selected options display
        this.selectedOptionsContainer.innerHTML = '';

        // Create and append selected option elements with close buttons
        this.selectedOptions.forEach(option => {
            const selectedOptionElement = document.createElement('div');
            selectedOptionElement.classList.add('selected-option');

            // Create text span for option text
            const optionText = document.createElement('span');
            optionText.textContent = option;
            optionText.style.color = 'white';

            // Create close button
            const closeButton = document.createElement('span');
            closeButton.classList.add('close-button');
            closeButton.innerHTML = '&times;'; // Unicode multiplication symbol (×) for close button
            closeButton.onclick = () => this.removeSelectedOption(option);

            // Append text and close button to selected option element
            selectedOptionElement.appendChild(optionText);
            // this.dropdownContainer.removeChild(optionText);
            selectedOptionElement.appendChild(closeButton);

            // Append selected option element to selected options container
            this.selectedOptionsContainer.appendChild(selectedOptionElement);
        });

        // Update button text based on the number of selected options
        this.button.textContent = 'Types of Destination';
    }
    /**
     * Removes a selected option.
     * @param {string} optionToRemove - The option to remove.
     */
    removeSelectedOption(optionToRemove) {
        if (optionToRemove === 'All') {
            this.selectedOptions = []


        } else {
            this.selectedOptions = this.selectedOptions.filter(option => option !== optionToRemove);
        }
        this.updateSelectedOptionsDisplay();

        // Call the onChange function whenever the selection changes
        if (this.onChange) {
            this.onChange(this.selectedOptions);
        }

    }
    /**
    * Retrieves the currently selected option values.
    * @returns {Array} The currently selected option values.
     */
    getValues() {
        return this.selectedOptions;
    }
}
