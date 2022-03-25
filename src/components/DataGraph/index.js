// import react functions and components
import React, { useState, useEffect  } from "react";

// import npm packages
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Label, ResponsiveContainer } from 'recharts'; // https://www.npmjs.com/package/react-table

// import self defined functions and css
import {  searchStringInArray, covertColumnNameText, covertColumnValue } from  '../../components/Fetch/Helpers/functions'
import './DataGraph.css';

import data from './data.json';

// react comonent to manage tableData and search functionality
const ReactDataGraph = ({ title='', graphData, titleStyle={}, removedHeadings=[], headingTextOverride=[] /* {key, text} */, tableDataOveride=[] /* {key, function} */, rowsShown=20, idSortedby, sortType }) => {
  return (
    <div className="dataGraphContainer" >
        <ResponsiveContainer>
            <AreaChart data={graphData} margin={{top: 50,right: 30,left: 50,bottom: 50,}}>
                <defs>
                    <linearGradient id="priceUsd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#968635" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#968635" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3" />
                <XAxis dataKey="date" label={{ value: 'Date', angle: 0, position: 'insideBottom', offset: -25 }}/>
                <YAxis label={{ value: 'Price Usd', angle: -90, position: 'insideLeft', offset: -25 }}/>
                <Tooltip />
                {/* {/* <Area type="monotone" dataKey="priceUsd" stroke="#8884d8" fill="#8884d8"/>  */}
                <Area type="monotone" dataKey="priceUsd" stroke="#968635" fillOpacity={1} fill="url(#priceUsd)" />
            </AreaChart>
        </ResponsiveContainer>
    </div>
  )
}

export default ReactDataGraph;