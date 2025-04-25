import { ErrorComponent } from '@/components/Error'
import { TableComponent } from '@/components/Table'
import { TabPanel } from '@/components/TabPanel'
import { LocalStorageKeysCache } from '@/configs'
import { IBetUserClassification } from '@/interfaces'
import {
  calculateUsersBetScores,
  getDisplayName,
  getLastUserScores,
  getUrlPhotoUrl,
} from '@/services/brazuerao.service'
import localStorageService from '@/services/localStorage.service'
import SearchRounded from '@mui/icons-material/SearchRounded'
import {
  Avatar,
  Box,
  Button,
  Container,
  Skeleton,
  Typography,
} from '@mui/material'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { Roboto } from 'next/font/google'
import Image from 'next/image'
import { useState } from 'react'

const inter = Roboto({ weight: '400', subsets: ['latin'] })

export default function Home() {
  const [usersScore, setUsersScore] = useState<IBetUserClassification[]>([])
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [zonesInTable, setZonesInTable] = useState('planilha')

  const generateBrazueraoClassification = async (
    modeZonesInTable: string = zonesInTable
  ) => {
    try {
      setIsLoading(true)
      setErrorMessage('')
      const useOriginalZonesInTable = modeZonesInTable
        .toUpperCase()
        .includes('ORIGINAL')
      const betUsersClassification = await calculateUsersBetScores(
        useOriginalZonesInTable
      )
      setUsersScore(betUsersClassification)
    } catch (error) {
      setErrorMessage((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshBrazueraoClassification = async () => {
    localStorageService.deleteItem(
      LocalStorageKeysCache.BRASILEIRAO_LEAGUE_SERVICE_GET_TABLE
    )
    await generateBrazueraoClassification()
  }

  const handleChangeZonesInTable = async (
    _: React.SyntheticEvent,
    zonesInTable: string
  ) => {
    setZonesInTable(zonesInTable)
    await generateBrazueraoClassification(zonesInTable)
  }

  const renderLoadingBrazueraoTable = () => {
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
        >
          <Avatar />
        </Skeleton>
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
        >
          <Tabs />
        </Skeleton>
        <Skeleton
          variant="rectangular"
          animation="wave"
          height={300}
          width="100%"
          sx={{ mt: 1, backgroundColor: 'grey.900' }}
        >
          <TableComponent betClassificationUsers={[]} />
        </Skeleton>
      </Box>
    )
  }

  const onResetError = () => {
    setErrorMessage('')
    window.location.reload
  }

  if (errorMessage)
    return <ErrorComponent errorMessage={errorMessage} onReset={onResetError} />

  return (
    <>
      <main className={`${inter.className}`}>
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
            <Image
              src="/brasileirao-serie-a-logo.jpg"
              className="logo"
              alt="Brasileirão logo"
              width={480}
              height={270}
              priority
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADA..."
              sizes="(min-width: 60em) 24vw,
                      (min-width: 28em) 45vw,
                      100vw"
            />
            <Typography variant="h3" sx={{ paddingY: 3, textAlign: 'center' }}>
              Brazuerão Apostas
            </Typography>
            {usersScore.length > 0 && (
              <Typography variant="body1">
                Atualizado em{' '}
                {`${new Date().getDate()}/${(new Date().getMonth() + 1)
                  .toString()
                  .padStart(2, '0')}/${new Date().getFullYear()}`}
              </Typography>
            )}
          </Box>
          {isLoading ? (
            renderLoadingBrazueraoTable()
          ) : usersScore.length > 0 ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <>
                <Typography variant="body1">
                  Pagador(es) (até agora):{' '}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    mt: 2,
                  }}
                >
                  {getLastUserScores(usersScore).map((userScore) => {
                    return (
                      <Box
                        key={userScore.username}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'column',
                          mx: 2,
                        }}
                      >
                        <Avatar
                          alt={userScore.username}
                          src={getUrlPhotoUrl(userScore.username)}
                          sx={{
                            width: 60,
                            height: 60,
                            backgroundColor: 'red',
                            mb: 1,
                          }}
                          variant="rounded"
                        />
                        <b>
                          {getDisplayName(userScore.username).toUpperCase()}
                        </b>
                      </Box>
                    )
                  })}
                </Box>
              </>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 5 }}>
                <Tabs
                  value={zonesInTable}
                  onChange={handleChangeZonesInTable}
                  aria-label="tabs brazuerao table"
                  indicatorColor="secondary"
                  textColor="inherit"
                  variant="fullWidth"
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
              </Box>
              <TabPanel tabName="original" tabNameActive={zonesInTable}>
                <TableComponent
                  betClassificationUsers={usersScore}
                  onUpdate={refreshBrazueraoClassification}
                />
              </TabPanel>
              <TabPanel tabName="planilha" tabNameActive={zonesInTable}>
                <TableComponent
                  betClassificationUsers={usersScore}
                  onUpdate={refreshBrazueraoClassification}
                />
              </TabPanel>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button
                onClick={async () => await generateBrazueraoClassification()}
                color="success"
                variant="contained"
                startIcon={<SearchRounded />}
              >
                Visualizar Classificação
              </Button>
            </Box>
          )}
        </Container>
      </main>
    </>
  )
}
