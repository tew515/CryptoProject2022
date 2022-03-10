import { Button, Modal } from "react-bootstrap";
import React, {useState } from "react";
import './Modal.css';

const TableModal = ({title='', tableData=[], titleStyle={}, bodyStyle={}, tableStyle={}, tableHeadStyle={}, tableBodyStyle={}, buttonTitle='Open Table', buttonStyle={}, overflowingTable=false, rotatedButton=false}) => {
  const [show, setShow ] = useState(false);
  console.log(tableData);

  let tableContent = {};
  let headCount = 0;
  tableContent.tableHead = tableData.map(item => <th key={`head-${item.head}-${headCount++}`}>{item.head}</th>);
  tableContent.tableBody = [];
  const lengthArray = tableData.map(item=>item.data.length);
  tableContent.dataLength = Math.max.apply(Math, lengthArray)

  for (let i = 0; i < tableContent.dataLength; i++) {
    let cells = tableData.map((item, index) => <td key={`${item.head}-cell-${index}`}>{item.data[i]}</td>);
    tableContent.tableBody.push(
      <tr key={`row-${i}`}>
        {cells}
      </tr>
    );
  }

  return ( 
      <>
      <Button className={rotatedButton === true ? "rotated" : ""} style={buttonStyle} onClick={()=>setShow(!show)}>{buttonTitle}</Button>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
      <Modal.Body style={overflowingTable ? {height: '90vh'} : {height: 'auto'}}>
          <h2 style={titleStyle} className="title">{title}</h2>
          <hr/>
          <div className='contentDiv' style={bodyStyle}>
            <table className="table table-hover" style={tableStyle}>
              <thead>
                <tr style={tableHeadStyle}>
                  {tableContent.tableHead}
                </tr>
              </thead>
              <tbody style={tableBodyStyle}>
                {tableContent.tableBody}
              </tbody>
            </table>
          </div>
      </Modal.Body>
    </Modal>
    </>
  );
}

export default TableModal;