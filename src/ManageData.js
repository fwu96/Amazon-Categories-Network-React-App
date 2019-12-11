export function netData(layer, rootName, dt) {
    let netSet = {
        node:[],
        link:[]
    };
    layer.forEach(obj => {
        netSet.node.push({id: obj.name, group: +obj[dt]});
        if (obj.name !== rootName) {
            netSet.link.push({source: rootName, target: obj.name, value: +obj[dt]})
        }
    });
    return netSet;
}
export function radialData(data, rootName, dt) {
    let radSet = [];
    data.forEach(obj => {
        if (obj.name !== rootName) {
            radSet.push({name: obj.name, value: +obj[dt]});
        }
    });
    return radSet;
}
export function barData(layer, rootName, dt) {
    let barSet = [];
    layer.forEach(obj => {
        if (obj.name !== rootName) {
            barSet.push({name: obj.name, value: +obj[dt]});
        }
    });
    return barSet;
}