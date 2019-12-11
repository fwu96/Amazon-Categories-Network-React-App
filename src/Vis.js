import React from 'react';
import Network from './Network';
import "./Headline.css";
import "./Filters.css"
import "./bootstrap.css";

const Vis = () => (
    <div className="Vis">
        <div className="headline">
            <h1>Network of Amazon Products Categories</h1>
        </div>
        <div className="filters">
            <h5>Make a Selection of Category: </h5>
            <select className="custom-select">
                <option value="default">Choose a category</option>
            </select>
            <br/>
            <h5>Make a Selection of Display Type: </h5>
            <select className="custom-select-sm disType">
                <option value="default">Choose a display</option>
                <option value="network">Network Graph</option>
                <option value="radial">Radial Chart</option>
                <option value="bar">Bar Chart</option>
            </select>
            <br/>
            <h5>Make a Selection of Data Type: </h5>
            <select className="custom-select-sm dataType">
                <option value="default">Choose a type</option>
                <option value="subCat">Number of Sub-Categories</option>
                <option value="numPro">Number of Products</option>
            </select>
        </div>
        <Network/>
    </div>
);
export default Vis;