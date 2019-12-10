import {drawNet, drawRadial} from "./Helper";

export function netMode(data) {
    let layer = data.filter(obj => +obj["parent"] === 0);
    let defaultNet = netData(layer, "root");
    const defaultLinks = defaultNet.link.map(d => Object.create(d));
    const defaultNodes = defaultNet.node.map(d => Object.create(d));
    drawNet(defaultNodes, defaultLinks, layer, data, "root");
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
export function radialMode(data) {
    let filteredData = data.filter(obj => +obj["parent"] === 0);
    let defaultData = radialData(filteredData, "root");
    console.log(defaultData);
    drawRadial(defaultData);
}
function radialData(data, rootName) {
    let radSet = [];
    data.forEach(obj => {
        if (obj.name !== rootName) {
            radSet.push({name: obj.name, value: +obj.numChildren});
        }
    });
    return radSet;
}