import Slider from './Slider.js';
import MultiSelectDropdown from './Dropdown.js';
import Checkbox from './Checkbox.js';

export default class Map {


    width; height;

    svg; mapGroup; pointGroup;
    projection; pathGen;

    zoom;

    regions;
    data;


    /**
     * Creates an instance of Map.
     * @param {string} container - The container element selector.
     * @param {number} width - The width of the map.
     * @param {number} height - The height of the map.
     */

    constructor(container, width, height) {
        this.width = width;
        this.height = height;


        // setting up selections
        this.svg = d3.select(container).append('svg')
            .classed('vis map', true)
            .attr('width', width)
            .attr('height', height)
            .style('margin-left','10px');
        this.mapGroup = this.svg.append('g')
            .classed('map', true);
        this.pointGroup = this.svg.append('g')
            .classed('points', true);

        // setting the zoom
        this.#setZoom();

    }
    /**
    * Sets up the zoom behavior for the map.
    * @private
    */

    #setZoom() {
        this.zoom = d3.zoom()
            .extent([[0, 0], [this.width, this.height]])
            .translateExtent([[0, 0], [this.width, this.height]])
            .scaleExtent([1, 8])
            .on('zoom', ({ transform }) => {
                // applies transform and call render map to update zoom scales
                this.mapGroup.attr('transform', transform);
                this.pointGroup.attr('transform', transform);
            })
        this.svg.call(this.zoom)
    }

    /**
     * Renders the base map using a specified projection.
     * @param {function} projection - The projection function.
     * @private
     */
    #renderMap(projection) {
        this.projection = projection()
            .fitSize([this.width, this.height], this.regions);
        this.pathGen = d3.geoPath()
            .pointRadius(4)
            .projection(this.projection);

        this.mapGroup.selectAll('path.regions')
            .data(this.regions.features)
            .join('path')
            .classed('regions', true)
            .attr('d', this.pathGen);
    }

    /**
         * Renders the base map.
         * @param {Array} regions - The regions data to be rendered.
         * @param {function} [projection=d3.geoEqualEarth] - The projection function.
         * @returns {Map} The Map instance for method chaining.
         */

    baseMap(regions = [], projection = d3.geoEqualEarth) {
        this.regions = regions;
        this.#renderMap(projection);
        return this;
    }
    /**
 * Filters the data based on user-defined criteria.
 * @param {number} maxFee - The maximum entrance fee.
 * @param {number} minRating - The minimum rating.
 * @param {Array} selectedTypes - The selected types of destination.
 * @param {boolean} airportIsChecked - Indicates if airport checkbox is checked.
 * @param {boolean} cameraIsChecked - Indicates if camera checkbox is checked.
 * @returns {Array} The filtered data.
 */

    filterData(maxFee, minRating, selectedTypes, airportIsChecked, cameraIsChecked) {
        console.log("max fee".concat(maxFee, "min rating", minRating))
        return this.data.filter(point => {
            // [+d.latitude, +d.longitude, d.name, d.city, +d.entrance_fee, +d.rating, d.type, d.airport_with_50km_radius, d.DSLR_allowed]
            const entranceFee = point[4];
            const rating = point[5];
            const type = point[6];
            const airport = point[7];
            const camera = point[8]
            if (airportIsChecked && cameraIsChecked) {

                return entranceFee <= maxFee && rating >= minRating && selectedTypes.includes(type) && airport == 'Yes' && camera == 'Yes';
            }
            else if (airportIsChecked && !cameraIsChecked) // if not checked, accept all (have or do not have also accept)
            {
                return entranceFee <= maxFee && rating >= minRating && selectedTypes.includes(type) && airport == 'Yes';
                //return entranceFee <= maxFee && rating >= minRating && selectedTypes.includes(type);
            }
            else if (cameraIsChecked && !airportIsChecked) {
                return entranceFee <= maxFee && rating >= minRating && selectedTypes.includes(type) && camera == 'Yes';
            }
            else if (!cameraIsChecked && !airportIsChecked) {
                return entranceFee <= maxFee && rating >= minRating && selectedTypes.includes(type);
            }

        });

    }
    /**
    * Renders points on the map with associated tooltips.
    * @param {Array} pointsData - The data for the points to be rendered.
    */
    #renderPoints(pointsData) {
        // Remove existing circles and icons
        this.mapGroup.selectAll('circle').remove();
        this.mapGroup.selectAll('.top3-icon').remove();

        let tooltip = d3
            .select('#map') // Append tooltip to the map container
            .append('div')
            .style('position', 'absolute')
            .style('z-index', '10')
            .style('visibility', 'hidden')
            .style('background-color', '#fff')
            .style('border', '1px solid #ccc')
            .style('border-radius', '5px')
            .style('padding', '10px');

        // Append the circles to the SVG element
        let svgCircles = this.mapGroup.selectAll('circle')
            .data(pointsData)
            .enter()
            .append('circle')
            .attr('cx', d => this.projection([d[1], d[0]])[0])
            .attr('cy', d => this.projection([d[1], d[0]])[1])
            .attr('r', 5)
            .style('fill', 'blue')
            .style('opacity', 0.5)
            .on('mouseover', function (event, d) {
                let htmlContent = `
        <div style="font-size: 20px; color: black; font-weight:bold;">${d[2]}</div>
        <div style="font-size: 15px; color: #A9A9A9;">${d[3]}</div>`;
                // let txt = `${d[2]}, ${d[3]}`;
                return tooltip
                    .html(htmlContent)
                    .style('top', event.pageY - 10 + 'px')
                    .style('left', event.pageX + 10 + 'px')
                    .style('visibility', 'visible');
            })
            .on('mouseout', function () {
                return tooltip.style('visibility', 'hidden');
            });

        pointsData.sort((a, b) => b[5] - a[5]);
        // Select the top 3 elements with highest rating
        const top3 = pointsData.slice(0, 3);
        console.log(top3)
        if (top3.length > 0) {
            let top3Icons = this.mapGroup.selectAll('.top3-icon')
                .data(top3)
                .enter()
                .append('image')
                .classed('top3-icon', true)
                .attr('xlink:href', './styles/pin.png') // Replace with the actual path to your PNG icon
                .attr('x', d => {
                    return this.projection([d[1], d[0]])[0] - (32 / 2); // Adjust x position
                })
                .attr('y', d => {
                    return this.projection([d[1], d[0]])[1] - 32; // Adjust y position
                })
                .attr('width', 32)
                .attr('height', 32)
                .style('pointer-events', 'auto')
                .on('click', function (event, d) {
                    // Display tooltip on click
                    let htmlContent = `
            <div style="font-size: 20px; color: black; font-weight:bold;">${d[2]}</div>
            <div style="font-size: 15px; color: #A9A9A9;">${d[3]}</div>`;
                    return tooltip
                        .html(htmlContent)
                        .style('top', event.pageY - 10 + 'px')
                        .style('left', event.pageX + 10 + 'px')
                        .style('visibility', 'visible');
                })
                .on('mouseout', function () {
                    return tooltip.style('visibility', 'hidden');
                });

        }
    }
    /**
     * Renders points of interest on the map.
     * @param {Array} dataset - The dataset containing points of interest.
     * @returns {Map} The Map instance for method chaining.
     */

    renderPoints(dataset) {
        this.data = dataset;
        this.#renderPoints(dataset);

        const minRatingBound = 1.4;
        const maxRatingBound = 5;
        const minEntranceFeeBound = 0;
        const maxEntranceFeeBound = 7500;
        const options = this.data.map(point => point[6]); // Assuming column 6 represents the type
        const uniqueOptions = [...new Set(options)];

        console.log(uniqueOptions);


        this.entranceFeeContainer = document.getElementById('slider-entrance-fee-container');
        this.ratingContainer = document.getElementById('slider-rating-container');
        this.typeContainer = document.getElementById('dropdown-type-container');
        this.airportCheckboxContainer = document.getElementById('checkbox-airport-container');
        this.cameraCheckboxContainer = document.getElementById('checkbox-camera-container');


        const onChange = () => {
            console.log("entrance fee:".concat(this.entrance_fee_slider.getValues()))
            const filteredData = this.filterData(this.entrance_fee_slider.getValues(), this.rating_slider.getValues(), this.type_dropdown.getValues(), this.airport_checkbox.isChecked(), this.camera_checkbox.isChecked());
            // Re-render points with filtered data
            console.log(filteredData)

            this.#renderPoints(filteredData);

        }

        this.entrance_fee_slider = new Slider(this.entranceFeeContainer, minEntranceFeeBound, maxEntranceFeeBound, onChange);
        this.rating_slider = new Slider(this.ratingContainer, minRatingBound, maxRatingBound, onChange);
        this.type_dropdown = new MultiSelectDropdown(this.typeContainer, uniqueOptions, onChange)
        this.camera_checkbox = new Checkbox(this.cameraCheckboxContainer, 'allows photography', onChange);
        this.camera_checkbox.setChecked(false);
        this.airport_checkbox = new Checkbox(this.airportCheckboxContainer, 'airport within 50km', onChange);
        this.airport_checkbox.setChecked(false);




        return this;
    }


}