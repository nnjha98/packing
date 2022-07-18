import "./App.css";
import { useState } from "react";
import Papa from "papaparse";
import $ from 'jquery'; 
import React, { PureComponent } from 'react';

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'

import Modal from 'react-modal';
import * as THREE from 'three'

class App extends React.Component {


  Box = (props) => {
    // This reference gives us direct access to the THREE.Mesh object
    console.log("new box with: ", {props})
    const ref = useRef()
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => (ref.current.rotation.x += 0.0))
    // Return the view, these are regular Threejs elements expressed in JSX
    return (
      <mesh
        {...props}
        ref={ref}
        scale={clicked ? 1 : 1}
        onClick={(event) => click(!clicked)}
        onPointerOver={(event) => hover(true)}
        onPointerOut={(event) => hover(false)}>
        <boxGeometry args={props.size} />
        <meshStandardMaterial color={props.color} opacity={1} transparent />
      </mesh>
    )
  }

  BoxC = (props) => {
    // This reference gives us direct access to the THREE.Mesh object
    console.log("new box with: ", {props})
    const ref = useRef()
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => (ref.current.rotation.x += 0.0))
    // Return the view, these are regular Threejs elements expressed in JSX
    return (
      <mesh
        {...props}
        ref={ref}
        scale={clicked ? 1 : 1}
        onClick={(event) => click(!clicked)}
        onPointerOver={(event) => hover(true)}
        onPointerOut={(event) => hover(false)}>
        <boxGeometry args={props.size} />
        <meshStandardMaterial color={props.color} opacity={0.5} transparent />
      </mesh>
    )
  }
  
  Canva = (props) => {
    console.log("Canva props: ",this.state.currentPlacement)
    // this.state.currentPlacement.forEach(e => {
    //   // console.log(e['pos']," ",e['size'])
    //   var i = 0;
    //   while (i<3)
    //   {
    //     console.log("old: ", e['pos'][i])
    //     e['pos'][i]+=e['size'][i]/2
    //     console.log("new: ", e['pos'][i])
    //     i++;
    //   }
    // })
    var colorArray = ['lime','maroon','midnightblue','orangered','seagreen','violet','aqua','crimson','greenyellow','fuchsia']
    const [array, setarray] = useState(this.state.currentPlacement)
    const positions = new Float32Array(
      [0,0,0, 
        0,40,0,
        0,80,0,
        152.4,80,0]);
  const colors = new Float32Array(
    [1,0.5,0.5,
      1,0.5,0.5,
      1,0.5,0.5,
      1,0.5,0.5]);
    return (
      <Canvas camera={{ fov: 75, position: [0, 0, 200]}}>
        <OrbitControls />
        {/* <Stars/> */}
        <ambientLight intensity={0.3} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <this.BoxC visible={this.state.containerVisible} position={this.state.containerpos} size={this.state.containersize} color={'yellowgreen'} opacity={0.1}/>
        {/* <this.Box position={[0+100, 0+20, 0+62.5]} size={[200, 40, 125]} />
        <this.Box position={[0+100, 40+20, 0+62.5]} size={[200, 40, 125]} />
        <this.Box position={[0+76.2, 80+34.3, 0+66.7]} size={[152.4, 68.6, 133.4]} />
        <this.Box position={[152.4+76.2, 80+34.3, 0+66.7]} size={[152.4, 68.6, 133.4]} /> */}
        {array.map((element, index) =>
          <this.Box position={element['pos']} size={element['size']} color={colorArray[index%10]} opacity={0.8}/>
        )}
        <points>
        <bufferGeometry attach="geometry">
          <bufferAttribute
              attach="attributes-position"
              count={positions.length / 3}
              array={positions}
              itemSize={3}
              usage={THREE.DynamicDrawUsage}
            />
            <bufferAttribute
              attach="attributes-color"
              count={colors.length / 3}
              array={colors}
              itemSize={3}
              usage={THREE.DynamicDrawUsage}
            />
        </bufferGeometry>
        <pointsMaterial attach="material" vertexColors size={10} sizeAttenuation={false} />
      </points>
      </Canvas>
    )
  }

  state={
    sbox: [],
    bbox: [],
    open: false,
    currentPlacement: [],
    containerVisible: true
  }

  constructor(props)
  {
      super(props);
      this.setState({
        sbox: [],
        bbox: [],
        open: false,
        currentPlacement: [],
        containerVisible: true
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
        if (parseFloat(data[i][0]) > 0)
        {
          bbox[i]['present']=true
          bbox[i]['placement'] = data[i][2]
        }
        else
        {
          bbox[i]['present']=false
        }
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
  
  effclick = (event,index) => {
    console.log("inside eff click")
    console.log({event, index})
    this.setState({open: true})
    console.log("placement: ", this.state.bbox[parseInt(index)]['placement'])
    // currentPlacement: []
    this.setState({currentPlacement: this.state.bbox[parseInt(index)]['placement']})
    this.setState({containersize: [parseFloat(this.state.bbox[parseInt(index)]['W']),parseFloat(this.state.bbox[parseInt(index)]['H']),parseFloat(this.state.bbox[parseInt(index)]['D'])]})
    this.setState({containerpos: [parseFloat(this.state.bbox[parseInt(index)]['W'])/2.0,parseFloat(this.state.bbox[parseInt(index)]['H'])/2.0,parseFloat(this.state.bbox[parseInt(index)]['D'])/2.0]})
  }

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
            <div key={`${index}_3`}><p>{box['BoxCode']} ({box['W']} , {box['D']} , {box['H']}) : </p><button onClick={event=>this.effclick(event,index)}>3D</button></div>
            <div key={`${index}_4`}><p><b><u>{box['eff']}</u></b>  ({box['volu']})  |  <b><u>{box['eff2']}</u></b></p></div>
          </div>
        )
      })}
    </div>
    </div>
      <Modal isOpen={this.state.open}>
        <button onClick={()=>{this.setState({open:false})}}>Close this</button>
        <button onClick={()=>{this.setState({containerVisible:!this.state.containerVisible})}}>Toggle container</button>
        <this.Canva></this.Canva>
      </Modal>
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