export default class LineChart {
    constructor(container, width, height, margin) {
      // Initialization code
      this.container = container;
      this.width = width;
      this.height = height;
      this.margin = margin;
  
      // Create SVG element
      this.svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
  
      // Create scales
      this.xScale = d3.scaleBand().padding(0.1);
      this.yScale = d3.scaleLinear();
  
      // Create axes
      this.xAxis = this.svg.append('g').attr('class', 'x-axis');
      this.yAxis = this.svg.append('g').attr('class', 'y-axis');
  
      // Create path for the line
      this.linePath = this.svg.append('path').attr('class', 'line');
    }
  
    render(data) {
      // Sort data by year in ascending order
      data.sort((a, b) => a.year - b.year);
      
      // Update scales
      this.xScale.domain(data.map(d => d.year))
        .range([0, this.width - this.margin[2] - this.margin[3]]);
      this.yScale.domain([40000, 200000])
        .range([this.height - this.margin[0] - this.margin[1], 0]);
  
      // Update axes
      this.xAxis.attr('transform', `translate(${this.margin[2]}, ${this.height - this.margin[2]})`)
        .call(d3.axisBottom(this.xScale));
      this.yAxis.attr('transform', `translate(${this.margin[2]}, ${this.margin[0]})`)
        .call(d3.axisLeft(this.yScale));
  
      // Define line function with curve interpolation
      let line = d3.line()
        .x(d => this.xScale(d.year) + this.xScale.bandwidth())
        .y(d => this.yScale(d.median_salary))
        .curve(d3.curveBasis); // Apply curve interpolation
  
      // Draw line
      this.linePath.datum(data)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2);
    }
  
    setLabels(xLabel, yLabel) {
      // Add labels
      this.svg.selectAll('.x-label').remove();
      this.svg.selectAll('.y-label').remove();
  
      this.svg.append('text')
        .attr('class', 'x-label')
        .attr('x', this.width / 2)
        .attr('y', this.height - this.margin[2] / 2)
        .attr('text-anchor', 'middle')
        .style('fill', '#3E5D81')
        .text(xLabel);
  
      this.svg.append('text')
        .attr('class', 'y-label')
        .attr('transform', `translate(0, ${this.margin[0]})rotate(-90)`)
        .attr('text-anchor', 'end')
        .attr('dy', 40)
        .style('fill', '#3E5D81')
        .text(yLabel);
    }
  }
  