import { ErrorComponent } from '@/components/Error'
import { ZonesClassificationTable } from '@/configs/zones-classification-table'
import { ITeamPositionInfo } from '@/interfaces'
import {
  getBrazilianTable,
  getBrazueraoTableByUser,
  getTeamsInCorrectZones,
  getUrlPhotoUrl,
} from '@/services/brazuerao.service'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckIcon from '@mui/icons-material/Check'
import {
  AppBar,
  Avatar,
  Box,
  Container,
  Skeleton,
  Tab,
  Tabs,
  Toolbar,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

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
    // backgroundColor: theme.palette.action.hover,
  },
}))

interface IBetStatusDetail {
  username: string
}

export default function BetStatusDetail({ username }: IBetStatusDetail) {
  const router = useRouter()
  const [brazueraoTable, setBrazueraoTable] = useState<string[]>([])
  const [brazilianTable, setBrazilianTable] = useState<ITeamPositionInfo[]>([])
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
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
  }, [username])

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

  const getTeamsInCorrectZonesByUser = () => {
    return getTeamsInCorrectZones(
      brazilianTable,
      brazueraoTable,
      !zonesInTable.includes('planilha')
    )
  }

  const renderIfIsLoadingPage = () => {
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
          variant="rectangular"
          animation="wave"
          height={60}
          width="85vw"
          sx={{ backgroundColor: 'grey.900' }}
        />
        <Skeleton
          variant="rectangular"
          animation="wave"
          height={300}
          width="85vw"
          sx={{ mt: 1, backgroundColor: 'grey.900' }}
        />
      </Box>
    )
  }

  const onResetError = () => {
    setErrorMessage('')
    window.location.reload
  }

  if (errorMessage)
    return <ErrorComponent errorMessage={errorMessage} onReset={onResetError} />

  if (
    !isLoading &&
    (!brazueraoTable ||
      brazueraoTable.length === 0 ||
      !brazilianTable ||
      brazilianTable.length === 0)
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
      <Box sx={{ flexGrow: 1, mb: 5 }}>
        <AppBar position="static" sx={{ backgroundColor: 'grey.900' }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() =>
                router.push({
                  pathname: '/',
                  query: { forceRefresh: true },
                })
              }
            >
              <ArrowBackOutlinedIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      <Container fixed>
        {isLoading ? (
          renderIfIsLoadingPage()
        ) : (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                width: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  width: '10vw',
                  mx: 10,
                  my: 2,
                }}
              >
                <Avatar
                  alt={username}
                  src={getUrlPhotoUrl(username)}
                  sx={{ width: 60, height: 60, backgroundColor: 'red', m: 1 }}
                  variant="circular"
                />
                <Typography variant="body1">
                  <b>{username}</b>
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                  width: '90vw',
                }}
              >
                <Typography variant="h6" sx={{ mx: 5 }}>
                  Times em zonas corretas:
                </Typography>
                <Typography variant="body2">
                  {getTeamsInCorrectZonesByUser().join(', ')}
                </Typography>
              </Box>
            </Box>
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
                      <StyledTableCell align="center">
                        Posição Correta?
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Classificação - Tempo Real
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {brazueraoTable.map((row, index) => (
                      <StyledTableRow
                        key={row}
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
                          sx={{
                            width: '40vw',
                            backgroundColor:
                              getTeamsInCorrectZonesByUser().includes(row)
                                ? 'grey.200'
                                : 'inherit',
                          }}
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
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <Typography>Legenda:</Typography>
                <Box
                  sx={{
                    backgroundColor: 'grey.200',
                    width: 10,
                    height: 10,
                    marginLeft: 5,
                    marginRight: 1,
                  }}
                />
                <Typography>Times em zonas corretas</Typography>
              </Box>
            </Box>
          </>
        )}
      </Container>
    </>
  )
}

export async function getServerSideProps(context: any) {
  const { user } = context.query
  console.log(`Fetched user: ${user}`)
  return {
    props: {
      username:
        (user as string)?.charAt(0).toUpperCase() + (user as string)?.slice(1),
    },
  }
}
