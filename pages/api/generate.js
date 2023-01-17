// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";

//SSR request
let SHEET_URL = `https://api.steinhq.com/v1/storages/63c425eed27cdd09f0d913f1/Bounties%20Paid`;
let GRAPH_URL = `https://api.steinhq.com/v1/storages/63bd9d99eced9b09e9b23f66/Sheet1`;

export async function generate() {

    let [graph_req, sheet_req] = await Promise.all([axios.get(GRAPH_URL), axios.get(SHEET_URL)])

    let graphData = JSON.parse(graph_req.data[0].value);
    let sheetData = sheet_req.data;
    let totalEarning = 0

    // Combine prize data
    sheetData = sheetData.map((elm) => {
        let first = elm["1st Prize"]
            ? parseInt(elm["1st Prize"].replaceAll(",", "").replaceAll("$", ""))
            : 0;
        let second = elm["2nd Prize"]
            ? parseInt(elm["2nd Prize"].replaceAll(",", "").replaceAll("$", ""))
            : 0;
        let third = elm["3rd Prize"]
            ? parseInt(elm["3rd Prize"].replaceAll(",", "").replaceAll("$", ""))
            : 0;

        totalEarning = totalEarning + (elm["Total Earnings USD"]
            ? parseInt(elm["Total Earnings USD"].replaceAll(",", "").replaceAll("$", ""))
            : 0);

        elm.totalTokens = first + second + third;
        return elm
    });

    // generate Rainmake list
    let rainmakers = genList(sheetData, 'Rainmaker')

    // generate Sponsor list
    let sponsors = genList(sheetData, 'Sponsor')

    // sorted rainmakers 
    let sortedRainmakers = Object.keys(rainmakers).sort((a, b) => {
        return rainmakers[b] - rainmakers[a];
    }).filter(ele => (ele != 'null'));

    // sorted sponsors
    let sortedSponsors = Object.keys(sponsors).sort((a, b) => {
        return sponsors[b] - sponsors[a];
    }).filter(ele => (ele != 'null'));

    return { graphData, sheetData: false || sheetData.reverse(), rainmakers, sponsors, totalEarning, sortedRainmakers, sortedSponsors }

}

const genList = (sheetData, key) => {
    let rainMakers = [...new Map(...[sheetData.map(elm => [elm[key], 0])])];
    rainMakers = (() => {
        let rm = {};
        rainMakers.forEach((elm) => {
            rm[elm[0]] = 0
        })
        return rm;
    })()

    sheetData.forEach((elm) => {
        let usd = elm["Total Earnings USD"] ? parseInt(elm["Total Earnings USD"].replaceAll(",", "").replaceAll("$", "")) : 0;
        rainMakers[elm[key]] = rainMakers[elm[key]] + usd
    })
    return rainMakers;
}

export default async function handler(req, res) {
    let data = await generate();
    res.status(200).json(data)
}