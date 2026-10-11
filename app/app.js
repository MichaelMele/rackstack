

export function drawElement(containerId, x, y, width, height,angle,color) {
    const container = document.getElementById(containerId);
    let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", width);
    rect.setAttribute('height', height);
    rect.setAttribute("fill", color);
    rect.setAttribute("transform", `skewY(${angle})`);

    container?.appendChild(rect);
}

export function drawText(containerId, value, x, y, color, fontSize, anchor = 'start') {
    const container = document.getElementById(containerId);
    let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    
    let textNode = document.createTextNode(value);
    text.appendChild(textNode);

    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute('font-size', fontSize)
    text.setAttribute('text-anchor', anchor);
    text.setAttribute("fill", color);
    text.setAttribute('style', 'transform:scaleX(-1) rotate(180deg);');
    

    container.appendChild(text);
    
}