# pyramid-chart
A JavaScript-driven SVG pyramid chart.

First include the `src/pyramid-chart.js` file before the chart initialisation code. This gives you access to the `PyramidChart` class.

The `PyramidChart` class is constructed like this: `new PyramidChart(data, width, height)` where:

* `data [object[], required]` is an array of properties for each slice containing the following properties:
    * `color [string, required]` - This sets the colour of the slice. Any valid SVG colour can be used (e.g. hex, rgb, named colours etc)
    * `label [string, required]` - This is the text that will be displayed on hover for the slice.
    * `rate [string, optional]` - If provided, this will be displayed after the label on hover for the slice.
    * `percent [number, required]` - This is displayed by default on the slice, and also appears after the label and rate on hover for the slice.
    * `height [number, optional]` - If provided, this is a fractional heigt for the slice. The height of each slice is the percentage of the current slice's height compared to the sum of the height of all slices. If you provide this value for at least one slice you should provide it for all slices.
* `width [number, optional]` - The width of the chart in pixels. If ommited, the default value of 400 will be used.
* `height [number, optional]` - The height of the chart in pixels. If ommited, the default value of 400 will be used.

The `PyramidChart` instance has a method named `getPyramidChart()` that will return an SVG element for the chart.

E.g. `const svg = (new PyramidChart(data, width, height)).getPyramidChart();` 

The `svg` variable will contain an SVG element that can be added to a container element using the element's `appendChild()` method:

`document.querySelector('#chart-container').appendChild(svg);` where the chart's containing element has an ID of `chart-container`.