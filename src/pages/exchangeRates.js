// import react functions and components
import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";

// import self defined functions and vars
import fetch from "../components/Fetch/Helpers/fetch";
import constants from "../components/Fetch/Helpers/constants";
import { roundTo2, kebabCaseToTitleCase } from '../components/Fetch/Helpers/functions';

// recat component to render homepage
const ExchangeRates = () => {
  // state to store data 
  const [usdRatesData, setUsdRatesData] = useState([]);

  // use effect to fetch data when the component is mounted
  useEffect(() => {
    // fetch data and assign it to state once finished
    fetch(constants.usdRatesDataUrl).then(data => setUsdRatesData(data?.data?.data));
  }, [])

  return (
    <>
      <DataTable
        title='USD Exchange Rates'
        tableData={usdRatesData}
        headingTextOverride={[{key: "id", text: "Name"}]}
        tableDataOveride={[{key: "id", function: kebabCaseToTitleCase}, {key: "rateUsd", function: roundTo2}]}
        rowsShown={20}
        idSortedby="type"
        sortType="asc"
      />
    </>
  );
};

export default ExchangeRates;
