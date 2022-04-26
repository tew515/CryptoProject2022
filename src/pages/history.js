// import react functions and components
import React, { useEffect, useState } from "react";
import DataGraph from "../components/DataGraph";

// npm packages
// datetime picker component
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
// dropdown component
import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'
// functions to manage datetime picker ranges
import { format, set, getUnixTime, subDays, subMonths } from 'date-fns';

// import self defined functions and constants
import fetch from "../helpers/fetch";
import constants from "../helpers/constants";

// function to return the optimal datapoint interval in minutes
function getBackendHourValue (hourDiff) {
  let mins = hourDiff * 60;
  // array of intervals used in backend api
  let optionsStr = ['m1', 'm5', 'm15', 'm30', 'h1', 'h2', 'h6', 'h12', 'd1'];
  // above array in minutes
  let optionsInt= [1, 5, 15, 30, 60, 120, 360, 720, 1440];
  // array of possible datapont ints
  let datapointOptions = [];
  optionsInt.forEach((option) => {
    datapointOptions.push((mins / option))
  })

  // the ideal amount of datapoints
  let goal = 60;

  // returns int of datapoint options closest to the goal
  var closest = datapointOptions.reduce(function(prev, curr) {
    return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
  });

  // returns the ideal interval as a string
  return optionsStr[datapointOptions.indexOf(closest)];
}

// function to asssble query parameters
function returnQueryParams(url, data) {
  let queryParams = Object.keys(data).map(function(key) {
      return [key, data[key]].map(encodeURIComponent).join("=");
  }).join("&");

  // if url is defined return full url withh params else just return params
  if (url) {
    return url + '?' + queryParams;
  } else {
    return queryParams;
  }
}

// react component to render homepage
const History = () => {
  // state to store the values of the input elements
  const [historyDateRangePickerValue, setHistoryDateRangePickerValue] = useState([set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }), new Date()]);
  const [historyDropdownValue, setHistoryDropdownValue] = useState([]);
  
  // state to store data from backend
  const [basicAssetList, setBasicAssetList] = useState([]);
  const [historicalAssetData, setHistoricalAssetData] = useState([]);

  // datetimepicker functions
  const {
    afterToday
  } = DateRangePicker;

  // string values used in datetime picker
  const formatString = "yyyy-MM-dd HH:mm";
  const placeholder = format(new Date(historyDateRangePickerValue[0]), formatString) + ' ~ ' + format(new Date(historyDateRangePickerValue[1]), formatString);

  // use effect to fetch data when the component is mounted
  useEffect(() => {
    // fetch data and assign it to state once finished
    fetch(constants.basicAssetListUrl).then(data => {
      if (data?.data) {
        data.data[0].checked = true;
        setHistoryDropdownValue([data.data[0]])
        setBasicAssetList(data.data);
      }
    });
  }, [])

  // use effect to fetch data when the data is changed
  useEffect(() => {    
    // get hours between dates
    let d1 = new Date(historyDateRangePickerValue[0]);
    let d2 = new Date(historyDateRangePickerValue[1]);
    let diff = d2.getTime() - d1.getTime();
    let hourDiff = Math.ceil(diff / 1000 / 60 / 60);
    let backendHourValue = getBackendHourValue(hourDiff); 
    
    // create params object
    let queryParams = {
      id: historyDropdownValue?.[0]?.value, 
      interval: backendHourValue, 
      start: getUnixTime(d1), 
      end: getUnixTime(d2)
    };

    if (queryParams.id) {
      // fetch data and assign it to state once finished
      fetch(returnQueryParams(constants.historicalAssetDataUrl, queryParams)).then(data => setHistoricalAssetData(data?.data));

      setInterval(fetch(returnQueryParams(constants.historicalAssetDataUrl, queryParams)).then(data => setHistoricalAssetData(data?.data)), 3*60*1000);
    }
  }, [historyDropdownValue, historyDateRangePickerValue])

  return (
    <>
      <h2>{historyDropdownValue?.[0]?.label} Price Over Time</h2>
      <div className="input-group">
        <DropdownTreeSelect 
          data={basicAssetList} 
          texts={{ placeholder: 'Select Coin' }}
          mode="radioSelect"
          keepOpenOnSelect='true'
          onChange={(currentNode, selectedNodes) => {
            setHistoryDropdownValue(selectedNodes)
            basicAssetList[0].checked = false;

            basicAssetList.forEach((ele) => {
                if (ele.checked === true) {
                  ele.checked = false;
                }
            });

            basicAssetList.forEach((ele) => {
                if (ele.value === selectedNodes[0].value) {
                  ele.checked = true;
                }
            });
          }}
        />
        <DateRangePicker 
          id="historyDateRangePicker"
          onChange={(e) => setHistoryDateRangePickerValue(e)}
          defaultValue={historyDateRangePickerValue}
          disabledDate={afterToday()} 
          ranges={[
            {
              label: 'Yesterday',
              value: [set(subDays(new Date(), 1), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }), set(subDays(new Date(), 1), { hours: 23, minutes: 59, seconds: 59, milliseconds: 0 })]
            },
            {
              label: 'Today',
              value: [set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }), new Date()]
            },
            {
              label: 'Last 7 days',
              value: [set(subDays(new Date(), 6), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }), new Date()]
            },
            {
              label: 'Last month',
              value: [set(subMonths(new Date(), 1), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }), new Date()]
            }
          ]}
          placeholder={placeholder} 
          format={formatString}
          showOneCalendar
        />
      </div>      
      <DataGraph
        graphData={historicalAssetData ? historicalAssetData.data : []}
      />
    </>
  );
};

export default History;
