import React from "react";
import { useTable, useSortBy } from 'react-table'
import './DataTable.css';
// https://www.npmjs.com/package/react-table

const searchStringInArray = (str, strArray) => {
  for (var i=0; i<strArray.length; i++) {
      if (strArray[i].match(str)) return i;
  }
  return -1;
}

const camelCaseToTitleCase = (text) => {
  const result = text.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

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

const ReactTable = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data
    },
    useSortBy
  );

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows.slice(0, 2);

  return (
    <>
      <table {...getTableProps()}>
        <thead>
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
                        // ? " 🔽"
                        // : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
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
      <br />
      <div>Showing the first 20 results of {rows.length} rows</div>
    </>
  );
}

const ReactDataTable = ({title='', tableData=[], titleStyle={}, tableStyle={}, tableHeadStyle={}, tableBodyStyle={}, removedHeadings=[], headingTextOverride=[] /* {key, text} */, tableDataOveride=[] /* {key, function} */}) => {
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


  return (
    <>
      <ReactTable
        columns={tableHead}
        data={tableData}
      />
    </>
  )
}

// const DataTable = ({title='', tableData=[], titleStyle={}, tableStyle={}, tableHeadStyle={}, tableBodyStyle={}, removedHeadings=[]}) => {
//   let tableHead = [];
//   let tableHead = null;
//   let tableBody = [];

//   if (tableData.length >=1) {
//     Object.keys(tableData[0]).forEach((key) => {
//       if (removedHeadings.length >=1) {
//         if (searchStringInArray(key, removedHeadings) === -1) {
//           tableHead.push(key);
//         }
//       } else {
//         tableHead.push(key);
//       }
//     })

//     let headCount = 0;
//     tableHead = tableHead.map(value => <th key={`head-${value}-${headCount++}`}>{value}</th>);

//     tableData.forEach((tableRow, index) => {
//       let cells = tableHead.map((value) => {
//         return(<td key={`${index}-cell-${value}`}>{tableRow[value]}</td>)
//       });
//       tableBody.push(      
//       <tr key={`row-${index}`}>
//         {cells}
//       </tr>);
//     })
//   }

//   return ( 
//       <>
//         {title !== '' ? <h2 style={titleStyle} className="title">{title}</h2> : <></>}
//         <div className='contentDiv'>
//           <table className="table table-hover" style={tableStyle}>
//             <thead>
//               <tr style={tableHeadStyle}>
//                 {tableHead}
//               </tr>
//             </thead>
//             <tbody style={tableBodyStyle}>
//               {tableBody}
//             </tbody>
//           </table>
//         </div>
//     </>
//   );
// }

export default ReactDataTable;