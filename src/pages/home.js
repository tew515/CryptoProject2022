// import react functions and components
import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";

// import self defined functions and constants
import fetch from "../Helpers/fetch";
import constants from "../Helpers/constants";
import { roundTo2, numberSlice } from '../Helpers/functions';

// recat component to render homepage
const Home = () => {
  // state to store data 
  const [basicAssetData, setBasicAssetData] = useState([]);

  // use effect to fetch data when the component is mounted
  useEffect(() => {
    // fetch data and assign it to state once finished
    fetch(constants.basicAssetDataUrl).then(data => setBasicAssetData(data?.data?.data));
    
    setInterval(fetch(constants.basicAssetDataUrl).then(data => setBasicAssetData(data?.data?.data)), 3*60*1000);
  }, [])
  
  return (
    <>
      <DataTable
        title='All Live Cryptocurrencies'
        tableData={basicAssetData}
        removedHeadings={["id", "explorer"]}
        headingTextOverride={[{key: "changePercent24Hr", text: "Percent Change in 24 Hours"}]}
        tableDataOveride={[{key: "priceUsd", function: numberSlice}, {key: "changePercent24Hr", function: roundTo2}, {key: "supply", function: numberSlice}, {key: "maxSupply", function: numberSlice}, {key: "marketCapUsd", function: numberSlice}, {key: "volumeUsd24Hr", function: numberSlice},]}
        rowsShown={20}
      />
    </>
  );
};

export default Home;