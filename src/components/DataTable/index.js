import React, { useState  } from "react";
import { Button, ButtonGroup, ButtonToolbar, FormControl, InputGroup } from 'react-bootstrap';
import { useTable, useSortBy } from 'react-table' // https://www.npmjs.com/package/react-table
import { AiOutlineSearch } from 'react-icons/ai';
import './DataTable.css';

// function to search for string in array and return its index if found
const searchStringInArray = (str, strArray) => {
  for (var i=0; i<strArray.length; i++) {
      if (strArray[i].match(str)) return i;
  }
  return -1;
}

// function to convert [camelCase] strings to [Title Case]
const camelCaseToTitleCase = (text) => {
  const result = text.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

// function to convert column names based on array prop of datatable/index.js
const covertColumnNameText = (key, headingTextOverrideArray) => {
  let newColumnNameText = key;
    if (headingTextOverrideArray) {
      if (headingTextOverrideArray.length >=1) {
      headingTextOverrideArray.forEach((headingTextValues) => {
        if (key === headingTextValues.key) {
          newColumnNameText = headingTextValues.text;
        }
      })
    }
  }

  return camelCaseToTitleCase(newColumnNameText);
}

// function to convert column values based on function prop of datatable/index.js
const covertColumnValue = (key, keyValue, tableDataTextOverideFunction) => {
  let newColumnValueText = keyValue;
    if (tableDataTextOverideFunction) {
      if (tableDataTextOverideFunction.length >=1) {
        tableDataTextOverideFunction.forEach((headingTextValues) => {
        if (key === headingTextValues.key) {
          if (headingTextValues.function instanceof Function) {
            newColumnValueText = headingTextValues.function(keyValue);
          }
        }
      })
    }
  }

  return newColumnValueText;
}

const ReactTable = ({ columns, data, rowsShown }) => {
  //  create state variables for row navigation values
  const [rowsOffset, setRowOffset] = useState(0);
  const [rowsEnd, setRowsEnd] = useState(rowsShown);
  
  // create values used for react table 
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data,
      // defaultColumn
    },
    useSortBy, 
  );

  // function to handle table navigation button click events
  const handleTableButtons = (method) => {
    if (method === "+") {
      setRowOffset(rowsOffset + rowsEnd)
      setRowsEnd(rowsEnd + rowsEnd)
    } else if (method === "-") {
      setRowOffset(rowsOffset - rowsShown)
      setRowsEnd(rowsEnd - rowsShown)
    }
  }

  // return the right amount of rows for the table navigation
  const firstPageRows = rows.slice(rowsOffset, rowsEnd);

  return (
    <>
      <table className="datatable" {...getTableProps()}>
        <thead className="datatable-head">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " ⏷"
                        : " ⏶"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="datatable-body" {...getTableBodyProps()}>
          {firstPageRows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {rows.length > rowsShown ?
      <ButtonToolbar aria-label="Toolbar with button groups" className="tableNav">
        <ButtonGroup className="me-2" aria-label="First group">
          {rowsOffset > 0 ? <Button variant="primary" onClick={() => handleTableButtons("-")}>⏴</Button> : <Button variant="primary" onClick={() => handleTableButtons("-")} disabled>⏴</Button>}
          {rowsEnd < rows.length ? <Button variant="primary" onClick={() => handleTableButtons("+")}>⏵</Button> : <Button variant="primary" onClick={() => handleTableButtons("+")} disabled>⏵</Button>}
        </ButtonGroup>
      </ButtonToolbar> : <></>}
    </>
  );
}

const ReactDataTable = ({title='', tableData=[], titleStyle={}, tableStyle={}, tableHeadStyle={}, tableBodyStyle={}, removedHeadings=[], headingTextOverride=[] /* {key, text} */, tableDataOveride=[] /* {key, function} */, rowsShown=20}) => {
  //  create state variables for search input elememt
  const [searchTerm, setSearchTerm] = useState(rowsShown);

  // create table values from prop keys (array of objects)
  let tableHead = [];
  if (tableData.length >=1) {
    Object.keys(tableData[0]).forEach((key) => {
      if (removedHeadings.length >=1) {
        if (searchStringInArray(key, removedHeadings) === -1) {
          tableHead.push({
            Header: covertColumnNameText(key, headingTextOverride),
            accessor: key
          });
        }
      } else {
        tableHead.push({
          Header: covertColumnNameText(key, headingTextOverride),
          accessor: key
        });
      }
    })

    tableData.forEach((ele) => {
      Object.keys(ele).forEach((key) => {
        ele[key] = covertColumnValue(key, ele[key], tableDataOveride);
      })
    })
  }

  let temp2 = [];

  tableData.forEach((ele) => {
    let temp = Object.keys(ele).map((key) => {
      if (ele[key]?.toString()?.toLowerCase()?.includes(searchTerm)) {
        return ele;
      }
    })

    // remove undefined values in array
    temp.forEach((ele) => {
      if (ele) {
        temp2.push(ele)
      }
    })
  })
    
  // remove duplicates in array
  let newTableData = temp2.filter((c, index) => {
    return temp2.indexOf(c) === index;
  });

  return (
    <>
      <InputGroup className="mb-3 searchFilter">
        <InputGroup.Text id="basic-addon1"><AiOutlineSearch/></InputGroup.Text>
        <FormControl
          placeholder="Search..."
          aria-label="Search"
          aria-describedby="basic-addon1"
          onChange={e => setSearchTerm(e.target.value)}
        />
      </InputGroup>
      <ReactTable
        columns={tableHead}
        data={newTableData}
        rowsShown={rowsShown}
      />
    </>
  )
}

export default ReactDataTable;