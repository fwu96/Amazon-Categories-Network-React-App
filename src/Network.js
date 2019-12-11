import React, {Component} from 'react';
import * as d3 from "d3";
import $ from "jquery";
import "./InfoBox.css";
import "./Network.css";
import {netMode, radialMode, barMode} from "./Modes";

class Network extends Component {
    render() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        $("#numChildren").on("change", function() {
            console.log(this.value);
        });
        d3.csv("./all-nodes.csv").then(data => {
            console.log(data);
            $(".disType").on("change", function() {
                let mode = $(this).val();
                $(".dataType").on("change", function() {
                    if ($(this).val() === "subCat") {
                        if (mode === "network") {
                            netMode(data, "numChildren");
                        }
                        if (mode === "radial") {
                            radialMode(data, "numChildren");
                        }
                        if (mode === "bar") {
                            barMode(data, "numChildren");
                        }
                    }
                    if ($(this).val() === "numPro") {
                        if (mode === "network") {
                            netMode(data, "productCount")
                        }
                        if (mode === "radial") {
                            radialMode(data, "productCount")
                        }
                        if (mode === "bar") {
                            barMode(data, "productCount")
                        }
                    }
                });
            });
        });
        return (
            <svg className="Net" width={width} height={height}/>
        )
    }
}

export default Network;