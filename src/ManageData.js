import {resetCatList, updateCatList} from "./Interaction";

export function netData(layer, rootName, dt) {
    resetCatList();
    let netSet = {
        node:[],
        link:[]
    };
    layer.forEach(obj => {
        netSet.node.push({id: obj.name, group: +obj[dt]});
        if (obj.name !== rootName) {
            netSet.link.push({source: rootName, target: obj.name, value: +obj[dt]});
            updateCatList(obj);
        }
    });
    return netSet;
}
export function radialData(data, rootName, dt) {
    resetCatList();
    let radSet = [];
    data.forEach(obj => {
        if (obj.name !== rootName) {
            radSet.push({name: obj.name, value: +obj[dt]});
            updateCatList(obj);
        }
    });
    return radSet;
}
export function barData(layer, rootName, dt) {
    resetCatList();
    let barSet = [];
    layer.forEach(obj => {
        if (obj.name !== rootName) {
            barSet.push({name: obj.name, value: +obj[dt]});
            updateCatList(obj);
        }
    });
    return barSet;
}