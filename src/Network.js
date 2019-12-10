import React, {Component} from 'react';
import * as d3 from "d3";
import $ from "jquery";
import "./InfoBox.css";
import "./Network.css";
import {netMode, radialMode} from "./Draws";

class Network extends Component {
    render() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        $("#numChildren").on("change", function() {
            console.log(this.value);
        });
        d3.csv("./all-nodes.csv").then(data => {
            console.log(data);
            radialMode(data);
            //netMode(data);
        });
        return (
            <svg className="Net" width={width} height={height}/>
        )
    }
}

export default Network;