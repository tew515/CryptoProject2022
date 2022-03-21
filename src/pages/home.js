// import react functions and components
import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";

// import self defined functions and constants
import fetch from "../components/Fetch/Helpers/fetch";
import constants from "../components/Fetch/Helpers/constants";
import { roundTo2, numberSlice } from '../components/Fetch/Helpers/functions';

// recat component to render homepage
const Home = () => {
  // state to store data 
  const [basicAssetData, setBasicAssetData] = useState([]);

  // use effect to fetch data when the component is mounted
  useEffect(() => {
    // fetch data and assign it to state once finished
    fetch(constants.basicAssetDataUrl).then(data => setBasicAssetData(data?.data?.data));
  }, [])

  return (
    <>
      <DataTable
        title='Home'
        tableData={basicAssetData}
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
