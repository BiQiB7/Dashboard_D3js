export default class BarChart
{ 
    // Attributes 
    width; height; margin; // size
    svg; chart; bars; axisX; axisY; labelX; labelY;   // selections
    scaleX; scaleY; 
    data; 


    //object attributes to store callback references
    barClick = () => { };


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
            .attr('width', width)
            .attr('height', height)
            .classed('barchart', true);
        
        // Add margins for chart area
        this.chart = this.svg.append('g') // chart area
            .attr('transform', `translate(${this.margin[2]}, ${this.margin[0]})`);
        this.bars = this.chart.selectAll('rect.bar');

        // Add axes
        this.axisX = this.svg.append('g') // x-axis
            .attr('transform', `translate(${this.margin[2]}, ${this.height - this.margin[1]})`); // margin: left, bottom
        this.axisY = this.svg.append('g') // y-axis
            .attr('transform', `translate(${this.margin[2]}, ${this.margin[0]})`); // margin: left, top

        // Add axe labels
        this.labelX = this.svg.append('text') // x-label
            .attr('transform', `translate(${this.width / 2}, ${this.height})`)
            .style('text-anchor', 'middle')
            .attr('dy', -10); // shift label up (-) / down (+)
        this.labelY = this.svg.append('text') // y-label
            .attr('transform', `translate(0, ${this.margin[0]})rotate(-90)`)
            .style('text-anchor', 'end')
            .attr('dy', 25); // shift label right (+) / left (-)
    }

    // Private methods
    #updateScales() {
        let chartWidth = this.width - this.margin[2] - this.margin[3],
            chartHeight = this.height - this.margin[0] - this.margin[1];

        let rangeX = [0, chartWidth],
            rangeY = [chartHeight, 0];  // vertical axis in SVG goes from top to bottom; draw bars from bottom to top = invert the bounds of range.
        
        let domainX = this.data.map(d => d[1]),             // x = Job Category
            domainY = [0, d3.max(this.data, d => d[2])];    // y = Median Salary
        
        this.scaleX = d3.scaleBand(domainX, rangeX).padding(0.2);
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
            .attr('transform', 'rotate(-45)');
        this.axisY.call(axisGenY);
    }

    // Private methods
    // data is in the format [[key,value],...]
    #updateBars() {
        this.bars = this.bars
            .data(this.data, d => d[1])
            .join('rect')
            .classed('bar', true)
            .attr('x', d => this.scaleX(d[1]))
            .attr('y', d => this.scaleY(d[2]))
            .attr('width', this.scaleX.bandwidth())
            .attr('height', d => this.scaleY(0) - this.scaleY(d[2]));
        
        // Bar tooltip
        // Bind data to 'title': Query the datum attached to rectangles, and return it as an array of 1 element
        this.bars.selectAll('title')
            .data(d => [d])
            .join('title')
            .text(d => `${d[1]}: ${d[2]}`);
        
        this.#updateEvents();
    }

    // Private methods
    #updateEvents()
    { 
        this.bars
            .on('click', (event, datum) =>
            {
                console.log(datum);
                this.barClick(event, datum);
            });
    }

    // Public API
    render(dataset) {
        this.data = dataset;
        this.#updateScales();
        this.#updateAxes();
        this.#updateBars();
        return this; // to allow chaining
    }

    setLabels(labelX = 'Categories', labelY = 'Values') {
        this.labelX.text(labelX).style('fill', '#3E5D81');
        this.labelY.text(labelY).style('fill', '#3E5D81');
        return this;
    }

    setBarClick(f = () => {}) { 
        // register new callback
        this.barClick = f;
        // rebind callback to event
        this.#updateEvents();
        return this;
    }

    highlightBars(keys = []) {
        // reset highlight for all bars
        this.bars.classed('highlighted', false);
        // filter bars and set new highlights
        this.bars.filter(d=>keys.includes(d[1]))
            .classed('highlighted', true);
        return this;
    }

}
   