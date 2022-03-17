import React from "react";
import DataTable from "../components/DataTable";
import data from "../components/DataTable/data.json";

// function to round decmimal values to 2 places
const roundTo2 = (value) => {
  if (Number(value)) {
    if (value !== Math.floor(value)) {
      return parseFloat(value).toFixed(2);
    }
  }

  return value;
}

// function to cut off a decimal value after 5 places
const numberSlice = (value) => {
  try {    
    if (!String(value)) {
      value = value.toString();
    }

    let decimalSplit = value.split('.');
    return decimalSplit[0] + '.' +  decimalSplit[1].slice(0, 5);
  }
  catch {
    return value;
  }
}

const Home = () => {
  return (
    <>
      <DataTable
        title='Home'
        tableData={data}
        // removedHeadings={["id", "supply", "maxSupply", "marketCapUsd", "volumeUsd24Hr", "vwap24Hr", "explorer"]}
        // "supply", "maxSupply", "marketCapUsd", "volumeUsd24Hr" "vwap24Hr"
        removedHeadings={["id", "explorer"]}
        headingTextOverride={[{key: "changePercent24Hr", text: "Percent Change in 24 Hours"}]}
        tableDataOveride={[{key: "priceUsd", function: numberSlice}, {key: "changePercent24Hr", function: roundTo2}, {key: "supply", function: numberSlice}, {key: "maxSupply", function: numberSlice}, {key: "marketCapUsd", function: numberSlice}, {key: "volumeUsd24Hr", function: numberSlice},]}
        rowsShown={20}
      />
    </>
  );
};

export default Home;
