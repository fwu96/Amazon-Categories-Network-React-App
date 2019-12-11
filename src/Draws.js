import * as d3 from 'd3';
import $ from "jquery";
import {netData, radialData, barData} from "./ManageData";
import {info, restart, mouseout, mouseover, drag} from "./Interaction";

const width = window.innerWidth;
const height = window.innerHeight;

export function drawNet(nodeSet, linkSet, currLayer, data, rootName, dt) {
    restart();
    let simulation = d3.forceSimulation(nodeSet)
        .force("link", d3.forceLink(linkSet).id(d => d.id).strength(0))
        .force("link", d3.forceLink(linkSet).distance(d => {
            let r = String(d.value);
            if (d.value >= 1000) {
                r = String(d.value).substring(0, 3);
            }
            return parseInt(r) / 1.1;
        }))
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
                let r = String(d.group);
                if (d.group >= 1000) {
                    r = String(d.group).substring(0, 3);
                }
                return Math.sqrt(parseInt(r)) * 4;
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
            let subTreeSet = netData(layer, clickedData[0]["name"], dt);
            let nodeSet = subTreeSet.node.map(d => Object.create(d)),
                linkSet = subTreeSet.link.map(d => Object.create(d));
            $(".links").remove();
            $(".nodes").remove();
            drawNet(nodeSet, linkSet, layer, data, clickedData[0]["name"], dt);
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
    $(".categories").on("change", function() {
        $(".infoBox").remove();
        let root = $(this).val();
        $(this).append(`<option value=${root}>${root}</option>`);
        let chosen = data.filter(obj => obj.name === root);
        if (chosen.length !== 0) {
            info(true, chosen[0]);
            let layer = data.filter(obj => obj["parent"] === chosen[0]["id"] || obj["name"] === chosen[0]["name"]);
            let subTreeSet = netData(layer, chosen[0]["name"], dt);
            let nodeSet = subTreeSet.node.map(d => Object.create(d));
            let linkSet = subTreeSet.link.map(d => Object.create(d));
            drawNet(nodeSet, linkSet, layer, data, chosen[0]["name"], dt);
        } else {
            let layer = data.filter(obj => +obj["parent"] === 0);
            let defaultNet = netData(layer, "root", dt);
            let defaultLinks = defaultNet.link.map(d => Object.create(d));
            let defaultNodes = defaultNet.node.map(d => Object.create(d));
            drawNet(defaultNodes, defaultLinks, layer, data, "root", dt);
        }

    });
}
export function drawRadial(originalData, data, currLayer, dt) {
    restart();
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
            let subTreeSet = radialData(layer, clickedData[0]["name"], dt);
            drawRadial(originalData, subTreeSet, layer, dt);
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
    $(".categories").on("change", function() {
        $(".infoBox").remove();
        let root = $(this).val();
        $(this).append(`<option value=${root}>${root}</option>`);
        let chosen = originalData.filter(obj => obj.name === root);
        if (chosen.length !== 0) {
            info(true, chosen[0]);
            let layer = originalData.filter(obj => obj["parent"] === chosen[0]["id"] || obj["name"] === chosen[0]["name"]);
            let subTreeSet = radialData(layer, chosen[0]["name"], dt);
            drawRadial(originalData, subTreeSet, layer, dt);
        } else {
            let layer = originalData.filter(obj => +obj["parent"] === 0);
            let defaultData = radialData(layer, "root", dt);
            drawRadial(originalData, defaultData, layer, dt);
        }

    });
}
export function drawBar(originalData, data, currLayer, dt) {
    restart();
    let barHeight = height / 2;
    let xWidth = width;
    let svg = d3.select("svg")
        .attr("viewBox", [0, 0, width, height])
        .append("g")
        .classed("bar", true)
        .attr("transform", "translate(" + 200 + ", " + height / 2 + "), scale(0.8)");
    let extent = d3.extent(data, d => d.value);
    let xScale = d3.scaleBand()
        .domain(data.map(obj => obj.name))
        .rangeRound([0, xWidth]);
    let yScale = d3.scaleLinear()
        .domain(extent)
        .range([barHeight, -10]);
    svg.append("g")
        .attr("transform", "translate(0, " + barHeight + ")")
        .classed("xAxis", true)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "translate(-20, 20) rotate(-45)");
    svg.append("g")
        .classed("yAxis", true)
        .call(d3.axisLeft(yScale));
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.name))
        .attr("y", yScale(0))
        .attr("height", 0)
        .attr("width", xScale.bandwidth())
        .attr("fill", "#2E86C1")
        .on("mouseover", mouseover)
        .on("click", function() {
            $(".infoBox").remove();
            d3.select(this)
                .classed("clicked", !d3.select(this).classed("clicked"));
            let clickedData = currLayer.filter(obj => obj.name === d3.select(this).select("title").text());
            info(d3.select(this).classed("clicked"), clickedData[0]);
            let layer = originalData.filter(obj => obj["parent"] === clickedData[0]["id"] || obj["name"] === clickedData[0]["name"]);
            let subTreeSet = barData(layer, clickedData[0]["name"], dt);
            drawBar(originalData, subTreeSet, layer, dt);
        })
        .on("mouseout", mouseout);
    svg.selectAll("rect")
        .transition()
        .duration(800)
        .attr("y", d => yScale(d.value))
        .attr("height", d => yScale(0) - yScale(d.value))
        .delay((d, i) => i * 100);
    svg.selectAll("rect")
        .append("title")
        .text(d => d.name);
    $(".categories").on("change", function() {
        $(".infoBox").remove();
        let root = $(this).val();
        $(this).append(`<option value=${root}>${root}</option>`);
        let chosen = originalData.filter(obj => obj.name === root);
        if (chosen.length === 0) {
            let layer = originalData.filter(obj => +obj["parent"] === 0);
            let defaultData = barData(layer, "root", dt);
            drawBar(originalData, defaultData, layer, dt);
        } else {
            info(true, chosen[0]);
            let layer = originalData.filter(obj => obj["parent"] === chosen[0]["id"] || obj["name"] === chosen[0]["name"]);
            let subTreeSet = barData(layer, chosen[0]["name"], dt);
            drawBar(originalData, subTreeSet, layer, dt);
        }

    });
}