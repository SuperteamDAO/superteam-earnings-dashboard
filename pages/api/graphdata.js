// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'

let historicdata = import('../../lib/new_data.json')

let SHEET_URL = `https://api.steinhq.com/v1/storages/63c425eed27cdd09f0d913f1/Bounties%20Paid`;

let combinePrizes = (sh) => {
    // Combine prize data
    let sheetData = sh;
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
    return sh
}

export default async function handler(req, res) {
    let sheetData = await axios.get(SHEET_URL)
    generateGraphData(sheetData.data);
    res.status(200).json(sheetData.data)
}
