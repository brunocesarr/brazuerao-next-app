export class LocalStorageKeysCache {
  static readonly GOOGLE_SHEET_SERVICE_GET_BRAZUERAO: string = process.env
    .NEXT_PUBLIC_AMBIENTE_BRAZUERAO_WEB_APP
    ? `brazuerao-table_${process.env.NEXT_PUBLIC_AMBIENTE_BRAZUERAO_WEB_APP}`
    : 'brazuerao-table'

  static readonly BRASILEIRAO_LEAGUE_SERVICE_GET_TABLE: string = process.env
    .NEXT_PUBLIC_AMBIENTE_BRAZUERAO_WEB_APP
    ? `brazileirao-table_${process.env.NEXT_PUBLIC_AMBIENTE_BRAZUERAO_WEB_APP}`
    : 'brazileirao-table'
}
