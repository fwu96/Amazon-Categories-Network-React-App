import $ from "jquery";
import * as d3 from "d3";

export function info(clicked, data) {
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
export function restart() {
    $(".links").remove();
    $(".nodes").remove();
    $(".radial").remove();
    $(".bar").remove();
}
export function mouseover() {
    d3.select(this)
        .transition()
        .duration(700)
        .attr("fill", "#AF7AC5");
}
export function mouseout() {
    d3.select(this)
        .transition()
        .duration(700)
        .attr("fill", "#2E86C1");
}
export function drag(simulation) {
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