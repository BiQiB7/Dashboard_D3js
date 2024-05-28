export default class Checkbox {
    /**
 * Checkbox constructor function
 * @param {HTMLElement} container - The container element where the checkbox will be appended
 * @param {string} label - The label text for the checkbox
 * @param {Function} onChange - The function to be called when the checkbox state changes
 */
    constructor(container, label, onChange) {
        this.container = container;
        this.label = label;
        this.onChange = onChange;

        // Create checkbox input element
        this.checkbox = document.createElement('input'); // this.checkbox is null, why??
        this.checkbox.type = 'checkbox';
        this.checkbox.id = label;
        this.checkbox.addEventListener('change', () => this.handleCheckboxChange());

        // Create label element for checkbox
        this.labelElement = document.createElement('label');
        this.labelElement.htmlFor = label;
        this.labelElement.textContent = label;

        // Append checkbox and label to container
        this.container.appendChild(this.checkbox);
        this.container.appendChild(this.labelElement);
    }
    /**
     * Handles the change event of the checkbox
     * Calls the onChange function if provided
     */
    handleCheckboxChange() {
        if (this.onChange) {
            this.onChange(this.checkbox.checked);
        }
    }
    /**
 * Checks whether the checkbox is currently checked
 * @returns {boolean} - True if the checkbox is checked, false otherwise
 */

    isChecked() {
        return this.checkbox.checked;
    }
    /**
     * Sets the checked state of the checkbox
     * @param {boolean} checked - The desired checked state of the checkbox
     */
    setChecked(checked) {
        this.checkbox.checked = checked;
    }
}
