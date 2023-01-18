import React, { useState } from "react";
import axios from "axios";

//API
import { generate } from "./api/generate";

//Components
import Chart from "../components/Chart";
import Projects from "../components/Projects";
import Rainmaker from "../components/Raimaker";
import Sponsor from "../components/Sponsor";
import ChartWindow from "../components/ChartWindow";

//lib
import overflowText from "../lib/overflow";

const RANGE = { "3D": 3, W: 7, M: 30, "3M": 90 };

const pages = [
  "Home",
  "Projects",
  "Earning Graph",
  "Rainmaker Leaderboard",
  "Sponsor Leaderboard",
];

function Index({
  graphData,
  sheetData,
  rainmakers,
  sponsors,
  totalEarning,
  sortedRainmakers,
  sortedSponsors,
}) {
  const [range, setrange] = useState(RANGE.W);
  const [selectedPage, setselectedPage] = useState("Home");

  return (
    <div className="flex min-h-screen h-max w-screen justify-center bg-hero-bg bg-cover bg-no-repeat pb-16 overflow-x-hidden">
      <PageNav {...{ selectedPage, setselectedPage }} />
      {selectedPage == pages[0] && <Home />}
      {selectedPage == pages[1] && <Projects sheetData={sheetData} />}
      {selectedPage == pages[2] && (
        <ChartWindow graphData={graphData} range={range} setrange={setrange} />
      )}
      {selectedPage == pages[3] && (
        <Rainmaker
          rainmakers={rainmakers}
          sortedRainmakers={sortedRainmakers}
        />
      )}
      {selectedPage == pages[4] && (
        <Sponsor sponsors={sponsors} sortedSponsors={sortedSponsors} />
      )}
    </div>
  );

  function Home() {
    return (
      <div className="mt-32 flex h-fit  w-[1150px] gap-x-5 rounded-[30px] p-6 backdrop-blur-[100px]">
        <div className="flex w-[75%] flex-col gap-y-5">
          <Chart graphData={graphData} range={range} setrange={setrange} />
          <RecentProjects
            recentProjects={[sheetData[0], sheetData[1], sheetData[2]]}
          />
        </div>
        <Overview
          totalEarning={totalEarning}
          totalProjects={sheetData.length}
          rainmakers={rainmakers}
          sortedRainmakers={sortedRainmakers}
          sponsors={sponsors}
          sortedSponsors={sortedSponsors}
        />
      </div>
    );
  }
}

function PageNav({ selectedPage, setselectedPage }) {
  return (
    <div className="absolute top-5 left-0 right-0 mx-auto flex w-fit gap-x-2 rounded-lg bg-[rgba(0,0,0,0.178)] p-1.5 backdrop-blur-[10px]">
      {pages.map((ele) => {
        return (
          <button
            key={ele}
            onClick={() => {
              setselectedPage(ele);
            }}
            className={`text-sm rounded-lg py-2 px-3 text-white 
            ${selectedPage == ele && "bg-[rgba(0,0,0,0.527)]"}`}
          >
            {ele}
          </button>
        );
      })}
    </div>
  );
}

function RecentProjects({ recentProjects }) {
  return (
    <span className=" mt-auto flex w-full flex-col rounded-[30px] bg-[rgba(0,0,0,.29)] p-6 pb-4 text-[18px] text-white">
      <span className="flex w-full border-b-[1.5px] border-[hsla(0,0%,100%,.089)] py-2 text-gray-300">
        <p className="w-[60%]">Recent Projects</p>
        <p className="w-[15%]">Date given</p>
        <p className="w-[15%] text-right">Token</p>
        <p className="w-[20%] text-right">USD</p>
      </span>
      <EntriesRecent data={recentProjects[0]} />
      <EntriesRecent data={recentProjects[1]} />
      <EntriesRecent data={recentProjects[2]} />
    </span>
  );
}

function EntriesRecent({ data }) {
  return (
    <span className="flex w-full py-2 ">
      <p className="w-[60%] font-light">{overflowText(data["Project"], 42)}</p>
      <p className="w-[15%] font-light">{data["Date Given"]}</p>
      <p className="w-[15%] font-light text-right">{data["Token"]}</p>
      <p className="w-[20%] font-light text-right">
        $ {data["Total Earnings USD"]}
      </p>
    </span>
  );
}

function Overview({
  totalEarning,
  totalProjects,
  sponsors,
  sortedSponsors,
  rainmakers,
  sortedRainmakers,
}) {
  return (
    <span className="flex h-[670px] w-[30%] flex-col rounded-[30px] bg-[rgba(0,0,0,.29)] px-6 backdrop-blur-[100px]">
      <span className="flex h-min w-full flex-col items-end border-b-[1.5px] border-[hsla(0,0%,100%,.089)] py-6 ">
        <p className="ml-auto text-[15px] font-normal text-white">
          Total Earnings
        </p>
        <h1 className="text-[45px] font-medium text-white">$ {totalEarning}</h1>
      </span>
      <span className="flex h-min w-full flex-col items-end border-b-[1.5px] border-[hsla(0,0%,100%,.089)] py-6">
        <p className="ml-auto text-[15px] font-normal text-white">
          Total Projects
        </p>
        <h1 className="text-[45px] font-medium text-white">{totalProjects}</h1>
      </span>
      <span className="flex h-min w-full flex-col items-end border-b-[1.5px] border-[hsla(0,0%,100%,.089)] py-6">
        <p className="ml-auto mb-2 text-[15px] font-normal text-white">
          Top Rainmakers
        </p>
        <Entries
          label={sortedRainmakers[0]}
          value={rainmakers[sortedRainmakers[0]]}
        />
        <Entries
          label={sortedRainmakers[1]}
          value={rainmakers[sortedRainmakers[1]]}
        />
        <Entries
          label={sortedRainmakers[2]}
          value={rainmakers[sortedRainmakers[2]]}
        />
      </span>
      <span className="flex h-min w-full flex-col items-end py-6 ">
        <p className="ml-auto mb-2 text-[15px] font-normal text-white">
          Top Sponsors
        </p>
        <Entries
          label={sortedSponsors[0]}
          value={sponsors[sortedSponsors[0]]}
        />
        <Entries
          label={sortedSponsors[1]}
          value={sponsors[sortedSponsors[1]]}
        />
        <Entries
          label={sortedSponsors[2]}
          value={sponsors[sortedSponsors[2]]}
        />
      </span>
    </span>
  );
}

function Entries({ label, value }) {
  return (
    <span className="flex w-full justify-between py-1 text-white">
      <h2 className="text-[20px] font-normal">{overflowText(label, 14)}</h2>
      <h2 className="text-[20px] font-normal">$ {value}</h2>
    </span>
  );
}

export async function getServerSideProps(context) {
  let data = await generate();

  return {
    props: {
      ...data,
    }, // will be passed to the page component as props
  };
}

export default Index;
