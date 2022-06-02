class PyramidChart {

    constructor(data, width = 400, height = 400) {
        this.width = width;
        this.height = height;
        this.data = data;
        this.SVG_NAMESPACE = "http://www.w3.org/2000/svg";
        this.svg = null;
    }

    setAttributes(element, attributes) {
        // Warning - this function is not pure, it mutates the element
        attributes.forEach((value, key) => {
            element.setAttribute(key, value);
        });
    }

    setSelectedIndex (svg, selectedIndex) {
        svg.dataset.selectedIndex = selectedIndex.toString();
    }

    createTextNode (x, y, textValue, dataAttribute, index) {
        const text = document.createElementNS(this.SVG_NAMESPACE, "text");
        this.setAttributes(text, new Map([
            ['x', x],
            ['y', y],
            [dataAttribute, index],
        ]));
        text.appendChild(document.createTextNode(textValue));
        return text;
    }

    generateStyles (data) {
        const labelSelectors = [];
        const tooltipSelectors = [];
        for (let i = 0; i < data.length; i++) {
            labelSelectors.push(`[data-selected-index="${i}"] [data-label="${i}"]`);
            tooltipSelectors.push(`[data-selected-index="${i}"] [data-tooltip="${i}"]`);
        }
        return `${labelSelectors.join(', ')} {
            display: none;
        } 
        ${tooltipSelectors.join(', ')} {
            display: initial;
        }`;
    }

    getPyramidChart() {
        this.svg = document.createElementNS(this.SVG_NAMESPACE, "svg");
        this.setSelectedIndex(this.svg, -1);
        this.setAttributes(this.svg, new Map([
            ['xmlns', this.SVG_NAMESPACE],
            ['viewBox', `0 0 ${this.width} ${this.height}`],
            ['width', this.width],
            ['height', this.height],
        ]));

        const style = document.createElementNS(this.SVG_NAMESPACE, "style");
        this.svg.appendChild(style);
        style.innerHTML =`
            g {
                clip-path: polygon(0% 100%, 50% 0%, 100% 100%, 0% 100%);
            }
            text {
                dominant-baseline: middle;
                text-anchor: middle;
                fill: #000;
            }
            [data-tooltip] { 
                display: none; 
            }
            ${this.generateStyles(this.data)}`;

        const g = document.createElementNS(this.SVG_NAMESPACE, "g");
        this.svg.appendChild(g);
        
        const rectHeightSum = this.data.map(d => d.height).reduce((sum, h) => sum + (h ?? 0), 0);
        let accumulatedHeight = 0;
        this.data.forEach((d, i) => {
            const heightPercent = rectHeightSum > 0 ? d.height / rectHeightSum : 1 / this.data.length;
            const rectHeight = this.height * heightPercent;
            const startY = accumulatedHeight;
            const rectangle = document.createElementNS(this.SVG_NAMESPACE, "rect");
            this.setAttributes(rectangle, new Map([
                ['x', '0'],
                ['y', startY],
                ['width', this.width],
                ['height', rectHeight],
                ['stroke', 'none'],
                ['fill', d.color],
            ]));
            rectangle.onmouseover = () => {
                this.setSelectedIndex(this.svg, i);
            };
            rectangle.onmouseleave = () => {
                this.setSelectedIndex(this.svg, -1);
            };
            accumulatedHeight += rectHeight;
            const text = this.createTextNode(this.width / 2, startY + rectHeight / 2, `${d.percent}%`, 'data-label', i);
            const rate = d.rate ? `(Rate: ${d.rate})` : ''
            const hoverText = this.createTextNode(this.width / 2, startY + rectHeight / 2, `${d.label} ${rate}: ${d.percent}%`, 'data-tooltip', i);
            hoverText.onmouseenter = () => {
                this.setSelectedIndex(this.svg, i);
            };
            hoverText.onmouseleave = () => {
                this.setSelectedIndex(this.svg, -1);
            };
            g.appendChild(rectangle);
            this.svg.appendChild(text);
            this.svg.appendChild(hoverText);
        });
        return this.svg;
    }
}