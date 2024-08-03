import { getCurrentYear } from '@/utils/helpers'
import { google } from 'googleapis'
import { NextApiRequest, NextApiResponse } from 'next'

const SPREADSHEET_TAB_NAME: string = 'Classificação'

async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    if (req.method !== 'GET')
      return res.status(405).json({ message: 'Method Not Allowed' })

    const { year } = req.query

    if (Number(year) > getCurrentYear())
      return res.status(400).json({ message: 'Invalid parameter: year' })

    const spreadsheetTabName = getSpreadSheetTab(String(year))

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })

    const sheets = google.sheets({
      auth,
      version: 'v4',
    })

    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.BRAZUERAO_SHEET_ID,
      range: `${spreadsheetTabName}!B1:G21`,
    })

    if (data == null || data.values == null || data.values?.length <= 0)
      res.status(204)

    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'Internal Error', Error: (error as Error).message })
  }
}

function getSpreadSheetTab(year: String) {
  let yearFormatted = Number(year)
  return yearFormatted <= 2023
    ? SPREADSHEET_TAB_NAME
    : `${SPREADSHEET_TAB_NAME} ${yearFormatted}`
}

export default handler
