import React from 'react';
import Network from './Network';
import "./Headline.css";
import "./Filters.css";

const Vis = () => (
    <div className="Vis">
        <div className="headline">
            <h1>Network of Amazon Products Categories</h1>
        </div>
        <div className="filters">
            <h4>Make a Selection of Category: </h4>
            <select>
                <option value="default">-----------default------------</option>
            </select>
        </div>
        <Network/>
    </div>
);
export default Vis;