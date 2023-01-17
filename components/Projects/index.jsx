import React from "react";

//lib
import overflowText from "../../lib/overflow";

function Index({ sheetData }) {
  return (
    <div className="mt-32 flex flex-col h-[80vh]  w-[1150px] gap-x-5 rounded-[30px] p-6 backdrop-blur-[100px] overflow-hidden">
      <span className="flex w-[98%] px-6 text-white border-b-[0.5px] border-[hsla(0,0%,100%,.288)] py-2 mb-3">
        <h1 className="w-[50%]">Projects</h1>
        <h1 className="w-[15%]">Date Given</h1>
        <h1 className="w-[15%]">Token</h1>
        <h1 className="w-[25%] text-right">USD</h1>
      </span>
      <span className="scrollcon flex flex-col h-[100%] overflow-y-scroll">
        {sheetData.map((ele, idx) => {
          return <Entries key={idx} data={ele} />;
        })}
      </span>
    </div>
  );
}

const Entries = ({ data }) => {
  return (
    <span className="flex w-[98%] px-6 text-white bg-[rgba(0,0,0,.274)] my-1.5 py-3 rounded-xl ">
      <h1 className="w-[50%]">{overflowText(data["Project"], 42)}</h1>
      <h1 className="w-[15%]">{data["Date Given"]}</h1>
      <h1 className="w-[15%]">{data["Token"]}</h1>
      <h1 className="w-[25%] text-right">$ {data["Total Earnings USD"]}</h1>
    </span>
  );
};

export default Index;
