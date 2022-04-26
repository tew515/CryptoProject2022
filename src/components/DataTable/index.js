// import react functions and components
import React, { useState, useEffect } from "react";

// import npm packages
// button and input components 
import { Button, ButtonGroup, ButtonToolbar, FormControl, InputGroup } from 'react-bootstrap';
// icon components
import { AiOutlineSearch } from 'react-icons/ai';

// table component and functions
import { useTable, useSortBy } from 'react-table';

// import self defined functions and css
import { searchStringInArray, covertColumnNameText, covertColumnValue } from  '../../helpers/functions'
import './DataTable.css';

let searchChange = true;

// react component to define and return table jsx using react-table
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
    },
    useSortBy, 
  );

  // function to handle table navigation button click events
  const handleTableButtons = (method, multiplier) => {
    if (method === "+") {
      if (rows.length > rowsOffset + (rowsShown * multiplier)) {
        setRowOffset(rowsOffset + (rowsShown * multiplier))
        setRowsEnd(rowsEnd + (rowsShown * multiplier))        
      } else {
        setRowOffset(rows.length - rowsShown)
        setRowsEnd(rows.length)
      }
    } else if (method === "-") {
      if (rowsOffset - (rowsShown * multiplier) > 0) {
        setRowOffset(rowsOffset - (rowsShown * multiplier))
        setRowsEnd(rowsEnd - (rowsShown * multiplier))
      } else {        
        setRowOffset(0)
        setRowsEnd(rowsShown)
      }
    }
  }

  // useEffect to return table rows to initial state when typing a search
  useEffect(() => {
    setRowOffset(0)
    setRowsEnd(rowsShown)
  }, [searchChange, rowsShown]);

  // return the right amount of rows for the table navigation
  const firstPageRows = rows.slice(rowsOffset, rowsEnd);
  
  return (
    <>
      <div className="dataTableContainer">
        <table className="datatable table table" {...getTableProps()}>
          <thead className="datatableHead">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
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
          <tbody className="datatableBody" {...getTableBodyProps()}>
            {firstPageRows.map((row, i) => {
              prepareRow(row);
              return (
                <tr className="tableBodyRow" {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps([
                        {
                          className: cell.column.id === 'changePercent24Hr' ? cell.row.original?.changePercent24Hr > 0 ? 'cellPositive' : 'cellNegative' : ''
                        }
                      ])}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {rows.length > rowsShown ?
      <ButtonToolbar aria-label="Toolbar with button groups" className="tableNav">
        <ButtonGroup className="me-2" aria-label="First group">
          {<Button variant="warning" className="tableNavButton" onClick={() => {
              setRowOffset(0)
              setRowsEnd(rowsShown)
          }} disabled={rowsOffset === 0}>⏴⏴⏴</Button>}
          {<Button variant="warning" className="tableNavButton" onClick={() => handleTableButtons("-", 5)} disabled={rowsOffset === 0}>⏴⏴</Button>}
          {<Button variant="warning" className="tableNavButton" onClick={() => handleTableButtons("-", 1)} disabled={rowsOffset === 0}>⏴</Button>}
          {<Button variant="warning" className="tableNavButton" onClick={() => handleTableButtons("+", 1)} disabled={rowsOffset === rows.length - rowsShown}>⏵</Button>}
          {<Button variant="warning" className="tableNavButton" onClick={() => handleTableButtons("+", 5)} disabled={rowsOffset === rows.length - rowsShown}>⏵⏵</Button>}
          {<Button variant="warning" className="tableNavButton" onClick={() => {
              setRowOffset(rows.length - rowsShown)
              setRowsEnd(rows.length)
          }} disabled={rowsOffset === rows.length - rowsShown}>⏵⏵⏵</Button>}
        </ButtonGroup>
      </ButtonToolbar> : <></>}
    </>
  );
}

// react comonent to manage tableData and search functionality
const ReactDataTable = ({ title='', tableData=[], removedHeadings=[], headingTextOverride=[] /* {key, text} */, tableDataOveride=[] /* {key, function} */, rowsShown=20 }) => {
  //  create state variables for search input elememt
  const [searchTerm, setSearchTerm] = useState('');  

  // temporary array to store values with duplicates to be removed after foreach loop
  let duplicateTableData = [];

  let tableHead = [];
  // if the tableData array is not empty
  if (tableData.length >=1) {
    // create table values from prop tableData keys (array of objects)
    Object.keys(tableData[0]).forEach((key) => {
      // if the removedHeadings array is not empty
      if (removedHeadings.length >=1) {
        // if the string has not been added to the removedHeadings array add it to the array that renders the table headings
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
      // temporary array that contains undefined variables as returned from map function
      let undefinedTableData = Object.keys(ele).map((key) => {
        // returns desired value if there is the prop to override original table values 
        ele[key] = covertColumnValue(key, ele[key], tableDataOveride);

        // search all keys in all array indexes to return filtered data
        if (ele[key]?.toString()?.toLowerCase()?.includes(searchTerm)) {
          return ele;
        }
      })

      // remove undefined values in array
      undefinedTableData.forEach((ele) => {
        if (ele) {
          duplicateTableData.push(ele)
        }
      })
    })
  }
    
  // remove duplicates in array
  let newTableData = duplicateTableData.filter((c, index) => {
    return duplicateTableData.indexOf(c) === index;
  });
  

  return (
    <>
      {title ? <h2>{title}</h2> : <></>}
      <InputGroup className="mb-3 searchFilter">
        <InputGroup.Text id="basic-addon1"><AiOutlineSearch/></InputGroup.Text>
        <FormControl
          placeholder="Search..."
          aria-label="Search"
          aria-describedby="basic-addon1"
          onChange={e => {
            setSearchTerm(e.target.value)
            searchChange=!searchChange;
          }}
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