
'use strict';
import Map from "./Map.js";
export default class indiaMain {
    static async loadData() {
        try {
            let csvData = await d3.csv('./data/Top Indian Places to Visit.csv');

            let pointsData = csvData.map(d => [+d.latitude, +d.longitude, d.name, d.city, +d.entrance_fee, +d.rating, d.significance, d.airport_with_50km_radius, d.DSLR_allowed]);
            console.log(pointsData)

            let geojsonData = await d3.json('./data/india_map.json');
            let map = new Map('#map', 1020, 870);

            // Render base map
            map.baseMap(geojsonData, d3.geoCylindricalStereographic);

            // Render points
            map.renderPoints(pointsData);

            
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }
}

