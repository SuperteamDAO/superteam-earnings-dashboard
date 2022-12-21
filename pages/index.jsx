import Head from 'next/head'
import Image from 'next/image'
import styles from '../pages/Home/home.module.scss'
import axios from 'axios'
import addSubtractDate from 'add-subtract-date'
import React, { useEffect, useState } from 'react';
import graph from '../lib/graph.json'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      display: false
    },
    title: {
      display: false,
      text: 'Chart.js Line Chart',
    },
  },
  scales: {
    y: {
      grid: {
        color: (ctx) => (ctx.index === 0 ? 'white' : 'rgba(0, 0, 0, 0)')
      },
      ticks: {
        color: "white",
        beginAtZero: true
      }
    },
    x: {
      grid: {
        color: (ctx) => (ctx.index === 0 ? 'white' : 'rgba(0, 0, 0, 0)')
      },
      ticks: {
        color: "white",
        beginAtZero: true,
      }
    },
  },
};

const RANGE = { '3D': 3, 'W': 7, 'M': 30, '3M': 90 }

export default function Home({ tokenTimePriceMap, sheetData, graphDataRedis }) {

  const [dateRangeArrayState, setdateRangeArray] = useState([]);
  const [graphData, setgraphData] = useState([]);
  const [range, setrange] = useState(RANGE.W);

  const getDateRangeArray = () => {
    let rangeArray = [];
    for (let i = 0; i < 10; i++) {
      rangeArray.push(`${addSubtractDate.subtract(new Date(), range * i, "days")}`)
    }
    return rangeArray
  }

  let positionCombinedSheet = sheetData.map((entry) => {
    let noOfTokens = 0;
    ['1st Prize', '2nd Prize', '3rd Prize'].forEach((pr) => {
      try {
        if (parseInt(entry[pr].replaceAll(',', '')) > 0) {
          noOfTokens = noOfTokens + parseInt(entry[pr].replaceAll(',', ''));
        }
      }
      catch (er) {

      }
    })
    entry.totalPrize = noOfTokens;
    return entry
  })

  const generateGraphData = () => {
    let dateRangeArray = getDateRangeArray();
    dateRangeArray = dateRangeArray.map((ele) => {
      return getUnixTime(new Date(ele))
    })
    setdateRangeArray(dateRangeArray);
    let dateTokenCountArray = dateRangeArray.map((ele) => {
      let sum = [];
      positionCombinedSheet.forEach((entry) => {
        let projectData = createDate(entry['Date Given']); // string
        let labelDate = unixToDate(ele); // unix date;
        if (projectData < labelDate) {
          sum.push([entry['Token'], entry.totalPrize]);
        }
      })
      return sum;
    })
    let dateTokenSumArray = dateTokenCountArray.map((dat, idx) => {
      let sum = 0;
      dat.forEach((pair) => {
        if (pair[1] > 0) {
          sum = sum + parseInt(tokenTimePriceMap[pair[0]][dateRangeArray[idx]] * pair[1])
        }
      })
      console.log(sum);
      return sum
    })
    setgraphData(dateTokenSumArray);
  }

  useEffect(() => {
    //generateGraphData();
  }, [range])


  let todaysTotal = 0;
  sheetData.forEach((prj) => {
    try {
      let amount = parseInt(prj['Total Earnings USD'].replaceAll(',', ''))
      todaysTotal = todaysTotal + amount;
    }
    catch (er) {
      console.log(er)
    }
  })
  console.log(todaysTotal)

  //rain maker list
  let rainMakerList = {};
  positionCombinedSheet.forEach((entry) => {
    rainMakerList[entry['Rainmaker']] = 0;
  })
  positionCombinedSheet.forEach((entry) => {
    try {
      let total = parseInt(entry['Total Earnings USD'].replaceAll(',', ''))
      if (total > 0) {
        rainMakerList[entry['Rainmaker']] = rainMakerList[entry['Rainmaker']] + total;
      }
    } catch (error) {

    }
  })
  let rainMakerRank = Object.keys(rainMakerList).map((rm) => {
    return [rm, rainMakerList[rm]]
  }).sort((a, b) => {
    return b[1] - a[1]
  });

  //sponsor list
  let sponsorList = {};
  positionCombinedSheet.forEach((entry) => {
    sponsorList[entry['Sponsor']] = 0;
  })
  positionCombinedSheet.forEach((entry) => {
    try {
      let total = parseInt(entry['Total Earnings USD'].replaceAll(',', ''))
      if (total > 0) {
        sponsorList[entry['Sponsor']] = sponsorList[entry['Sponsor']] + total;
      }
    } catch (error) {

    }
  })
  let sponsorRank = Object.keys(sponsorList).map((rm) => {
    return [rm, sponsorList[rm]]
  }).sort((a, b) => {
    return b[1] - a[1]
  });

  // let xAxis = [...graphData]
  // xAxis[0] = todaysTotal;
  // let data = {
  //   labels: dateRangeArrayState.map((ele) => { console.log(ele); return unixToDate(ele).toLocaleDateString() }).reverse(),
  //   datasets: [
  //     {
  //       label: 'Dataset 1',
  //       data: xAxis.reverse(),
  //       borderColor: 'rgb(255, 255, 255)',
  //       backgroundColor: 'rgb(0, 0, 0,0.05)',
  //       tension: 0.3,
  //       fill: true,
  //     },
  //   ],
  // }

  const Chart = () => {
    return (
      <div className={styles.chartWrapper}>
        <span className={styles.rangeNav}>
          {
            Object.keys(RANGE).map((ele) => {
              return (<button style={(RANGE[ele] == range) ? { color: 'black', background: "white" } : {}} key={ele} onClick={() => { setrange(RANGE[ele]) }}>{ele}</button>)
            })

          }
        </span>
        <Line key={range + 'chart'} options={options} data={graphDataRedis[range]} />
      </div>
    )
  }

  const SponsorRank = () => {
    return (
      <div className={styles.window}>
        <div className={styles.projectsTable_rainmaker}>
          <div className={styles.tableHead}>
            <span className={styles.recentProjectTitle}>Sponsor</span>
            <span className={styles.usd}>Total Amount</span>
          </div>
          <div className={styles.scrollCon}>
            {
              sponsorRank.map((ele) => {
                if (ele[0] == 'null') {
                  return null
                }
                return (
                  <div key={ele['Project']} className={styles.tableBody} >
                    <span className={styles.recentProjectTitle}>{ele[0]}</span>
                    <span className={styles.usd}>$ {ele[1]}</span>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }

  const RainmakerRank = () => {
    return (
      <div className={styles.window}>
        <div className={styles.projectsTable_rainmaker}>
          <div className={styles.tableHead}>
            <span className={styles.recentProjectTitle}>Rainmaker</span>
            <span className={styles.usd}>Total Amount</span>
          </div>
          <div className={styles.scrollCon}>
            {
              rainMakerRank.map((ele) => {
                if (ele[0] == 'null') {
                  return null
                }
                return (
                  <div key={ele['Project']} className={styles.tableBody} >
                    <span className={styles.recentProjectTitle}>{ele[0]}</span>
                    <span className={styles.usd}>$ {ele[1]}</span>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }


  const Projects = () => {
    return (
      <div className={styles.window}>
        <div className={styles.projectsTable}>
          <div className={styles.tableHead}>
            <span className={styles.recentProjectTitle}>Projects</span>
            <span className={styles.projectDate}>Date given</span>
            <span className={styles.token}>Token</span>
            <span className={styles.usd}>USD</span>
          </div>
          <div className={styles.scrollCon}>
            {
              positionCombinedSheet.map((ele) => {
                return (
                  <div key={ele['Project']} className={styles.tableBody} >
                    <span className={styles.recentProjectTitle}>{ele['Project']}</span>
                    <span className={styles.projectDate}>{ele['Date Given']}</span>
                    <span className={styles.token}>{ele['Token']}</span>
                    <span className={styles.usd}>$ {ele['Total Earnings USD']}</span>
                  </div>
                )
              }).reverse()
            }
          </div>
        </div>
      </div>
    )
  }



  const HomePage = () => {
    return (
      <div className={styles.window} style={{ animation: "none" }}>
        <div className={styles.leftSec}>
          <div className={styles.chart}>
            <Chart />
          </div>
          <div className={styles.recentProjects}>
            <div className={styles.tableHead}>
              <span className={styles.recentProjectTitle}>Recent Projects</span>
              <span className={styles.projectDate}>Date given</span>
              <span className={styles.token}>Token</span>
              <span className={styles.usd}>USD</span>
            </div>
            {[...positionCombinedSheet].reverse().map((pr, idx) => {
              if (idx > 2) {
                return null
              }
              return (
                <div key={pr + "namex"}>
                  <span className={styles.recentProjectTitle}>{overflowText(pr['Project'])}</span>
                  <span className={styles.projectDate}>{pr['Date Given']}</span>
                  <span className={styles.token}>{pr['Token']}</span>
                  <span key={pr['Total Earnings USD']} className={styles.usd}>$ {pr['Total Earnings USD']}</span>
                </div>
              )
            })
            }
          </div>
        </div>
        <div className={styles.rightSec}>
          <span className={styles.totalEarning}>
            <p className={styles.title}>Total Earnings</p>
            <h1>$ {todaysTotal}</h1>
          </span>
          <div className={styles.divider} ></div>
          <span className={styles.totalEarning}>
            <p className={styles.title}>Total Projects</p>
            <h1>{sheetData.length}</h1>
          </span>
          <div className={styles.divider} ></div>
          <span className={styles.top3}>
            <p className={styles.title}>Top Rainmakers</p>
            <table>
              <tbody>
                <tr>
                  <td>{rainMakerRank[0][0]}</td>
                  <td className={styles.amount}>$ {rainMakerRank[0][1]}</td>
                </tr>
                <tr>
                  <td>{rainMakerRank[1][0]}</td>
                  <td className={styles.amount}>$ {rainMakerRank[1][1]}</td>
                </tr>
                <tr>
                  <td>{rainMakerRank[2][0]}</td>
                  <td className={styles.amount}>$ {rainMakerRank[2][1]}</td>
                </tr>
              </tbody>
            </table>
          </span>
          <div className={styles.divider} ></div>
          <span className={styles.top3}>
            <p className={styles.title}>Top Sponsors</p>
            <table>
              <tbody>
                <tr>
                  <td>{sponsorRank[1][0]}</td>
                  <td className={styles.amount}>$ {sponsorRank[1][1]}</td>
                </tr>
                <tr>
                  <td>{sponsorRank[2][0]}</td>
                  <td className={styles.amount}>$ {sponsorRank[2][1]}</td>
                </tr>
                <tr>
                  <td>{sponsorRank[3][0]}</td>
                  <td className={styles.amount}>$ {sponsorRank[3][1]}</td>
                </tr>
              </tbody>
            </table>
          </span>
        </div>
      </div>
    )
  }

  const ChartPage = () => {
    return (
      <div className={styles.window} style={{ animation: "none" }}>
        <div className={styles.window_chart}>
          <Chart />
        </div>
      </div >
    )
  }

  const [selectedPage, setselectedPage] = useState('Home')
  const pages = ['Home', 'Projects', 'Earning Graph', 'Rainmaker Leaderboard', 'Sponsor Leaderboard'];
  return (
    <div className={styles.home}>
      <Head>
        <link rel="preload" as="image" href="/home-1.jpg" />
      </Head>
      <div className={styles.globalNav}>
        {
          pages.map((ele) => {
            return (
              <button key={ele} onClick={() => {
                setselectedPage(ele)
              }} className={(ele == selectedPage) ? styles.selectedBtn : ""}>{ele}</button>
            )
          })
        }
      </div>
      {(selectedPage == 'Home') && <HomePage />}
      {(selectedPage == 'Projects') && <Projects />}
      {(selectedPage == 'Earning Graph') && <ChartPage />}
      {(selectedPage == 'Rainmaker Leaderboard') && <RainmakerRank />}
      {(selectedPage == 'Sponsor Leaderboard') && <SponsorRank />}
    </div>
  )

}



const overflowText = (str) => {
  if (str.length < 45) {
    return str
  }
  return str.slice(0, 42) + '...'
}

const getUnixTime = (date) => {
  let DATE = new Date(date)
  DATE.setHours(5, 30, 0, 0);
  return parseInt(`${Math.floor(DATE.getTime() / 1000)}000`)
}

const unixToDate = (unix) => {
  var date = new Date(unix) //0000;
  return date
}

//create date 
let createDate = (date) => {
  let data_string = date + " " + 'EDT';
  return new Date(data_string);
}



let SHEET_URL = `https://api.steinhq.com/v1/storages/62e2315abca21f053ea5d9c6/Bounties%20Paid`;
export async function getServerSideProps(context) {
  // let data = await Promise.all([await axios.get(SHEET_URL), await axios.get(SHEET_URL)])
  // let HISTORIC_DATA = JSON.parse(data[0]);
  // let tokenTimePriceMap = {};
  // Object.keys(HISTORIC_DATA).forEach((token) => {
  //   tokenTimePriceMap[token] = {}
  //   HISTORIC_DATA[token].forEach((time) => {
  //     tokenTimePriceMap[token][time[0]] = time[1]
  //   })
  // })

  // let graphData = await redis.get('graph-data');
  let graphData = graph;
  let data = await axios.get(SHEET_URL);
  return {
    props: { tokenTimePriceMap: {}, sheetData: data.data, graphDataRedis: graphData }, // will be passed to the page component as props
  }
}