// import react functions and components
import React, { useState, useEffect  } from "react";
import { Button, ButtonGroup, ButtonToolbar, FormControl, InputGroup } from 'react-bootstrap';
import { AiOutlineSearch } from 'react-icons/ai';

// import npm packages
import { useTable, useSortBy } from 'react-table' // https://www.npmjs.com/package/react-table

// import self defined functions and css
import {  searchStringInArray, covertColumnNameText, covertColumnValue } from  '../../components/Fetch/Helpers/functions'
import './DataTable.css';

// react component to define and return table jsx using react-table
const ReactTable = ({ columns, data, rowsShown, idSortedby, sortType }) => {
  //  create state variables for row navigation values
  const [rowsOffset, setRowOffset] = useState(0);
  const [rowsEnd, setRowsEnd] = useState(rowsShown);
  
  // create values used for react table 
  const {
    toggleSortBy,
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
  const handleTableButtons = (method) => {
    if (method === "+") {
      setRowOffset(rowsOffset + rowsShown)
      setRowsEnd(rowsEnd + rowsShown)
    } else if (method === "-") {
      setRowOffset(rowsOffset - rowsShown)
      setRowsEnd(rowsEnd - rowsShown)
    }
  }

  // return the right amount of rows for the table navigation
  const firstPageRows = rows.slice(rowsOffset, rowsEnd);

  // useEffect(() => {
  //   toggleSortBy(idSortedby, true, true)
  // }, [idSortedby, toggleSortBy]);

  // toggleSortBy(idSortedby, true, true)

  // setSortBy([{id: "type", desc: false}]);

  // headerGroups?.[0]?.headers?.forEach((header) => {
  //   console.log(idSortedby, sortType, header.id)
  //   if (idSortedby) {
  //     if (idSortedby === header.id) {
  //       header.toggleSortBy(true, true);
  //       // header.isSorted = true;

  //       // if (sortType.toLowerCase() === "asc") {
  //       //   header.isSortedDesc = false;
  //       // } else if (sortType.toLowerCase() === "desc") {
  //       //   header.isSortedDesc = true;          
  //       // }

  //       console.log(header)
  //     }
  //   }
  // })

  // headerGroups.map((headerGroup) => {
  //   headerGroup.getHeaderGroupProps();
  //   headerGroup.headers.map((column) => {
  //       // column.getHeaderProps(column.getSortByToggleProps());
  //       column.getSortByToggleProps();
  //       column.toggleSortBy(false, false);
  //   })
  // })
  
  return (
    <>
      <div className="dataTableContainer">
        <table className="datatable table table" {...getTableProps()}>
          <thead className="datatableHead">
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
          <tbody className="datatableBody" {...getTableBodyProps()}>
            {firstPageRows.map((row, i) => {
              prepareRow(row);
              return (
                <tr className="tableBodyRow" {...row.getRowProps()}>
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
      </div>
      {rows.length > rowsShown ?
      <ButtonToolbar aria-label="Toolbar with button groups" className="tableNav">
        <ButtonGroup className="me-2" aria-label="First group">
          {rowsOffset > 0 ? <Button variant="warning" className="tableNavButton" onClick={() => handleTableButtons("-")}>⏴</Button> : <Button variant="warning" className="tableNavButton" onClick={() => handleTableButtons("-")} disabled>⏴</Button>}
          {rowsEnd < rows.length ? <Button variant="warning" className="tableNavButton" onClick={() => handleTableButtons("+")}>⏵</Button> : <Button variant="warning" className="tableNavButton" onClick={() => handleTableButtons("+")} disabled>⏵</Button>}
        </ButtonGroup>
      </ButtonToolbar> : <></>}
    </>
  );
}

// react comonent to manage tableData and search functionality
const ReactDataTable = ({ title='', tableData=[], titleStyle={}, tableStyle={}, tableHeadStyle={}, tableBodyStyle={}, removedHeadings=[], headingTextOverride=[] /* {key, text} */, tableDataOveride=[] /* {key, function} */, rowsShown=20, idSortedby, sortType }) => {
  console.log(idSortedby, sortType)
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
        idSortedby={idSortedby}
        sortType={sortType}
      />
    </>
  )
}

export default ReactDataTable;