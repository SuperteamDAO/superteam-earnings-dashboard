import React from "react";

//lib
import overflowText from "../../lib/overflow";

function Index({ sponsors, sortedSponsors }) {
  return (
    <div className="flex-1">
      <div className="flex flex-col max-h-[75vh]  w-[1150px] gap-x-5 rounded-[30px] p-6 backdrop-blur-[100px] overflow-hidden">
        <span className="flex w-[98%] px-6 text-white border-b-[0.5px] border-[hsla(0,0%,100%,.288)] py-2 mb-3">
          <h1 className="w-[75%]">Sponsor</h1>
          <h1 className="w-[25%] text-right">USD</h1>
        </span>
        <span className="scrollcon flex flex-col h-[100%] overflow-y-scroll">
          {sortedSponsors.map((ele, idx) => {
            return <Entries key={idx} sponsor={ele} sponsors={sponsors} />;
          })}
        </span>
      </div>
    </div>
  );
}

const Entries = ({ sponsor, sponsors }) => {
  return (
    <span className="flex w-[98%] px-6 text-white bg-[rgba(0,0,0,.274)] my-1.5 py-3 rounded-xl ">
      <h1 className="w-[75%]">{overflowText(sponsor, 42)}</h1>
      <h1 className="w-[25%] text-right">$ {sponsors[sponsor]}</h1>
    </span>
  );
};

export default Index;
