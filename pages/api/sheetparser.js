const PublicGoogleSheetsParser = require('public-google-sheets-parser')

const spreadsheetId = '1YTMY3xaJW--zp-KbSn0Ch0SJCnI3TBzuYL33Spgg5fw'

// 1. You can pass spreadsheetId when parser instantiation
const parser = new PublicGoogleSheetsParser(spreadsheetId)

const getData = async () => {
    let output = await parser.parse(spreadsheetId);
    return output
}


export default async function handler(req, res) {
    let data = await getData()
    res.status(200).json(data)
}
