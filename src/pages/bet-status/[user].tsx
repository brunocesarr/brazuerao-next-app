import {
  AppBar,
  Box,
  Container,
  Skeleton,
  Tab,
  Tabs,
  Toolbar,
} from '@mui/material'
import { useRouter } from 'next/router'
import Update from '@mui/icons-material/Update'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { decryptStringValue } from '@/utils/helpers'
import { useEffect, useState } from 'react'
import { ErrorComponent } from '@/components/Error'
import Typography from '@mui/material/Typography'
import {
  getBrazilianTable,
  getBrazueraoTableByUser,
} from '@/services/brazuerao.service'
import { ITeamApiInfo, ITeamPositionInfo } from '@/interfaces'
import { ZonesClassificationTable } from '@/configs/zones-classification-table'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckIcon from '@mui/icons-material/Check'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}))

export default function BetStatusDetail() {
  const router = useRouter()
  const username = router.query.user as string
  const [brazueraoTable, setBrazueraoTable] = useState<string[]>([])
  const [brazilianTable, setBrazilianTable] = useState<ITeamPositionInfo[]>([])
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [zonesInTable, setZonesInTable] = useState('planilha')

  useEffect(() => {
    if (!username) {
      setErrorMessage('User not Found')
      return
    }

    const getTablesInfo = async () => {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const brazilianTableResult = await getBrazilianTable()
        const brazueraoTableResult = await getBrazueraoTableByUser(username)

        setBrazilianTable(brazilianTableResult)
        setBrazueraoTable(brazueraoTableResult)
      } catch (error) {
        console.log('Inexpect Error. Message: ' + (error as Error).message)
        throw error
      }
    }

    getTablesInfo()
      .catch((error) => setErrorMessage((error as Error).message))
      .finally(() => setIsLoading(false))
  }, [])

  const backgroundColorRow = (positionTeam: number) => {
    const backgroundColorIfZonaCentral = zonesInTable
      .toLowerCase()
      .includes('planilha')
      ? 'rgb(255, 255, 143, 0.65)'
      : ZonesClassificationTable.PRE_LIBERTADORES_ZONE.includes(positionTeam)
      ? 'rgb(137, 207, 240, 0.65)'
      : ZonesClassificationTable.SULAMERICANA_ZONE.includes(positionTeam)
      ? 'rgb(255, 255, 143, 0.65)'
      : 'rgb(240, 255, 255, 0.65)'

    return ZonesClassificationTable.G4_ZONE.includes(positionTeam)
      ? 'rgba(19, 207, 0, 0.65)'
      : ZonesClassificationTable.RELEGATION_ZONE.includes(positionTeam)
      ? 'rgba(216, 25, 32, 0.65)'
      : backgroundColorIfZonaCentral
  }

  const colorRow = (positionTeam: number) => {
    return ZonesClassificationTable.G4_ZONE.includes(positionTeam) ||
      ZonesClassificationTable.RELEGATION_ZONE.includes(positionTeam)
      ? 'white'
      : 'black'
  }

  const borderStyle = (positionTeam: number) => {
    return ZonesClassificationTable.G4_ZONE.includes(positionTeam) ||
      ZonesClassificationTable.RELEGATION_ZONE.includes(positionTeam)
      ? '1px solid #999'
      : 'none'
  }

  const handleChangeZonesInTable = async (
    _: React.SyntheticEvent,
    zonesInTable: string
  ) => {
    setZonesInTable(zonesInTable)
  }

  if (isLoading)
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Skeleton
          variant="circular"
          height={100}
          width={100}
          sx={{ backgroundColor: 'grey.900' }}
        />
        <Skeleton
          animation="wave"
          height={30}
          width="20%"
          sx={{ backgroundColor: 'grey.900' }}
        />
        <Skeleton
          variant="rectangular"
          animation="wave"
          height={60}
          width="100%"
          sx={{ backgroundColor: 'grey.900' }}
        />
        <Skeleton
          variant="rectangular"
          animation="wave"
          height={300}
          width="100%"
          sx={{ mt: 1, backgroundColor: 'grey.900' }}
        />
      </Box>
    )

  if (errorMessage) return <ErrorComponent errorMessage={errorMessage} />

  if (
    !brazueraoTable ||
    brazueraoTable.length === 0 ||
    !brazilianTable ||
    brazilianTable.length === 0
  )
    return (
      <Container fixed>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: 5,
          }}
        >
          <Typography>
            {' '}
            Nenhum dado encontrado de apostas do {username}
          </Typography>
        </Box>
      </Container>
    )

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: 'grey.900' }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => router.push('/')}
            >
              <ArrowBackOutlinedIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      <Container fixed>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Tabs
            value={zonesInTable}
            onChange={handleChangeZonesInTable}
            aria-label="tabs brazuerao table"
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            centered
            sx={{
              backgroundColor: 'black',
              color: 'white',
              width: '85vw',
              border: '1px solid gray',
            }}
          >
            <Tab
              label="Zonas Customizadas (Planilha)"
              value="planilha"
              tabIndex={0}
            />
            <Tab
              label="Zonas Original (Tabela GE)"
              value="original"
              tabIndex={1}
            />
          </Tabs>
          <TableContainer
            component={Paper}
            style={{ width: '85vw', border: '1px solid white' }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'black',
                color: 'white',
                py: 1,
                borderBottom: '1px solid white',
              }}
            >
              <Typography>Classificação - Aposta {username}</Typography>
            </Box>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <StyledTableCell />
                  <StyledTableCell align="center">
                    Classificação - Aposta
                  </StyledTableCell>
                  <StyledTableCell align="center" />
                  <StyledTableCell align="center">
                    Classificação - Tempo Real
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {brazueraoTable.map((row, index) => (
                  <StyledTableRow
                    sx={{
                      borderTop: borderStyle(index + 1),
                      borderBottom: borderStyle(index + 1),
                    }}
                  >
                    <StyledTableCell
                      align="center"
                      component="th"
                      scope="row"
                      size="small"
                      sx={{
                        backgroundColor: backgroundColorRow(index + 1),
                        color: colorRow(index + 1),
                      }}
                    >
                      <b>{index + 1}º</b>
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      component="th"
                      scope="row"
                      sx={{ width: '40vw' }}
                    >
                      {row}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {brazilianTable.findIndex(
                        (item) => item.nomePopular === row
                      ) == index ? (
                        <CheckIcon fontSize="small" />
                      ) : (
                        <CancelIcon fontSize="small" />
                      )}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      component="th"
                      scope="row"
                      sx={{ width: '40vw' }}
                    >
                      {brazilianTable[index].nomePopular}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </>
  )
}
