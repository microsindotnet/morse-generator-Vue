export const TABLES_WINDOW_NAME = 'morse-generator-tables'

export function openMorseTables(): void {
  const { origin, pathname } = window.location
  const url = `${origin}${pathname}#tables`
  window.open(url, TABLES_WINDOW_NAME)
}
