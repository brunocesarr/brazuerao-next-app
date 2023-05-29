import { ErrorComponent } from '@/components/Error';
import { TableComponent } from '@/components/Table';
import { LocalStorageKeysCache } from '@/configs';
import { IBetUserClassification } from '@/interfaces';
import { calculateUsersBetScores, getUrlPhotoUrl } from '@/services/brazuerao.service';
import localStorageService from '@/services/localStorage.service';
import SearchRounded from '@mui/icons-material/SearchRounded';
import { Avatar, Box, Button, Container, Skeleton, Typography } from '@mui/material';
import { Rakkas } from 'next/font/google';
import Head from 'next/head';
import { useState } from 'react';

const inter = Rakkas({ weight: "400", subsets: ['latin'] })

export default function Home() {
  const [usersScore, setUsersScore] = useState<IBetUserClassification[]>([])
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const generateBrazueraoClassification = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const betUsersClassification = await calculateUsersBetScores();
      setUsersScore(betUsersClassification)
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  const refreshBrazueraoClassification = async () => {
    localStorageService.deleteItem(LocalStorageKeysCache.BRASILEIRAO_LEAGUE_SERVICE_GET_TABLE);
    await generateBrazueraoClassification();
  }

  if (errorMessage)
    return <ErrorComponent errorMessage={errorMessage} />;

  return (
    <>
      <Head>
        <title>{ `Brazuerao Apostas - ${new Date().getFullYear()}` }</title>
        <meta name="description" content="Republica TDT - Brazuerão Apostas" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <main className={`${inter.className}`}>
        <Container fixed>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: 5 }}>
            <img src="https://e1.pxfuel.com/desktop-wallpaper/441/284/desktop-wallpaper-confirmado-presidente-da-cbf-anuncia-datas-do-brasileirao-e-copa-do-brasil-canal-flu-news-campeonato-brasileiro-serie-a.jpg" className="logo" alt="Brasileirão logo" style={{ width: '45%' }}/>
            <Typography variant='h3' sx={{ paddingY: 3, textAlign: 'center' }}>Brazuerão Apostas</Typography>
            { usersScore.length > 0 && <Typography variant='body1'>Atualizado em {`${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`}</Typography>}
          </Box>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',flexDirection: 'column' }}>
              <Skeleton variant="circular" height={100} width={100} sx={{ backgroundColor: 'grey.900' }}>
                <Avatar />
              </Skeleton>
              <Skeleton animation="wave" height={30} width="20%" sx={{ backgroundColor: 'grey.900' }} />
              <Skeleton variant="rectangular" animation="wave" height={300} width="100%" sx={{ backgroundColor: 'grey.900' }}>
                <TableComponent betClassificationUsers={[]} />
              </Skeleton>
            </Box>  
          ) : usersScore.length > 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <>
                <Avatar
                  alt={usersScore[usersScore.length - 1].username}
                  src={getUrlPhotoUrl(usersScore[usersScore.length - 1].username)}
                  sx={{ width: 56, height: 56, backgroundColor: 'red' }}
                />
                <Typography variant='body1'>Pagador (até agora): <b>{usersScore[usersScore.length - 1].username.toUpperCase()}</b></Typography>
              </>
              <TableComponent betClassificationUsers={usersScore} onUpdate={refreshBrazueraoClassification} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Button onClick={generateBrazueraoClassification} color='success' variant="contained" startIcon={<SearchRounded />}>
                Visualizar Classificação
              </Button>
            </Box>            
          )}
        </Container>
      </main>
    </>
  )
}
