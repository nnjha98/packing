import "./App.css";
import { useState } from "react";
import Papa from "papaparse";
import $ from 'jquery'; 

function App() {
  // State to store parsed data
  const [parsedData, setParsedData] = useState([]);

  //State to store table Column name
  const [tableRows, setTableRows] = useState([]);

  //State to store the values
  const [values, setValues] = useState([]);
  const [sbox, setSbox] = useState([]);

  const changeHandler = (event) => {
    var bbox = require('./bbox.json');
    console.log("bbox: ", bbox)
    var sbox = require('./sbox.json');
    setSbox(sbox)
    console.log("sbox: ", sbox)
    // $.getJSON("./test.json", function(json) {
    //   console.log("json ",json); // this will show the info it in firebug console
    // });
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    // console.log("files: ",event.target.files[0]);
    // this.Files = event.file;
    // var file = new File([event.blob],"cBox.json", {type: "text/csv"});
    // console.log(file)
    // Papa.parse(file, {
    //   header: true,
    //   skipEmptyLines: true,
    //   complete: function (results) {
    //     const rowsArray = [];
    //     const valuesArray = [];

    //     // Iterating data to get column name and their values
    //     results.data.map((d) => {
    //       rowsArray.push(Object.keys(d));
    //       valuesArray.push(Object.values(d));
    //       console.log(Object.keys(d)[0])
    //     });

    //     // Parsed Data Response in array format
    //     // setParsedData(results.data);

    //     // // Filtered Column Names
    //     // setTableRows(rowsArray[0]);

    //     // // Filtered Values
    //     // setValues(valuesArray);
    //   },
    // });
  };

  return (
    <div>
      {/* File Uploader */}
      <button onClick={changeHandler}>Load Boxes</button>
      <br />
      <br />
      {sbox.map((box,index)=>{
        return <div key={index}><p>{box['BoxCode']} ({box['W']} , {box['D']} , {box['H']}) <input value={box['count']} onInput={e=>{sbox[index]['count']=e.target.value;setSbox(sbox)}}></input></p></div>
      })}
      <button onClick={changeHandler}>Try and pack</button>
      {/* Table */}
      {/* <table>
        <thead>
          <tr>
            {tableRows.map((rows, index) => {
              return <th key={index}>{rows}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {values.map((value, index) => {
            return (
              <tr key={index}>
                {value.map((val, i) => {
                  return <td key={i}>{val}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table> */}
    </div>
  );
}

export default App;