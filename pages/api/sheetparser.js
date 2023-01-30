const PublicGoogleSheetsParser = require('public-google-sheets-parser')

const spreadsheetId = '1I6EEV3RTTPTI5ugX3IWvkjx39pjSym9tk4DBeoXyGys'

// 1. You can pass spreadsheetId when parser instantiation
const parser = new PublicGoogleSheetsParser(spreadsheetId)

const getData = async () => {
    let output = await parser.parse(spreadsheetId, 'Bounties Paid');
    return output
}


export default async function handler(req, res) {
    let data = await getData()
    res.status(200).json(data)
}
