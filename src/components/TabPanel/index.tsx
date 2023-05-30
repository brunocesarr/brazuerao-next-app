interface TabPanelProps {
  children?: React.ReactNode
  tabName: string
  tabNameActive: string
}

export function TabPanel({ children, tabName, tabNameActive }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={!tabName.toUpperCase().includes(tabNameActive.toUpperCase())}
      id={`tabpanel-${tabName}`}
      aria-labelledby={`tab-${tabName}`}
    >
      {tabName.toUpperCase().includes(tabNameActive.toUpperCase()) && children}
    </div>
  )
}
