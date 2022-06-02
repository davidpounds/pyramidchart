const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

const setAttributes = (element, attributes) => {
    // Warning - this function is not pure, it mutates the element
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
};

const createTextNode = (x, y, textValue, className = '') => {
    const text = document.createElementNS(SVG_NAMESPACE, "text");
    setAttributes(text, {
        x,
        y,
        class: className,
    });
    text.appendChild(document.createTextNode(textValue));
    return text;
};

const generatePyramidChart = (container, data, width = 400, height = 400) => {
    const svg = document.createElementNS(SVG_NAMESPACE, "svg");
    setAttributes(svg, {
        xmlns: SVG_NAMESPACE,
        viewBox: `0 0 ${width} ${height}`,
        width: width,
        height: height,
    });
    container.appendChild(svg);
    const defs = document.createElementNS(SVG_NAMESPACE, "defs");
    const clipPathId = "triangle";
    const clipPath = document.createElementNS(SVG_NAMESPACE, "clipPath");
    clipPath.setAttribute("id", clipPathId);
    const path = document.createElementNS(SVG_NAMESPACE, "path");
    path.setAttribute("d", `M0,${height} L${width / 2},0 L${width},${height}Z`);
    defs.appendChild(clipPath);
    clipPath.appendChild(path);

    const style = document.createElementNS(SVG_NAMESPACE, "style");
    svg.appendChild(style);
    style.innerHTML =`
        text {
            dominant-baseline: middle;
            text-anchor: middle;
            fill: #000;
        }
        .tooltip { display: none; }`;

    const g = document.createElementNS(SVG_NAMESPACE, "g");
    g.setAttribute("clip-path", `url(#${clipPathId})`);
    svg.appendChild(g);
    
    const rectHeightSum = data.map(d => d.height).reduce((sum, h) => sum + (h ?? 0), 0);
    let accumulatedHeight = 0;
    data.forEach((d, i) => {
        const heightPercent = rectHeightSum > 0 ? d.height / rectHeightSum : 1 / data.length;
        const rectHeight = height * heightPercent;
        const startY = accumulatedHeight;
        const rectangle = document.createElementNS(SVG_NAMESPACE, "rect");
        setAttributes(rectangle, {
            x: 0,
            y: startY,
            width: width,
            height: rectHeight,
            stroke: 'none',
            fill: d.color,
        });
        rectangle.onmouseenter = function () {
            const labels = svg.querySelectorAll(`.label`);
            const tooltips = svg.querySelectorAll(`.tooltip`);
            labels[i].style.display = 'none';
            tooltips[i].style.display = 'initial';
        };
        rectangle.onmouseout = function () {
            const labels = svg.querySelectorAll(`.label`);
            const tooltips = svg.querySelectorAll(`.tooltip`);
            labels[i].style.display = 'initial';
            tooltips[i].style.display = 'none';
        };
        accumulatedHeight += rectHeight;
        const text = createTextNode(width / 2, startY + rectHeight / 2, `${d.percent}%`, 'label');
        const hoverText = createTextNode(width / 2, startY + rectHeight / 2, `${d.type} ${d.rate ? `(Rate: ${d.rate}) ` : ''}: ${d.percent}%`, 'tooltip');
        g.appendChild(rectangle);
        svg.appendChild(text);
        svg.appendChild(hoverText);
    });
    svg.appendChild(defs);
};
