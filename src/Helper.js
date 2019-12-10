import * as d3 from 'd3';
import $ from "jquery";

const width = window.innerWidth;
const height = window.innerHeight;

export function drawNet(nodeSet, linkSet, currLayer, data, rootName) {
    let simulation = d3.forceSimulation(nodeSet)
        .force("link", d3.forceLink(linkSet).id(d => d.id).strength(0))
        .force("link", d3.forceLink(linkSet).distance(d => d.value * 2))
        .force("charge", d3.forceManyBody().strength(-200))
        .force("center", d3.forceCenter(width / 2, height / 2));
    let svg = d3.select("svg")
        .attr("viewBox", [0, 0, width, height]);
    let link = svg.append("g")
        .classed("links", true)
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(linkSet)
        .join("line")
        .attr("stroke-width", 1.5);
    let node = svg.append("g")
        .classed("nodes", true)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodeSet)
        .join("circle")
        .attr("r", d => {
            if (d.id === rootName) {
                return 5;
            }
            if (d.group === 0) {
                return 3;
            } else {
                return Math.sqrt(d.group) * 4;
            }
        })
        .attr("fill", "#2E86C1")
        .on("mouseover", mouseover)
        .on("click", function() {
            $(".infoBox").remove();
            d3.select(this)
                .classed("clicked", !d3.select(this).classed("clicked"));
            let clickedData = currLayer.filter(obj => obj.name === d3.select(this).select("title").text());
            info(d3.select(this).classed("clicked"), clickedData[0]);
            let layer = data.filter(obj => obj["parent"] === clickedData[0]["id"] || obj["name"] === clickedData[0]["name"]);
            console.log(layer);
            let subTreeSet = netData(layer, clickedData[0]["name"]);
            console.log(subTreeSet);
            let nodeSet = subTreeSet.node.map(d => Object.create(d)),
                linkSet = subTreeSet.link.map(d => Object.create(d));
            $(".links").remove();
            $(".nodes").remove();
            console.log("removed, ready to draw");
            drawNet(nodeSet, linkSet, layer, data, clickedData[0]["name"]);
        })
        .on("mouseout", mouseout)
        .call(drag(simulation));
    node.append("title")
        .text(d => d.id);
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });
}
function info(clicked, data) {
    if (clicked) {
        $("#root").append(
            "<div class='infoBox'>" +
            "<h2>Category Information</h2>" +
            "<text>Category Name: " + data.name + "</text>" +
            "<text>Category id: " + data.id + "</text>" +
            "<text>Number of Products: " + data.productCount + "</text>" +
            "<text>Number of Subtrees: " + data.numChildren + "</text>" +
            "<text>Number of Products in Subtree: " + data.subtreeProductCount + "</text>" +
            "</div>");
    } else {
        $(".infoBox").remove();
    }
}
function netData(layer, rootName) {
    let netSet = {
        node:[],
        link:[]
    };
    layer.forEach(obj => {
        netSet.node.push({id: obj.name, group: +obj["numChildren"]});
        if (obj.name !== rootName) {
            netSet.link.push({source: rootName, target: obj.name, value: +obj["numChildren"]})
        }
    });
    return netSet;
}
function drag(simulation) {
    function dragStart(d) {
        if (!d3.event.active) {
            simulation.alphaTarget(0.3).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
    }
    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
    function dragEnd(d) {
        if (!d3.event.active) {
            simulation.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
    }
    return d3.drag()
        .on("start", dragStart)
        .on("drag", dragged)
        .on("end", dragEnd);
}
export function drawRadial(originalData, data, currLayer) {
    let barHeight = height / 2 - 40;
    let color = d3.scaleOrdinal()
        .range(["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]);
    let svg = d3.select("svg")
        .attr("viewBox", [0, 0, width, height])
        .append("g")
        .classed("radial", true)
        .attr("transform", "translate(" + width / 2 + ", " + height / 2 + ")");
    data.sort((a, b) => b.value - a.value);
    let extent = d3.extent(data, d => d.value);
    let barScale = d3.scaleLinear()
        .domain(extent)
        .range([0, barHeight]);
    let keys = data.map(d => d.name);
    let numBars = keys.length;
    let x = d3.scaleLinear()
        .domain(extent)
        .range([0, -barHeight]);
    let xAxis = d3.axisLeft()
        .scale(x)
        .ticks(7);
    svg.selectAll("circle")
        .data(x.ticks(7))
        .enter()
        .append("circle")
        .attr("r", d => barScale(d))
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-dasharray", "2.2")
        .style("stroke-width", ".5px");
    let arc = d3.arc()
        .startAngle((d, i) => (i * 2 * Math.PI) / numBars)
        .endAngle((d, i) => ((i + 1) * 2 * Math.PI) / numBars)
        .innerRadius(0);
    let segments = svg.selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .each(d => d.outerRadius = 0)
        .attr("fill", d => color(d.name))
        .attr("d", arc)
        .on("mouseover", mouseover)
        .on("click", function() {
            $(".infoBox").remove();
            d3.select(this)
                .classed("clicked", !d3.select(this).classed("clicked"));
            let clickedData = currLayer.filter(obj => obj.name === d3.select(this).select("title").text());
            info(d3.select(this).classed("clicked"), clickedData[0]);
            let layer = originalData.filter(obj => obj["parent"] === clickedData[0]["id"] || obj["name"] === clickedData[0]["name"]);
            let subTreeSet = radialData(layer, clickedData[0]["name"]);
            $(".radial").remove();
            drawRadial(originalData, subTreeSet, layer);
        })
        .on("mouseout", mouseout);
    segments.transition()
        .ease(d3.easeElastic)
        .duration(1000)
        .delay((d, i) => (25 - i) * 100)
        .attrTween("d", (d, idx) => {
            let i = d3.interpolate(d.outerRadius, barScale(+d.value));
            return t => {
                d.outerRadius = i(t);
                return arc(d, idx);
            };
        });
    svg.append("circle")
        .attr("r", barHeight)
        .classed("outer", true)
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", "1.5px");
    svg.selectAll("line")
        .data(keys)
        .enter()
        .append("line")
        .attr("y2", -barHeight)
        .style("stroke", "black")
        .style("stroke-width", ".5px")
        .attr("transform", (d, i) => "rotate(" + (i * 360 / numBars) + ")");
    svg.append("g")
        .classed("xAxis", true)
        .call(xAxis);
    segments.append("title")
        .text(d => d.name);
}
function radialData(data, rootName) {
    let radSet = [];
    data.forEach(obj => {
        if (obj.name !== rootName) {
            radSet.push({name: obj.name, value: +obj["numChildren"]});
        }
    });
    return radSet;
}

function mouseover() {
    d3.select(this)
        .transition()
        .duration(700)
        .attr("fill", "#AF7AC5");
}
function mouseout() {
    d3.select(this)
        .transition()
        .duration(700)
        .attr("fill", "#2E86C1");
}