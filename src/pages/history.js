// import react functions and components
import React, { useEffect, useState } from "react";
import DataGraph from "../components/DataGraph";

// npm packesgs
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

import { format, set, getUnixTime, subDays, subMonths } from 'date-fns';

import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'

import Cookies from 'universal-cookie';

// import self defined functions and constants
import fetch from "../components/Fetch/Helpers/fetch";
import constants from "../components/Fetch/Helpers/constants";

// switch case hours
function getBackendHourValue (hourDiff) {
  if (hourDiff === 1) return 'm5';
  else if (hourDiff >= 2  && hourDiff <= 5) return 'm15';
  else if (hourDiff >= 6 && hourDiff <= 13) return 'm30';
  else if (hourDiff >= 14 && hourDiff <= 24) return 'h1';
  else if (hourDiff >= 25 && hourDiff <= 48) return 'h2';
  else if (hourDiff >= 49 && hourDiff <= 144) return 'h6';
  else if (hourDiff >= 145 && hourDiff <= 288) return 'h12';
  else if (hourDiff >= 289) return 'd1';
  else return 'm1';
}

function returnQueryParams(url, data) {
  let queryParams = Object.keys(data).map(function(key) {
      return [key, data[key]].map(encodeURIComponent).join("=");
  }).join("&");

  if (url) {
    return url + '?' + queryParams;
  } else {
    return queryParams;
  }
}

// recat component to render homepage
const History = () => {
  
 
  const cookies = new Cookies();

  const [historyDateRangePickerValue, setHistoryDateRangePickerValue] = useState([set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }), new Date()]);
  const [historyDropdownValue, setHistoryDropdownValue] = useState([]);
  
  // state to store data 
  const [basicAssetList, setBasicAssetList] = useState([]);
  const [historicalAssetData, setHistoricalAssetData] = useState([]);

  const {
    afterToday
  } = DateRangePicker;

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
    // fetch data and assign it to state once finished
    
    // get hours between dates
    let d1 = new Date(historyDateRangePickerValue[0]);
    let d2 = new Date(historyDateRangePickerValue[1]);
    let diff = d2.getTime() - d1.getTime();
    let hourDiff = Math.ceil(diff / 1000 / 60 / 60);
    let backendHourValue = getBackendHourValue(hourDiff); 
    
    let queryParams = {
      id: historyDropdownValue?.[0]?.value, 
      interval: backendHourValue, 
      start: getUnixTime(d1), 
      end: getUnixTime(d2)
    };

    if (queryParams.id) {
      fetch(returnQueryParams(constants.historicalAssetDataUrl, {queryString: returnQueryParams(undefined, queryParams)})).then(data => {
        // setHistoricalAssetData(data?.data)
        cookies.set('historicalAssetData', data?.data);
      });
    }
  }, [historyDropdownValue, historyDateRangePickerValue])

    // use effect to fetch data when the data is changed
    useEffect(() => {
      console.log(basicAssetList)
      // if (historyDropdownValue !== basicAssetList?.[0]?.value) {
      //   const temp = [...basicAssetList];
      //   temp[0].isDefaultValue = false;
      //   setBasicAssetList(temp);
      // }
    }, [historyDropdownValue])


    if (historyDropdownValue.length === 0) {
      console.log(basicAssetList)
    }

  return (
    <>
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
          onOk={(e) => {
            // change data
          }}
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
              // value: [subDays(new Date(), 6), new Date()]
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
        title='History'
        graphData={cookies.get('historicalAssetData') ? cookies.get('historicalAssetData') : 'cock'}
      />
    </>
  );
};

export default History;
