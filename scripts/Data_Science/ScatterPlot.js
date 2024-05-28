export default class ScatterPlot
{ 
    // Attributes
    width; height; margin; // size
    svg; chart; dots; axisX; axisY; labelX; labelY; legend; colors; // selections
    scaleX; scaleY;
    data; // internal data

    // Constructor
    /*  - container: DOM selector
        - width: visualisation width
        - height: visualisation height
        - margin: chart area margins [top, bottom, left, right]
    */
    constructor(container, width, height, margin) {
        this.width = width;
        this.height = height;
        this.margin = margin;

        this.svg = d3.select(container)
            .append('svg') 
            .classed('scatterplot', true) 
            .attr('width', width)
            .attr('height', height);
        
        // Add margins for chart area
        this.chart = this.svg.append('g') // chart area
            .attr('transform', `translate(${this.margin[2]}, ${this.margin[0]})`);  // margin: left, top
        this.dots = this.chart.selectAll('circle.dot');

        // Add axes
        this.axisX = this.svg.append('g') // x-axis
            .attr('transform', `translate(${this.margin[2]}, ${this.height - this.margin[1]})`); // margin: left, bottom
        this.axisY = this.svg.append('g') // y-axis
            .attr('transform', `translate(${this.margin[2]}, ${this.margin[0]})`); 

        // Add axe labels
        this.labelX = this.svg.append('text') // x-label
            .attr('transform', `translate(${this.width / 2}, ${this.height})`)
            .style('text-anchor', 'middle')
            .attr('dy', -10);
        this.labelY = this.svg.append('text') // y-label
            .attr('transform', `translate(0, ${this.margin[0]})rotate(-90)`)
            .style('text-anchor', 'end')
            .attr('dy', 25);
    }

    // Private methods
    #updateScales() {
        let chartWidth = this.width - this.margin[2] - this.margin[3],
            chartHeight = this.height - this.margin[0] - this.margin[1];

        let rangeX = [0, chartWidth],
            rangeY = [chartHeight, 0];  // vertical axis in SVG goes from top to bottom; draw bars from bottom to top = invert the bounds of range.
        
        let domainX = this.data.map(d => d[2]),             // x = job title
            domainY = [0, d3.max(this.data, d => d[3])];    // y = median salary

        this.scaleX = d3.scaleBand(domainX, rangeX);
        this.scaleY = d3.scaleLinear(domainY, rangeY);
    }
    
    // Private methods
    #updateAxes() {
        let axisGenX = d3.axisBottom(this.scaleX);
        let axisGenY = d3.axisLeft(this.scaleY);
        this.axisX.call(axisGenX)
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-90)');
        this.axisY.call(axisGenY);
    }

    // Private methods
    // data is in the format [[key,value],...]
    #updateDots()
    {            
        // Define a color scale for job categories
        let colorScale = d3.scaleOrdinal()
            .domain([...new Set(this.data.map(d => d[1]))]) // Unique job categories
            .range(d3.schemeCategory10); // Color range
        
        // Bind and join dots to data
        this.dots = this.dots
            .data(this.data, d => d[2])
            .join('circle')
            .classed('dot', true)
            .style('fill', d => colorScale(d[1]));
        
        // Animate placement and sizing
        let threshold = this.scaleX.bandwidth() / 2;
        this.dots.transition().duration(500)
            .attr('cx', d => this.scaleX(d[2])+threshold)
            .attr('cy', d => this.scaleY(d[3]))
            .attr('r', 5);
        
        // Dot tooltip
        this.dots.selectAll('title')
            .data(d => [d])
            .join('title')
            .attr('class', 'tooltip')
            .text(d => `${d[2]}: ${d[3]}`);
    }

    // Private methods
    #updateLegend()
    {
        this.svg.selectAll('.legend').remove();

        let unique = [...new Set(this.data.map(d => d[1]))];

        // Color legend
        this.legend = this.svg.append('g')
            .classed('legend', true)
            .attr('transform', `translate(${this.margin[2]*3 - 11}, 0)`);
        
        // Add a background rectangle for the legend
        this.legend.append('rect') 
            .attr('width', 285)
            .attr('height', 27*unique.length + 9) // Set height based on number of elements in unique + 9 margin-bottom
            .style('fill', 'none') // Set fill to 'none' to ommit background color
            .style('stroke', '#3E5D81') // Border color
            .style('stroke-width', '1px'); // Border width
        
        // legend item area
        this.colors = this.legend.append('g') 
            .attr('transform', 'translate(10, 10)')
            .selectAll('.legend')
            .data(d3.schemeCategory10.filter((_, i) => i < unique.length))
            .join('g')
            .classed('legend-item', true)
            .attr('transform', (_, i) => `translate(0, ${i * 26})`);

        // legend item color
        this.colors.append('rect')
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', d => d);

        // legend item label
        this.colors.append('text')
            .attr('x', 30)
            .attr('y', 9)
            .attr('dy', '0.35em')
            .text((_, i) => unique[i]);
    }
    
    // Public API
    render(dataset) {
        this.data = dataset;
        this.#updateScales();
        this.#updateAxes();
        this.#updateDots();
        this.#updateLegend();
        return this; // to allow chaining
    }

    setLabels(labelX = 'Categories', labelY = 'Values') {
        this.labelX.text(labelX);
        this.labelY.text(labelY);
        return this;
    }
}
   