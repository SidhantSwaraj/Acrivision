import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box, Line } from "@react-three/drei";
import * as THREE from "three";
import * as XLSX from "xlsx";
import "./styles.css";

function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    const loadExcelData = async () => {
      try {
        const response = await fetch("/data/sample.xlsx");
        if (!response.ok) throw new Error("Network response was not ok");
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const allSheetsData = {};
        workbook.SheetNames.forEach((sheetName) => {
          const sheetData = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheetData);
          allSheetsData[sheetName] = jsonData;
        });

        setData(allSheetsData);
        console.log(allSheetsData);
      } catch (error) {
        console.error("Error loading the Excel file:", error);
      }
    };

    loadExcelData();
  }, []);

  // data {A:[{},{},{}],B:[{},{},{}],C:[{},{},{}]}
  if (!data.A) {
    return <h1>Loading...</h1>;
  }

  let members = data.A;
  let nodes = data.B;
  let nodeId = data.C;

  return (
    <Canvas camera={{ position: [-10, 90, 100], fov: 100 }}>
      <ambientLight intensity={1.5} />
      <pointLight position={[0, 0, 0]} intensity={0.5} />
      <OrbitControls />
      <group position={[0, 0, 0]}>
        {members.map((member, index) => {
          let startNode = nodes[member["Start Node"] - 1];
          let endNode = nodes[member["End Node"] - 1];

          const startPoint = new THREE.Vector3(
            startNode["X"],
            startNode["Y"],
            startNode["Z"]
          );
          const endPoint = new THREE.Vector3(
            endNode["X"],
            endNode["Y"],
            endNode["Z"]
          );

          const curve = new THREE.LineCurve3(startPoint, endPoint);

          return (
            <mesh key={index}>
              <tubeGeometry args={[curve, 20, 1, 8, false]} />
              <meshStandardMaterial color="gray" />
            </mesh>
          );
        })}

        <Box position={[0, 0, -13.0622]} args={[12, 4, 12]}>
          <meshStandardMaterial color="cyan" />
        </Box>
        <Box position={[-11.3127, 0, 6.5311]} args={[12, 4, 12]}>
          <meshStandardMaterial color="cyan" />
        </Box>
        <Box position={[11.3127, 0, 6.5311]} args={[12, 4, 12]}>
          <meshStandardMaterial color="cyan" />
        </Box>
      </group>

      <Line
        points={[
          [0, 0, -3],
          [20, 0, -3],
        ]}
        color="red"
        lineWidth={2.5}
      />
      <Line
        points={[
          [0, 0, -3],
          [0, 15, -3],
        ]}
        color="green"
        lineWidth={2.5}
      />
      <Line
        points={[
          [0, 0, -3],
          [0, 0, 16],
        ]}
        color="blue"
        lineWidth={2.5}
      />
    </Canvas>
  );
}

export default App;
