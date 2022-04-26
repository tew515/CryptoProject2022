// import react functions and components
import React from "react";

// import npm packages
// area chart component and functions
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// functions to manage datetime picker ranges
import { format } from 'date-fns';

// import self defined css
import './DataGraph.css';

// react comonent to manage tableData and search functionality
const ReactDataGraph = ({ title='', graphData=[] }) => {
  graphData.forEach((ele) => {
    ele.date = format(new Date(ele?.date), "yyyy.MM.dd HH:mm")
  })
  return (
    <>
      {title ? <h2>{title}</h2> : <></>}
      <div className="dataGraphContainer" >
          <ResponsiveContainer>
              <AreaChart data={graphData} style={{ fill: 'rgb(255, 245, 240)' }} margin={{top: 50,right: 30,left: 50,bottom: 50,}}>
                  <defs>
                      <linearGradient id="priceUsd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#968635" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#968635" stopOpacity={0}/>
                      </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3" />
                  <XAxis dataKey="date" style={{ fill: 'rgb(255, 245, 240)' }} label={{ value: 'Datetime', angle: 0, position: 'insideBottom', offset: -25 }} tickLine={{ stroke: 'rgb(255, 245, 240)' }} />
                  <YAxis style={{ fill: 'rgb(255, 245, 240)' }} label={{ value: 'Price USD', angle: -90, position: 'insideLeft', offset: -25 }} tickLine={{ stroke: 'rgb(255, 245, 240)' }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="priceUsd" stroke="#968635" fillOpacity={1} fill="url(#priceUsd)" />
              </AreaChart>
          </ResponsiveContainer>
      </div>
    </>
  )
}

export default ReactDataGraph;