import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import OpenInNewIcon from '@mui/icons-material/OpenInNewRounded'
import { Tooltip } from '@mui/material'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { IBetUserClassification } from '@/interfaces'
import {
  generateRowOfTableBrazuerao,
  getDisplayName,
} from '@/services/brazuerao.service'

const StyledTableCell: any = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
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

interface IRowComponent {
  betClassificationUser: IBetUserClassification
  isFirst: boolean
  isLast: boolean
}

export function RowComponent({
  betClassificationUser,
  isFirst,
  isLast,
}: IRowComponent) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const {
    position,
    score,
    username,
    isCurrentChampionCorrect,
    teamsInCorrectsPositions,
    teamsInCorrectZones,
  } = betClassificationUser
  const row = generateRowOfTableBrazuerao(
    position,
    username,
    score,
    isCurrentChampionCorrect,
    teamsInCorrectsPositions,
    teamsInCorrectZones
  )

  const backgroundColorRow = isFirst
    ? 'rgba(19, 207, 0, 0.65)'
    : isLast
      ? 'rgba(216, 25, 32, 0.65)'
      : 'white'
  const colorRow = isFirst || isLast ? 'white' : 'black'
  const borderStyle = isFirst || isLast ? '1px solid #999' : 'none'

  return (
    <>
      <StyledTableRow
        sx={{ borderTop: borderStyle, borderBottom: borderStyle }}
      >
        <StyledTableCell
          align="center"
          component="th"
          scope="row"
          size="small"
          sx={{ backgroundColor: backgroundColorRow, color: colorRow }}
        >
          <b>{row.position}º</b>
        </StyledTableCell>
        <StyledTableCell
          align="center"
          component="th"
          scope="row"
          sx={{ width: '40vw' }}
        >
          {getDisplayName(row.name)}
        </StyledTableCell>
        <StyledTableCell align="center" sx={{ width: '10vw' }}>
          {row.score}
        </StyledTableCell>
        <StyledTableCell align="center" sx={{ width: '10vw' }}>
          {row.isCurrentChampionCorrect ? 'Sim' : 'Não'}
        </StyledTableCell>
        <StyledTableCell align="center" sx={{ width: '10vw' }}>
          {row.numberOfTeamsInCorrectPosition}
        </StyledTableCell>
        <StyledTableCell align="center" sx={{ width: '10vw' }}>
          {row.numberOfTeamsInCorrectZone}
        </StyledTableCell>
        <StyledTableCell align="center" sx={{ width: '20vw' }}>
          <Tooltip title="Visualizar times que pontuaram.">
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title={`Abrir classificação apostada do ${row.name}`}>
            <IconButton
              aria-label="bet details row"
              size="small"
              onClick={() =>
                router.push(`/bet-status?user=${row.name.toLowerCase()}`)
              }
            >
              <OpenInNewIcon />
            </IconButton>
          </Tooltip>
        </StyledTableCell>
      </StyledTableRow>
      <StyledTableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="scoreOfUser">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Descrição</TableCell>
                    <TableCell align="center">Contagem</TableCell>
                    <TableCell align="center">Times</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.userStatus.map((userStatusRow) => (
                    <TableRow key={userStatusRow.description}>
                      <TableCell
                        align="left"
                        component="th"
                        scope="row"
                        sx={{ width: '20vw' }}
                      >
                        {userStatusRow.description}
                      </TableCell>
                      <TableCell align="center" sx={{ width: '5vw' }}>
                        {userStatusRow.count}
                      </TableCell>
                      <TableCell align="center" sx={{ width: '75vw' }}>
                        {userStatusRow.value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </StyledTableRow>
    </>
  )
}
