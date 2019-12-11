import {drawNet, drawRadial, drawBar} from "./Draws";
import {netData, radialData, barData} from "./ManageData";

export function netMode(data, dt) {
    let layer = data.filter(obj => +obj["parent"] === 0);
    let defaultNet = netData(layer, "root", dt);
    const defaultLinks = defaultNet.link.map(d => Object.create(d));
    const defaultNodes = defaultNet.node.map(d => Object.create(d));
    drawNet(defaultNodes, defaultLinks, layer, data, "root", dt);
}
export function radialMode(data, dt) {
    let layer = data.filter(obj => +obj["parent"] === 0);
    let defaultData = radialData(layer, "root", dt);
    drawRadial(data, defaultData, layer, dt);
}
export function barMode(data, dt) {
    let layer = data.filter(obj => +obj["parent"] === 0);
    const defaultData = barData(layer, "root", dt);
    drawBar(data, defaultData, layer, dt);
}