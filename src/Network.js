import React, {Component} from 'react';
import * as d3 from "d3";
import "./InfoBox.css";
import "./Network.css";
import drawNet from "./Helper";

class Network extends Component {
    render() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        d3.csv("./all-nodes.csv").then(data => {
            console.log(data);
            let firstLayer = data.filter(obj => +obj["parent"] === 0);
            console.log(firstLayer);
            let defaultNet = netData(firstLayer, "root");
            console.log(defaultNet);
            const defaultLinks = defaultNet.link.map(d => Object.create(d));
            const defaultNodes = defaultNet.node.map(d => Object.create(d));
            drawNet(defaultNodes, defaultLinks, firstLayer, data, "root");
        });
        return (
            <svg className="Net" width={width} height={height}/>
        )
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
export default Network;