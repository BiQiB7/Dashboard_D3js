# Interactive Dashboard created with D3.js
## Guide to India Must See Places
![image](https://github.com/BiQiB7/Dashboard_D3js/assets/121548392/ab4bb6f7-361e-46a3-b5e4-9d833b4ac406)
## Jobs and Salary in Data Science
![image](https://github.com/BiQiB7/Dashboard_D3js/assets/121548392/bfbc8dea-8861-42b7-a8ca-aab1ed0da54e)
# F20DV MY Group 2 Project - Dashboard
The overall application structure is outlined as follows:

The `index.html` file loads the D3 library, the main stylesheet (`main.css`), establishes the page layout, and finally calls the main script (`main.js`).

Within `main.js`, we have 2 datasets: the *Jobs and Salaries in Data Science* dataset (`DSdata`) and the *Guide to India Must See Places* dataset (`indiaData`). We also instantiate and render 6 types of charts:
 - A line chart
 - A bar chart
 - A scatter plot
 - A map
 - A bubble chart
 - A donut chart

Each chart has dedicated class file (inside `scripts/Data_Science` for *Jobs and Salaries in Data Science* dataset and `scripts/India_Dashboard` for *Guide to India Must See Places* dataset) and a dedicated stylesheet (inside `styles/Data_Science` for *Jobs and Salaries in Data Science* dataset and `styles/India_Dashboard` for *Guide to India Must See Places* dataset). 

## Jobs and Salaries in Data Science
For the *Jobs and Salaries in Data Science* dataset, we have developed 3 charts designed to serve different purposes.
1. A line chart to identify salary trends over time.
2. A bar chart to compare the salary disparities across job categories.
3. A scatter plot to analyze the salary level benchmarks for each job title.

### Salary Trends Over Time

#### Features and Interactivity:

- **Job Category Dropdown:** Provides users with the option to filter points of interest by job category.

#### Technical Structure
The `LineChart` class demonstrates the process of creating line charts..

We have also included the code for a job category dropdown filter for the line chart in  `main.js`. The default job category value for this visualization is "BI and Visualization".

### Salary Disparities Across Job Category

#### Features and Interactivity:

- **Year Dropdown:** Provides users with the option to filter points of interest by year, and update the scatter plot based on the selected year.
- **Select Highlight:** By clicking on a bar, it becomes highlighted and the scatter plot will be updated based on the selected job category.

#### Technical Structure
The `BarChart` class demonstrates the process of creating bar charts. It also includes code to highlight the selected bar, and associate data with each bar, enabling linked interactions to filter job categories in the scatter plot.

We have also included the code for a year dropdown filter for the bar chart in  `main.js`. The default year value for this visualization is "2023".

### Salary Levels Benchmarks

#### Features and Interactivity:

- **Hover Highlight & Tooltip:** By hovering over a dot, it becomes highlighted and displays a tooltip containing the job title and its median salary.

#### Technical Structure
The `ScatterPlot` class illustrates the process of creating scatter plots. It also includes code to rotate x-tick labels, bind data to each dot, represent dots of different job categories with distinct colors, providing a legend associating colors with job categories, animate placement and sizing.

In `main.js`, we also included the linked interaction code to update the scatter plot's job category based on the selected bar in the bar chart. The year value of the scatter plot is synchronized with the bar chart.

###  Enhancing User Experience

All charts are meticulously designed with user interaction in mind:

- **Line Chart:** Utilizing the job category filter dynamically alters the chart's data presentation.
- **Bar Chart:** Utilizing the year filter dynamically alters both bar chart and scatter plot's data presentation. Highlights selected job category and update scatter plot's data presentation.
- **Scatter Plot:** Hovering over bubbles unveils detailed data tooltips.

## Guide to India Must See Places
This section focuses exclusively on the *Guide to India Must See Places* Dashboard of our project, which utilizes D3.js to visualize data from the *Guide to India Must See Places* dataset. These visualizations are crafted to provide insightful and interactive representations of the data, thereby enhancing the analytical experience.

For the *Guide to India Must See Places* dataset, we have developed 3 charts designed to serve different purposes.
1. A map to visualize attractions recommendation based on user preference.
2. A bubble chart to compare the popularity of different types Of significance.
3. A donut chart to analyze the distribution of attractions by zones.

### Interactive Map:
#### Features and Interactivity
- **Entrance Fee Slider:** Allows users to filter points of interest based on the maximum entrance fee criterion.
- **Rating Slider:** Enables users to specify the minimum rating threshold for points of interest.
- **Destination Type Multi-Select Dropdown:** Provides users with the option to filter points of interest by destination type.
- **Airport Checkbox:** Allows users to filter points of interest based on proximity to an airport within a 50km radius.
 - **Camera Checkbox:** Enables users to filter points of interest based on whether DSLR photography is allowed.
- **Interactive Map:** Renders points of interest on an interactive map, where users can hover over points to view detailed tooltips containing information such as the attraction's name and city.

#### Technical Structure
The `Map.js` defines initialization and update of Map, and instantiations of various components imported from `Slider.js`, `Dropdown.js`, `Checkbox.js`.
#### Initialization:
- **Constructor:** Initializes the map container and sets up the SVG element to render the map and points.
- **Zoom Setup:** Configures zoom behavior for the map, enabling users to zoom in and out for a better view.
- **Map Rendering:**
    - Base Map: Renders the base map using a specified projection function, such as d3.geoEqualEarth. This function fits the map to the specified width and height and renders geographical regions.
    - Points Rendering: Renders points of interest on the map, where each point is represented as a circle. Additionally, tooltips are displayed upon hovering over points, providing detailed information about the attraction.
    - Top 3 attractions points Rendering: Render pins on attractions with top 3 rating, among those that satisfy the user input criterias.

#### Data Filtering:
- Filter Data Method: Filters the dataset based on user-defined criteria such as maximum entrance fee, minimum rating, selected destination types, and checkbox states (airport and camera). This method returns the filtered data to be rendered on the map.
- Event Handling: Listens for changes in filter controls and triggers the filtering process accordingly, ensuring that the map dynamically updates based on user interactions.

### Bubble Chart: Visualizing Attraction Significance

The Bubble Chart provides an overview of tourist attractions in India, classified by their significance. This significance is quantified through analyzing Google review ratings and the number of reviews.

#### Features and Interactivity:

- **Hover Highlight & Tooltip:** By hovering over a bubble, it becomes highlighted and displays a tooltip containing the attraction's name, its significance level, and the average review count.
- **Dynamic Sizing:** The size of each bubble varies in accordance with the attraction's review count and rating, respectively. This approach provides a multidimensional view of the data.

#### Technical Structure:

- The data preparation, chart initialization, and rendering are done in `main.js`, relying on the extensive capabilities of D3.js.

### Donut Chart: Zone Distribution with Year Filtering

Designed to illustrate the zone-wise distribution of tourist attractions, the Donut Chart introduces a feature that allows for data filtering based on the year of establishment through sliding the slider. This functionality enables users to explore the evolving landscape of attractions over time.

#### Features and Interactivity:

- **Dynamic Data Update:** Upon selection of a filter, the chart dynamically updates to accurately represent the current distribution.
- **Interactive Legend:** The inclusion of an interactive legend permits users to highlight or concentrate on specific zones within the visualization.

#### Technical Structure:

- The `DonutChart` class encapsulates the chart's construction and update logic. It utilizes D3.js for effective data-driven DOM manipulations, ensuring a responsive and engaging visualization experience.

###  Enhancing User Experience

All charts are meticulously designed with user interaction in mind:

- **Map:** Render points on Map with top 3 rating attractions depending on user input filter values, with tooltip to label the attractions' location.
- **Bubble Chart:** Hovering over bubbles unveils detailed data tooltips.
- **Donut Chart:** Utilizing the year filter dynamically changes the presentation of the chart's data.

## References
- The donut chart in `DonutChart.js` was referenced from official D3.js website [https://d3-graph-gallery.com/graph/donut_label.html] for chart annotation.
- The double thumb slider in `india.html` and `doubleThumbSlider.css` has referenced [https://codingartistweb.com/2021/06/double-range-slider-html-css-javascript/]. It allows users to drag and alter the range of desired 'establishment year' of destinations, and subsequently apply filters to the data points.

