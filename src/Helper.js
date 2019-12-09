import * as d3 from 'd3';
import $ from "jquery";

export default function drawNet(nodeSet, linkSet, currLayer, data, rootName) {
    const width = window.innerWidth;
    const height = window.innerHeight;
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