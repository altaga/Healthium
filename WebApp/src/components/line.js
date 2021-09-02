import React from "react";
import { Chart } from "react-charts";
import { isMobile } from "react-device-detect";
import ResizableBox from "./ResizableBox";
import "./styles.css";

function Line(props) {

  const series = React.useMemo(
    () => ({
      showPoints: false,
    }),
    []
  );

  const axes = React.useMemo(
    () => [
      {
        primary: true,
        type: "time",
        position: "bottom",
        // filterTicks: (ticks) =>
        //   ticks.filter((date) => +timeDay.floor(date) === +date),
      },
      { type: "linear", position: "left" },
    ],
    []
  );


  if(isMobile){
 return (
    <div >
      <ResizableBox key={Math.random()}>
        <Chart  
        data={props.data} 
        series={series} 
        axes={axes} 
        tooltip />
      </ResizableBox>
    </div>
  );
  }
  else{
     return (
    <>
      <ResizableBox key={Math.random()}>
        <Chart 
        data={props.data} 
        series={series} 
        axes={axes} 
        tooltip />
      </ResizableBox>
    </>
  );
  }
 
}

export default Line;