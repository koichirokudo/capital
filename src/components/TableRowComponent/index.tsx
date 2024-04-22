import { TableCell, TableRow } from '@mui/material'
import { formatMoney } from '../../utils/format'
import React from 'react'

/**
 * テーブルの行コンポーネント
 */
export type TableRowComponentProps = {
  /**
   * ラベル
   */
  label: string
  /**
   * 値
   */
  values: number[]
}

const TableRowComponent = ({ label, values }: TableRowComponentProps) => (
  <TableRow>
    <TableCell>{label}</TableCell>
    {values.map((value, index) => (
      <TableCell align="left" key={index}>
        {formatMoney(value, true)}
      </TableCell>
    ))}
  </TableRow>
)

export default TableRowComponent