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
import Tooltip from '@mui/material/Tooltip'

import { IBetUserClassification } from '../../interfaces'
import { RowComponent } from './RowComponent'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

interface ITableComponentProps {
  betClassificationUsers: IBetUserClassification[]
  onUpdate?: () => Promise<void>
}

export function TableComponent({
  betClassificationUsers,
  onUpdate,
}: ITableComponentProps) {
  return (
    <TableContainer
      component={Paper}
      style={{ width: '85vw', border: '1px solid white' }}
    >
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <StyledTableCell />
            <StyledTableCell align="center">Nome</StyledTableCell>
            <StyledTableCell align="center" sx={{ width: '5px' }}>
              Pontuação
            </StyledTableCell>
            <StyledTableCell align="center">
              Acertou o Time Campeão
            </StyledTableCell>
            <StyledTableCell align="center">
              Nº de Times na Posição Correta
            </StyledTableCell>
            <StyledTableCell align="center">
              Nº de Times na Zona Correta
            </StyledTableCell>
            <StyledTableCell align="right">
              {onUpdate && (
                <Tooltip title="Atualizar">
                  <IconButton
                    aria-label="update-rounded"
                    color="success"
                    onClick={onUpdate}
                  >
                    <Update />
                  </IconButton>
                </Tooltip>
              )}
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {betClassificationUsers.map((betClassificationUser) => (
            <RowComponent
              key={betClassificationUser.username}
              betClassificationUser={betClassificationUser}
              isFirst={betClassificationUser.position === 1}
              isLast={
                betClassificationUser.position === betClassificationUsers.length
              }
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
