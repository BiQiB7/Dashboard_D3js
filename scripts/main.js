import { DonutChart } from "./donutChart.js";
("use strict");
console.log(`D3 loaded, version ${d3.version}`);
import indiaMain from "./India_Dashboard_Map/indiaMain.js"

/* 
  Jobs and Salaries in Data Science: 
*/

/* Data Loading */

let DSdata = await d3.csv(
  "../data/Cleaned_Jobs_and_Salaries_in_Data_Science.csv",
  (d) => {
    return {
      work_year: +d.work_year,
      job_title: d.job_title,
      job_category: d.job_category,
      salary_currency: d.salary_currency,
      salary: +d.salary,
      salary_in_usd: +d.salary_in_usd,
      employee_residence: d.employee_residence,
      experience_level: d.experience_level,
      employment_type: d.employment_type,
      work_setting: d.work_setting,
      company_location: d.company_location,
      company_size: d.company_size,
    };
  }
);
console.log("Full data", DSdata);

/* Data Transformation */

// Summary - Total "salary_in_usd", Total number of "job_title", Total number of "job_category" (Filter by: Year = 2023)
let siFormat = d3.format("($~s");
let totalUsdSalary2023 = d3.sum(
  DSdata.filter((d) => d.work_year === 2023).map((d) => d.salary_in_usd)
);
let textTotalUsdSalary = siFormat(totalUsdSalary2023);
let totalJobTitle2023 = new Set(
  DSdata.filter((d) => d.work_year === 2023).map((d) => d.job_title)
).size; // Set return unique job titles
let totalJobCategory2023 = new Set(
  DSdata.filter((d) => d.work_year === 2023).map((d) => d.job_category)
).size; // Set return unique job categories
console.log("Total USD salary in text: ", textTotalUsdSalary);
console.log("Total salary in USD: ", totalUsdSalary2023);
console.log("Total unique job titles: ", totalJobTitle2023);
console.log("Total unique job categories: ", totalJobCategory2023);

let totalUsdSalary2022 = d3.sum(
  DSdata.filter((d) => d.work_year === 2022).map((d) => d.salary_in_usd)
);
let totalJobTitle2022 = new Set(
  DSdata.filter((d) => d.work_year === 2022).map((d) => d.job_title)
).size; // Set return unique job titles
let totalJobCategory2022 = new Set(
  DSdata.filter((d) => d.work_year === 2022).map((d) => d.job_category)
).size; // Set return unique job categories
console.log("Total salary in USD: ", totalUsdSalary2022);
console.log("Total unique job titles: ", totalJobTitle2022);
console.log("Total unique job categories: ", totalJobCategory2022);

let percentFormat = d3.format(".2%");
let totalSalaryGrowth = percentFormat(
  (totalUsdSalary2023 - totalUsdSalary2022) / totalUsdSalary2022
);
let totalJobTitleGrowth = percentFormat(
  (totalJobTitle2023 - totalJobTitle2022) / totalJobTitle2022
);
let totalJobCategoryGrowth = percentFormat(
  (totalJobCategory2023 - totalJobCategory2022) / totalJobCategory2022
);
console.log("Total salary growth: ", totalSalaryGrowth);
console.log("Total number of job titles growth: ", totalJobTitleGrowth);
console.log("Total number of job categories growth: ", totalJobCategoryGrowth);

// Line Chart - Y = Median "salary_in_usd", X = "work_year" (Filter by: "job_category")
let yearMedianSalary = d3.rollup(
  DSdata,
  (v) => d3.median(v, (d) => d.salary_in_usd),
  (d) => d.job_category,
  (d) => d.work_year
); // Nested Map: Key = Job category, Value = Map {Key = Year, Value = Median salary}
let textYearMedianSalary = new Map();
yearMedianSalary.forEach((value, key) => {
  let formattedValues = new Map();
  value.forEach((innerValue, innerKey) => {
    formattedValues.set(innerKey, siFormat(innerValue)); // To show median salary in legend
  });
  textYearMedianSalary.set(key, formattedValues);
});
console.log("Median salary by year: ", yearMedianSalary);
console.log("Median salary by year in text: ", textYearMedianSalary);

// Bar Chart - Y = Median "salary_in_usd", X = "job_category" (Filter by: "work_year")
let categoryMedianSalary = d3.flatRollup(DSdata, v => d3.median(v, d => d.salary_in_usd), d => d.work_year, d => d.job_category); // Nested Arrays: Key = Year, Value = Array {Key = Job category, Value = Median salary}
let textCategoryMedianSalary = new Map();
categoryMedianSalary.forEach((value, key) => {
  let formattedValues = new Map();
  value.forEach((innerValue, innerKey) => {
    formattedValues.set(innerKey, siFormat(innerValue)); // To show median salary in legend
  });
  textCategoryMedianSalary.set(key, formattedValues);
});
console.log("Median salary by job category: ", categoryMedianSalary);
console.log("Median salary by job category in text: ", textCategoryMedianSalary);

// Scatter Plot - Y = Median "salary_in_usd", X = "job_title" (Filter by: "work_year", "job_category", "job_title")
let titleMedianSalary = d3.flatRollup(DSdata, v => d3.median(v, d => d.salary_in_usd), d => d.work_year, d => d.job_category, d => d.job_title); // Nested Arrays: Key = Year, Value = Array {Key = Job category, Value = Array {Key = Job title, Value = Median salary}}
console.log('Median salary by job title: ', titleMedianSalary);


/* Visualisation */

/* Job Summary */

let totalSalaries = totalUsdSalary2023.toLocaleString();
console.log("Total Salaries: ", totalSalaries)
let totalJobTitles = totalJobTitle2023.toLocaleString();
let totalJobCategories = totalJobCategory2023.toLocaleString();
let salariesPercentage = totalSalaryGrowth;
let jobTitlesPercentage = totalJobTitleGrowth;
let jobCategoriesPercentage = totalJobCategoryGrowth;
if (document.getElementById('totalSalaries') != null && document.getElementById('totalJobTitles') != null && document.getElementById('totalJobCategories') != null) {
  document.getElementById('totalSalaries').innerText = totalSalaries;
  document.getElementById('salariesPercentage').innerText = `(${salariesPercentage}) increase from last year`;

  document.getElementById('totalJobTitles').innerText = totalJobTitles;
  document.getElementById('jobTitlesPercentage').innerText = `(${jobTitlesPercentage}) increase from last year`;

  document.getElementById('totalJobCategories').innerText = totalJobCategories;
  document.getElementById('jobCategoriesPercentage').innerText = `(${jobCategoriesPercentage}) increase from last year`;
}

/* Line Chart */

import LineChart from "./Data_Science/LineChart.js";

let lineChart = new LineChart('div#LineChart', 1000, 700, [80, 100, 100, 50]);  // [top, bottom, left, right]

let lineChartDropdown = d3.select('div#LineChartDropdown').append('select');

let jobCategories = [...new Set(DSdata.map(d => d.job_category))];
jobCategories.sort();

lineChartDropdown.selectAll('option')
  .data(jobCategories)
  .join('option')
  .text(d => d)
  .attr('value', d => d);

lineChartDropdown.on('change', () => {
  let selectedJobCategory = lineChartDropdown.property('value');
  console.log("Selected Job Category: ", selectedJobCategory);

  let filteredData = DSdata.filter(d => d.job_category === selectedJobCategory);

  let salaryTrendData = d3.rollup(filteredData, 
    v => d3.median(v, d => d.salary_in_usd),
    d => d.work_year
  );

  let formattedData = Array.from(salaryTrendData, ([key, value]) => ({ year: key, median_salary: value }));

  lineChart.render(formattedData);
  lineChart.setLabels('Year', 'Median Salary (USD)');
});

let initialJobCategory = jobCategories[0];
let initialFilteredData = DSdata.filter(d => d.job_category === initialJobCategory);
let initialSalaryTrendData = d3.rollup(initialFilteredData,
  v => d3.median(v, d => d.salary_in_usd),
  d => d.work_year
);
let initialFormattedData = Array.from(initialSalaryTrendData, ([key, value]) => ({ year: key, median_salary: value }));
lineChart.render(initialFormattedData);
lineChart.setLabels('Year', 'Median Salary (USD)');


/* Bar Chart */

import BarChart from "./Data_Science/BarChart.js";
let barChart = new BarChart('div#BarChart', 1000, 700, [10, 150, 80, 20]);
// categoryMedianSalary == Nested Map: Key = Year, Value = Map {Key = Job category, Value = Median salary}

/* Filter function */
let dropdown = d3.select('div.BarChartDropdown').append('select');

// Extract unique years from categoryMedianSalary
let years = [...new Set(categoryMedianSalary.map(d => d[0]))];
years.sort((a, b) => a - b);

let selectedYear = 2023; // Default year value
dropdown.selectAll('option')
  .data(years)
  .join('option')
  .text(d=>d)
  .attr('value', d => d)
  .property('selected', d => d === selectedYear ? true : null);

// Attach an event handler to the change event of the dropdown element  
dropdown.on('change', ()=>{
  selectedYear = +dropdown.property('value');
  console.log("Selected Year: ", selectedYear);

  // Update the bar chart with data for the selected year
  let filteredData = categoryMedianSalary.filter(d => d[0] === selectedYear);
  console.log(filteredData);
  barChart.highlightBars();    // Reset bar highlights whenever user filter the year
  barChart.render(filteredData);
  barChart.setLabels('Job Categories', 'Median Salary (USD)');

  // Update the scatter plot with data for the selected year
  d3.select('h2#ScatterPlotTitle').text('Salary Levels Benchmarks for ' + selectedYear);
  let selectedDataEntry = titleMedianSalary.filter(d => d[0] === selectedYear);
  console.log(selectedDataEntry);
  scatterPlot.render(selectedDataEntry);
  scatterPlot.setLabels('Job Titles', 'Median Salary (USD)');
})

// Initial rendering with default year value
let initialData = categoryMedianSalary.filter(d => d[0] === selectedYear);
barChart.render(initialData);
barChart.setLabels('Job Categories', 'Median Salary (USD)');


/* Scatter Plot */

import ScatterPlot from "./Data_Science/ScatterPlot.js";
let scatterPlot = new ScatterPlot('div#ScatterPlot', 1000, 700, [200, 250, 80, 20]);

// Default scatter plot
let selectedDataEntry = titleMedianSalary.filter(d => d[0] === selectedYear);
scatterPlot.render(selectedDataEntry);
scatterPlot.setLabels('Job Titles', 'Median Salary (USD)');

// Filter job category for scatter plot
let filterJobCategory = (e, d) =>
{
  let jobCategory = d[1];
  let filteredData = selectedDataEntry.filter(d => d[1] === jobCategory);
  barChart.highlightBars([jobCategory]);
  scatterPlot.setLabels(`Job Titles of ${jobCategory}`, 'Median Salary (USD)')
  scatterPlot.render(filteredData);
}

barChart.setBarClick(filterJobCategory); // Whenever a bar is selected, filter scatter plot based on the selected job category


/* 
  Travel Dataset: 
*/
indiaMain.loadData();

/* Data Loading */
let indiaData = await d3.csv("../data/Top Indian Places to Visit.csv", (d) => {
  return {
    zone: d.zone,
    state: d.state,
    city: d.city,
    name: d.name,
    type: d.type,
    establishment_year: d.establishment_year,
    time_needed_to_visit_in_hrs: parseFloat(d.time_needed_to_visit_in_hrs),
    google_review_rating: parseFloat(d.rating),
    entrance_fee_in_INR: parseFloat(d.entrance_fee_in_INR),
    airport_with_50km_radius: d.airport_with_50km_radius,
    significance: d.significance,
    DSLR_allowed: d.DSLR_allowed,
    number_of_google_review_in_lakhs: parseFloat(
      d.number_of_google_review_in_lakhs
    ),
  };
});
console.log("Travel Dataset: ", indiaData);

/* Data Transformation */


/* Bubble Chart */
const significanceData = Array.from(
  d3.group(indiaData, (d) => d.significance),
  ([significance, array]) => ({
    significance: significance,
    averageRating: d3.mean(array, (d) => d.google_review_rating),
    totalReviews: d3.sum(array, (d) => d.number_of_google_review_in_lakhs),
  })
);

significanceData.forEach((d) => {
  d.averageRating = +d.averageRating;
  d.totalReviews = +d.totalReviews;
});

significanceData.sort((a, b) =>
  d3.descending(a.averageRating, b.averageRating)
);

const margin = { top: 70, right: 60, bottom: 70, left: 80 };
const width=800;
const height=300;

//create the SVG container for the visualization.
const svg = d3
  .select("#bubbleCard")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left+40},${margin.top})`);

svg
  .append("text")
  .attr("class", "title-text")
  .attr("x", width / 2)
  .attr("y", -margin.top / 2)
  .attr("text-anchor", "middle")
  .style("font-size", "24px")
  .style("font-weight", "600")
  .text("Popularity of Types Of Significance");

svg
  .append("text")
  .attr("class", "axis-label")
  .attr("transform", "rotate(-90)")
  .attr("y", -margin.left + 40)
  .attr("x", -height / 2)
  .style("text-anchor", "middle")
  .style("font-size", "16px")
  .style("font-weight", "400")
  .text("Average Google Rating");

const x = d3
  .scaleBand()
  .range([0, width])
  .domain(significanceData.map((d) => d.significance))
  .padding(0.1);

// Adding  X-axis to the svg
svg
  .append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-30)")
  .style("font", "13px sans-serif")
  .style("text-anchor", "end");

const y_min = d3.min(significanceData, (d) => d.averageRating) - 0.1;
const y_max = d3.max(significanceData, (d) => d.averageRating) + 0.1;

const y = d3.scaleLinear().domain([y_min, y_max]).range([height, 0]);

svg.append("g").call(d3.axisLeft(y));

const z = d3
  .scaleSqrt()
  .domain([0, d3.max(significanceData, (d) => d.totalReviews)])
  .range([4, 40]);

//creates the bubbles and add them to the svg
svg
  .append("g")
  .selectAll("dot")
  .data(significanceData)
  .enter()
  .append("circle")
  .attr("cx", (d) => x(d.significance) + x.bandwidth() / 2)
  .attr("cy", (d) => y(d.averageRating))
  .attr("r", (d) => z(d.totalReviews))
  .style("fill", "#69b3a2")
  .style("opacity", "0.7")
  .attr("stroke", "black");

const tooltip = d3
  .select("#bubbleCard")
  .append("div")
  .attr("class", "alert-box")
  .style("opacity", 0);

svg
  .selectAll("circle")
  .on("mouseover", function (event, d) {
    tooltip.transition().duration(200).style("opacity", 0.9);
    tooltip
      .html(
        `Significance: ${d.significance}<br/>` +
          `Average Rating: ${d.averageRating.toFixed(2)}<br/>` +
          `Total Reviews: ${d.totalReviews.toFixed(2)}`
      )
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY - 28 + "px");
  })
  .on("mouseout", function () {
    tooltip.transition().duration(500).style("opacity", 0);
  });

tooltip
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("text-align", "center")
  .style("padding", "10px")
  .style("font", "13px sans-serif")
  .style("background", "lightsteelblue")
  .style("border", "0px")
  .style("border-radius", "8px")
  .style("pointer-events", "none");

/* Donut Chart */

// Select the dropdown element for year selection
// const yearSelector = document.getElementById("yearSelector");
const yearSelector = document.createElement("div");
yearSelector.setAttribute('id','yearSelector');
console.log("yearSelector"+yearSelector)
// Populate the dropdown with years as options
years.forEach((year) => {
  let option = document.createElement("option");
  option.value = option.textContent = year;
  yearSelector.appendChild(option); // Append the option to the dropdown
});
// Function to execute the code with updated filteredData
var donutChart= new DonutChart(getPercentageByZone());

function filterByEstablishedYear(min, max) {
  const filteredData = [];
  indiaData.forEach((point, index) => {
    // console.log(`Processing point ${index + 1} with establishment year ${point.establishment_year}`);
    var esb_yr = parseInt(point.establishment_year);
    min = parseInt(min);
    max = parseInt(max);
    if (esb_yr >= min && esb_yr <= max) {
      filteredData.push(point);
    }
  });
  console.log('Filtered Data: ', filteredData); // Log filteredData to see if any data points are present
  return filteredData;
}


function getPercentageByZone(){
  // Get current slider values
  let sliderOneVal = document.getElementById("slider-1").value;
  let sliderTwoVal = document.getElementById("slider-2").value;
  console.log("SLIDER ONE",sliderOneVal,"SLIDER TWO",sliderTwoVal);
  
  // Filter the data based on the updated slider values
  const filteredData = filterByEstablishedYear(sliderOneVal,sliderTwoVal);
  // indiaData.filter(d => d.establishment_year >= sliderOneVal && d.establishment_year <= sliderTwoVal);
  console.log('FILTERED',filteredData);
  // Group the filtered data by zone
  let attractionsByZone = d3.group(filteredData, (d) => d.zone);
  let totalAttractions = filteredData.length;
  let percentageByZone = [];
  
  // Calculate percentage by zone
  attractionsByZone.forEach((attractions, zone) => {
      let attractionCount = attractions.length;
      let percentage = (attractionCount / totalAttractions) * 100;
      percentageByZone.push({
          zone: zone,
          percentage: percentage,
      });
  });
  console.log('PERCENTAGE BY ZONE',percentageByZone);
  return percentageByZone;

}
 
function updateFilteredData() {
  const filtered=getPercentageByZone();
  console.log("to update. filtered: ",filtered);
  // Create a new instance of DonutChart with the updated percentageByZone data
  donutChart.updatePie(filtered);
  // console.log("Attractions percentage by zone: ", percentageByZone);
}

// Add event listeners to the sliders to trigger the updateFilteredData function when their values change
document.getElementById("slider-1").addEventListener("input", updateFilteredData);
document.getElementById("slider-2").addEventListener("input", updateFilteredData);
