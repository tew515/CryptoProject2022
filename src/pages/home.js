import React from "react";
import DataTable from "../components/DataTable";
import data from "../components/DataTable/data.json";

const roundTo2 = (value) => {
  if (Number(value)) {
    if (value !== Math.floor(value)) {
      return parseFloat(value).toFixed(2);
    }
  }

  return value;
}

const numberSlice = (value) => {
  try {    
    if (!String(value)) {
      value = value.toString();
    }

    let decimalSplit = value.split('.');
    console.log(value, decimalSplit[0] + decimalSplit[1].slice(0, 5));
    return decimalSplit[0] + '.' +  decimalSplit[1].slice(0, 5);
  }
  catch {
    return value;
  }
}

const Home = () => {
  return (
    <>
      <h1>Home</h1>
      <DataTable
        title='The Title'
        tableData={data}
        removedHeadings={["id", "supply", "maxSupply", "marketCapUsd", "volumeUsd24Hr", "vwap24Hr", "explorer"]}
        headingTextOverride={[{key: "changePercent24Hr", text: "Percent Change in 24 Hours"}]}
        tableDataOveride={[{key: "priceUsd", function: numberSlice}, {key: "changePercent24Hr", function: roundTo2}]}
      />
    </>
  );
};

export default Home;
