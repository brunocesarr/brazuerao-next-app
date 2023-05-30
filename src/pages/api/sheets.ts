import { google } from 'googleapis'
import { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    if (req.method !== 'GET')
      res.status(405).json({ message: 'Method Not Allowed' })

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
      range: 'Classificação!B1:F21',
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

export default handler
