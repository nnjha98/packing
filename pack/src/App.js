import "./App.css";
import { useState } from "react";
import Papa from "papaparse";
import $ from 'jquery'; 
import React, { PureComponent } from 'react';


class App extends React.Component {

  state={
    sbox: [],
    bbox: []
  }

  constructor(props)
  {
      super(props);
      this.setState({
        sbox: [],
        bbox: []
      })
  }

  tryandpack = (event) => {
    console.log("inside try and pack");
    var i = 0;
    var countArray = []
    while (i<this.state.sbox.length)
    {
      if (this.state.sbox[i]['count'])
      {
        countArray.push(parseInt(this.state.sbox[i]['count']))
      }
      else
      {
        countArray.push(0)
      }
      i++;
    }
    console.log({countArray})
    var axios = require('axios');
    var data = {countArray};

    var config = {
      method: 'post',
      url: 'http://127.0.0.1:5000/pack',
      headers: { 
        'Content-Type': 'text/plain'
      },
      data : data
    };

    axios(config)
    .then(function (response) {
      console.log("resp: ",JSON.stringify(response.data));
      return response.data
    })
    .then((data)=>{
      console.log("data: ", data);
      i =0;
      var bbox = this.state.bbox;
      while (i<17)
      {
        // bbox[i]['eff']=String(data[i])
        bbox[i]['eff']=String(data[i][0])
        bbox[i]['volu']=String(data[i][1])
        i+=1;
      }
      return bbox

    })
    .then((bb)=>{
      console.log("final bbox: ",bb);
      this.setState({bbox : bb})
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  tryandpack2 = (event) => {
    console.log("inside try and pack2");
    var i = 0;
    var countArray = []
    while (i<this.state.sbox.length)
    {
      if (this.state.sbox[i]['count'])
      {
        countArray.push(parseInt(this.state.sbox[i]['count']))
      }
      else
      {
        countArray.push(0)
      }
      i++;
    }
    console.log("Data being sent: ",{countArray})
    var axios = require('axios');
    var data = {countArray};

    var config = {
      method: 'post',
      url: 'http://127.0.0.1:5000/pack2',
      headers: { 
        'Content-Type': 'text/plain'
      },
      data : data
    };

    axios(config)
    .then(function (response) {
      console.log("resp: ",JSON.stringify(response.data));
      return response.data
    })
    .then((data)=>{
      console.log("Data received: ", data);
      i =0;
      var bbox = this.state.bbox;
      while (i<17)
      {
        bbox[i]['eff']=String(data[i][0])
        bbox[i]['volu']=String(data[i][1])
        i+=1;
      }
      // setBbox([])
      return bbox

    })
    .then((bb)=>{
      console.log("final bbox: ",bb);
      this.setState({bbox:bb})
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  tryandpack3 = (event) => {
    console.log("inside try and pack2");
    var i = 0;
    var countArray = []
    while (i<this.state.sbox.length)
    {
      if (this.state.sbox[i]['count'])
      {
        countArray.push(parseInt(this.state.sbox[i]['count']))
      }
      else
      {
        countArray.push(0)
      }
      i++;
    }
    console.log("Data being sent: ",{countArray})
    var axios = require('axios');
    var data = {countArray};

    var config = {
      method: 'post',
      url: 'http://127.0.0.1:5001/pack',
      headers: { 
        'Content-Type': 'text/plain'
      },
      data : data
    };

    axios(config)
    .then(function (response) {
      console.log("resp: ",JSON.stringify(response.data));
      return response.data
    })
    .then((data)=>{
      console.log("Data received: ", data);
      i =0;
      var bbox = this.state.bbox;
      while (i<17)
      {
        bbox[i]['eff2']=String(data[bbox[i]['BoxCode']])
        // bbox[i]['volu']=String(data[i][1])
        i+=1;
      }
      // setBbox([])
      return bbox

    })
    .then((bb)=>{
      console.log("final bbox: ",bb);
      this.setState({bbox:bb})
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  changeHandler = (event) => {
    var bbox = require('./bbox.json');
    console.log("bbox: ", bbox)
    var sbox = require('./sbox.json');
    // setSbox(sbox);
    // setBbox(bbox);
    this.setState({bbox: bbox, sbox:sbox});
    // console.log("sbox: ", sbox)
  };
  

  render() { 
    return (
      <div>
        <div width="100%" display="flex" style={{
          display: "grid",
          // margin: "10px",
          padding: "10px",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gridGap: "10px",
          // gridColumnGap: "10px", 
          // columnGap: "10px",
          justifyContent: "start",
          // grid-template-columns: "1fr",
          backgroundColor: "transparent",
          // filter: "blur(0px)",
          overflow: "auto",
        }}>
          <button width="100%" onClick={this.changeHandler}>Load Boxes</button>
          <button width="100%" onClick={this.tryandpack}>Try and pack<br/>ft. Brute Force</button>
          <button width="100%" onClick={this.tryandpack2}>Try and pack<br/>Pure LAFF</button>
          <button width="100%" onClick={this.tryandpack3}>Try and pack<br/>Pure 3dBPP</button>
        </div>
        <div width="100%" display="flex" style={{
          display: "grid",
          // margin: "10px",
          padding: "10px",
          gridTemplateColumns: "1fr 1fr",
          gridGap: "10px",
          // gridColumnGap: "10px", 
          // columnGap: "10px",
          justifyContent: "start",
          // grid-template-columns: "1fr",
          backgroundColor: "transparent",
          // filter: "blur(0px)",
          overflow: "auto",
        }}>
        
      <div width="100%">
        <br />
        <br />
        {this.state.sbox.map((box,index)=>{
          return (
            <div width="100%" display="flex" style={{
              display: "grid",
              // margin: "10px",
              padding: "1px",
              gridTemplateColumns: "1fr 1fr",
              gridGap: "10px",
              // gridColumnGap: "10px", 
              // columnGap: "10px",
              justifyContent: "start",
              // grid-template-columns: "1fr",
              backgroundColor: "transparent",
              // filter: "blur(0px)",
              overflow: "auto",
            }}> 
          <div key={`${index}_1`}><p>{box['BoxCode']} ({box['W']} , {box['D']} , {box['H']}) </p></div>
          <div key={`${index}_2`}><p><input value={box['count']} onInput={e=>{this.state.sbox[index]['count']=e.target.value;this.setState({sbox:this.state.sbox})}}></input></p></div>          
          </div>
          )
        })}
      </div>
      <div width="100%">
      <br />
      <br />
      {this.state.bbox.map((box,index)=>{
        return (
          <div width="100%" display="flex" style={{
            display: "grid",
            // margin: "10px",
            padding: "1px",
            gridTemplateColumns: "1fr 1fr",
            gridGap: "10px",
            // gridColumnGap: "10px", 
            // columnGap: "10px",
            justifyContent: "start",
            // grid-template-columns: "1fr",
            backgroundColor: "transparent",
            // filter: "blur(0px)",
            overflow: "auto",
          }}>
            <div key={`${index}_3`}><p>{box['BoxCode']} ({box['W']} , {box['D']} , {box['H']}) : </p></div>
            <div key={`${index}_4`}><p><b><u>{box['eff']}</u></b>  ({box['volu']})  |  <b><u>{box['eff2']}</u></b></p></div>
          </div>
        )
      })}
    </div>
    </div>
      
    </div>
    );
  }
}
 
export default App;

// function App() {
//   // State to store parsed data
//   const [parsedData, setParsedData] = useState([]);

//   //State to store table Column name
//   const [tableRows, setTableRows] = useState([]);

//   //State to store the values
//   const [values, setValues] = useState([]);
//   const [sbox, setSbox] = useState([]);
//   var [bbox, setBbox] = useState([]);

//   const tryandpack = (event) => {
//     console.log("inside try and pack");
//     var i = 0;
//     var countArray = []
//     while (i<sbox.length)
//     {
//       if (sbox[i]['count'])
//       {
//         countArray.push(parseInt(sbox[i]['count']))
//       }
//       else
//       {
//         countArray.push(0)
//       }
//       i++;
//     }
//     console.log({countArray})
//     var axios = require('axios');
//     var data = {countArray};

//     var config = {
//       method: 'post',
//       url: 'http://127.0.0.1:5000/pack',
//       headers: { 
//         'Content-Type': 'text/plain'
//       },
//       data : data
//     };

//     axios(config)
//     .then(function (response) {
//       console.log("resp: ",JSON.stringify(response.data));
//       return response.data
//     })
//     .then((data)=>{
//       console.log("data: ", data);
//       i =0;
//       while (i<17)
//       {
//         bbox[i]['eff']=String(data[i])
//         i+=1;
//       }
//       setBbox([])
//       return bbox

//     })
//     .then((bb)=>{
//       console.log("final bbox: ",bb);
//       setBbox(bb)
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
//   }

//   const tryandpack2 = (event) => {
//     console.log("inside try and pack2");
//     var i = 0;
//     var countArray = []
//     while (i<sbox.length)
//     {
//       if (sbox[i]['count'])
//       {
//         countArray.push(parseInt(sbox[i]['count']))
//       }
//       else
//       {
//         countArray.push(0)
//       }
//       i++;
//     }
//     console.log({countArray})
//     var axios = require('axios');
//     var data = {countArray};

//     var config = {
//       method: 'post',
//       url: 'http://127.0.0.1:5000/pack2',
//       headers: { 
//         'Content-Type': 'text/plain'
//       },
//       data : data
//     };

//     axios(config)
//     .then(function (response) {
//       console.log("resp: ",JSON.stringify(response.data));
//       return response.data
//     })
//     .then((data)=>{
//       console.log("data: ", data);
//       i =0;
//       while (i<17)
//       {
//         bbox[i]['eff']=String(data[i])
//         i+=1;
//       }
//       setBbox([])
//       return bbox

//     })
//     .then((bb)=>{
//       console.log("final bbox: ",bb);
//       setBbox(bb)
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
//   }

//   const changeHandler = (event) => {
//     var bbox = require('./bbox.json');
//     console.log("bbox: ", bbox)
//     var sbox = require('./sbox.json');
//     setSbox(sbox);
//     setBbox(bbox);
//     console.log("sbox: ", sbox)
//     // $.getJSON("./test.json", function(json) {
//     //   console.log("json ",json); // this will show the info it in firebug console
//     // });
//     // Passing file data (event.target.files[0]) to parse using Papa.parse
//     // console.log("files: ",event.target.files[0]);
//     // this.Files = event.file;
//     // var file = new File([event.blob],"cBox.json", {type: "text/csv"});
//     // console.log(file)
//     // Papa.parse(file, {
//     //   header: true,
//     //   skipEmptyLines: true,
//     //   complete: function (results) {
//     //     const rowsArray = [];
//     //     const valuesArray = [];

//     //     // Iterating data to get column name and their values
//     //     results.data.map((d) => {
//     //       rowsArray.push(Object.keys(d));
//     //       valuesArray.push(Object.values(d));
//     //       console.log(Object.keys(d)[0])
//     //     });

//     //     // Parsed Data Response in array format
//     //     // setParsedData(results.data);

//     //     // // Filtered Column Names
//     //     // setTableRows(rowsArray[0]);

//     //     // // Filtered Values
//     //     // setValues(valuesArray);
//     //   },
//     // });
//   };

//   return (
//     <div>
//       <button onClick={changeHandler}>Load Boxes</button>
//       <button onClick={tryandpack}>Try and pack</button>
//       <button onClick={tryandpack2}>Try and pack 2</button>
//     <div width="100%" display="flex" style={{
//       display: "grid",
//       // margin: "10px",
//       padding: "10px",
//       gridTemplateColumns: "1fr 1fr",
//       gridGap: "10px",
//       // gridColumnGap: "10px", 
//       // columnGap: "10px",
//       justifyContent: "start",
//       // grid-template-columns: "1fr",
//       backgroundColor: "transparent",
//       // filter: "blur(0px)",
//       overflow: "auto",
//     }}>
      
//     <div width="100%">
//       {/* File Uploader */}
//       <br />
//       <br />
//       {sbox.map((box,index)=>{
//         return <div key={index}><p>{box['BoxCode']} ({box['W']} , {box['D']} , {box['H']}) <input value={box['count']} onInput={e=>{sbox[index]['count']=e.target.value;setSbox(sbox)}}></input></p></div>
//       })}
//     </div>
//     <div width="100%">
//     {/* File Uploader */}
//     {/* <button onClick={changeHandler}>Load Boxes</button> */}
//     <br />
//     <br />
//     {bbox.map((box,index)=>{
//       return <div key={index}><p>{box['BoxCode']} ({box['W']} , {box['D']} , {box['H']}) : <input value={box['eff']} onInput={e=>{bbox[index]['eff']=e.target.value;setBbox(bbox)}}></input></p></div>
//     })}
//   </div>
//   </div>
    
//   </div>
//   );
// }

// export default App;