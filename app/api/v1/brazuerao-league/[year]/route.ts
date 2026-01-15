import { getCurrentYear } from '@/utils/helpers'
import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'

const SPREADSHEET_TAB_NAME: string = 'Classificação'

export async function GET(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url)
    const year = pathname.split('/').pop()

    if (Number(year) > getCurrentYear())
      return NextResponse.json(
        { message: 'Invalid parameter: year' },
        { status: 400 }
      )

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
      range: `${spreadsheetTabName}!B1:K21`,
    })

    if (data == null || data.values == null || data.values?.length <= 0)
      NextResponse.json({ message: 'No data found' }, { status: 204 })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Internal Error', Error: (error as Error).message },
      { status: 500 }
    )
  }
}

function getSpreadSheetTab(year: String) {
  let yearFormatted = Number(year)
  return yearFormatted <= 2023
    ? SPREADSHEET_TAB_NAME
    : `${SPREADSHEET_TAB_NAME} ${2024}`
}
