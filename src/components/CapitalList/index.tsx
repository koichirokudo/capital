/* eslint-disable react-hooks/exhaustive-deps */
import process from 'process'
import { Cancel, Delete, Edit, Save } from '@mui/icons-material'
import {
  Alert,
  AlertProps,
  Box,
  Paper,
  Select,
  SelectChangeEvent,
  Snackbar,
} from '@mui/material'
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridColumns,
  GridEventListener,
  GridRenderCellParams,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridToolbar,
  GridValueFormatterParams,
  jaJP,
  MuiEvent,
  useGridApiContext,
} from '@mui/x-data-grid'
import { useSpinnerActionsContext } from 'contexts/SpinnerContext'
import * as React from 'react'
import deleteCapital from 'services/capitals/delete-capital'
import updateCapital from 'services/capitals/update-capital'
import { ApiContext } from 'types'
import { AxiosError } from 'axios'
import { adjustTimezone, formattedISO8601 } from 'utils/format'
import { EXPENSES, INCOME, SHARE } from '../../const'
import { useFinancialTransactionsContext } from '../../contexts/FinancialTransactionsContext'

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_PATH || '/api/proxy',
}

/**
 * 収支一覧をDatagridで表示
 */
const CapitalList = ({ capitals, mutate }: never) => {
  const setSpinner = useSpinnerActionsContext()
  const { incomeItem, expensesItem } = useFinancialTransactionsContext()

  // 行のモードを制御する変数（表示モード/編集モード）
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {},
  )

  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null)

  const SelectShareEditInputCell = (props: GridRenderCellParams) => {
    const { id, value, field } = props
    const apiRef = useGridApiContext()
    const handleChange = async (event: SelectChangeEvent) => {
      await apiRef.current.setEditCellValue({
        id,
        field,
        value: event.target.value,
      })
    }
    return (
      <Select
        value={value}
        onChange={handleChange}
        size="small"
        sx={{ height: 1 }}
        native
        autoFocus
      >
        <option value="true">はい</option>
        <option value="false">いいえ</option>
      </Select>
    )
  }

  /**
   * SelectShareEditInputCellのラッパー関数
   * @param params
   */
  const renderSelectShareEditInputCell: GridColDef['renderCell'] = (
    params,
  ) => {
    return <SelectShareEditInputCell {...params} />
  }

  /**
   * 収支タイプをDataGridのセル内で表示する
   * @param props
   * @returns
   */
  const SelectCapitalTypeEditInputCell = (props: GridRenderCellParams) => {
    const { id, value, field } = props
    const apiRef = useGridApiContext()

    const handleChange = async (event: SelectChangeEvent) => {
      await apiRef.current.setEditCellValue({
        id,
        field,
        value: event.target.value,
      })
    }

    return (
      <Select
        value={value}
        onChange={handleChange}
        size="small"
        sx={{ height: 1 }}
        native
        autoFocus
      >
        <option value={INCOME}>収入</option>
        <option value={EXPENSES}>支出</option>
      </Select>
    )
  }

  /**
   * SelectCapitalTypeEditInputCellのラッパー関数
   * @param params
   * @returns
   */
  const renderSelectCapitalTypeEditInputCell: GridColDef['renderCell'] = (
    params,
  ) => {
    return <SelectCapitalTypeEditInputCell {...params} />
  }

  /**
   * カテゴリをDataGridのセル内で表示する
   * @param props
   * @returns
   */
  const SelectCategoryEditInputCell = (props: GridRenderCellParams) => {
    const { id, value, field, row } = props
    const apiRef = useGridApiContext()
    const isIncome = row.capitalType == INCOME
    const availableItems = isIncome ? incomeItem : expensesItem
    const handleChange = async (event: SelectChangeEvent) => {
      await apiRef.current.setEditCellValue({
        id,
        field,
        value: parseInt(event.target.value, 10),
      })
    }
    return (
      <Select
        value={value}
        onChange={handleChange}
        size="small"
        sx={{ height: 1 }}
        native
        autoFocus
      >
        {availableItems?.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </Select>
    )
  }

  /**
   * SelectCategoryEditInputCellのラッパー関数
   * @param params
   * @returns
   */
  const renderSelectCategoryEditInputCell: GridColDef['renderCell'] = (
    params,
  ) => {
    return <SelectCategoryEditInputCell {...params} />
  }

  // 行編集時にMUIイベントハンドラーのデフォルト動作を無効にする
  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>,
  ) => {
    event.defaultMuiPrevented = true
  }

  // 行編集終了時にMUIイベントハンドラーのデフォルト動作を無効にする
  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event,
  ) => {
    event.defaultMuiPrevented = true
  }

  // 編集アイコンをクリックした行を表示モードから編集モードへ切り替える
  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  // 保存アイコンをクリックした行を編集モードから表示モードに切り替える
  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  // 収支情報を削除するイベント
  const handleDeleteClick = (id: GridRowId) => async () => {
    try {
      setSpinner(true)
      await deleteCapital(id)
      mutate()
      setSnackbar({
        children: '収支情報の削除に成功しました。',
        severity: 'success',
      })
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setSnackbar({
          children:
            '収支情報の削除に失敗しました。もう一度やり直してください。',
          severity: 'error',
        })
      }
    } finally {
      setSpinner(false)
    }
  }

  // 編集キャンセル
  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })
  }

  const handleCloseSnackbar = () => setSnackbar(null)

  // handleSaveClick実行後に、実行される
  // 更新前に呼び出される関数
  const processRowUpdate = React.useCallback(
    async (newRow: GridRowModel) => {
      const date = new Date(newRow.date)
      adjustTimezone(date)
      newRow.date = formattedISO8601(date)
      setSpinner(true)
      const res = await updateCapital(newRow)
      mutate()
      setSpinner(false)
      setSnackbar({ children: '編集内容を保存しました。', severity: 'success' })
      return res
    },
    [context, setSpinner],
  )

  // processRowUpdateで更新失敗した場合に呼び出される関数
  const handleProcessRowUpdateError = React.useCallback(() => {
    setSpinner(false)
    setSnackbar({
      children: '編集内容の保存に失敗しました。もう一度やり直してください。',
      severity: 'error',
    })
  }, [setSpinner])

  const columns: GridColumns = [
    {
      field: 'date',
      headerName: '日時',
      width: 120,
      type: 'date',
      editable: true,
      valueFormatter: (params: GridValueFormatterParams) => {
        if (!params.value) {
          return params.value
        }
        const date = new Date(params.value)
        const year = date.getFullYear()
        const month = ('0' + (date.getMonth() + 1)).slice(-2)
        const day = ('0' + date.getDate()).slice(-2)
        return `${year}/${month}/${day}`
      },
    },
    {
      field: 'share',
      headerName: '共有',
      width: 100,
      editable: true,
      renderEditCell: renderSelectShareEditInputCell,
      valueFormatter: (params: GridValueFormatterParams) => {
        return params.value === SHARE ? 'はい' : 'いいえ'
      },
    },
    {
      field: 'user',
      headerName: '更新者',
      width: 180,
      editable: false,
      valueFormatter: (params: GridValueFormatterParams) => {
        return params.value.name
      },
    },
    {
      field: 'capitalType',
      headerName: '収支',
      width: 80,
      editable: true,
      renderEditCell: renderSelectCapitalTypeEditInputCell,
      valueFormatter: (params: GridValueFormatterParams) => {
        return params.value === INCOME ? '収入' : '支出'
      },
    },
    {
      field: 'financialTransactionId',
      headerName: '支出項目',
      width: 150,
      editable: true,
      renderEditCell: renderSelectCategoryEditInputCell,
      valueFormatter: (params: GridValueFormatterParams) => {
        const combinedItems = [...(incomeItem ?? []), ...(expensesItem ?? [])]
        const item = combinedItems.find((i) => i.id === params.value)
        return item?.label
      },
    },
    {
      field: 'money',
      headerName: '金額',
      width: 120,
      type: 'number',
      editable: true,
    },
    { field: 'note', headerName: 'メモ', editable: true, width: 200 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'アクション',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            // eslint-disable-next-line react/jsx-key
            <GridActionsCellItem
              icon={<Save />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            // eslint-disable-next-line react/jsx-key
            <GridActionsCellItem
              icon={<Cancel />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ]
        }

        return [
          // eslint-disable-next-line react/jsx-key
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          // eslint-disable-next-line react/jsx-key
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ]
      },
    },
  ]

  return (
    <Paper>
      <Box sx={{ height: '700px', width: '100%' }}>
        <DataGrid
          rows={capitals}
          getRowId={(row) => row.id}
          columns={columns}
          editMode="row"
          rowHeight={30}
          pageSize={20}
          rowsPerPageOptions={[20, 40, 100]}
          pagination
          localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
          rowModesModel={rowModesModel}
          onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          components={{ Toolbar: GridToolbar }}
          experimentalFeatures={{ newEditingApi: true }}
          initialState={{
            sorting: {
              sortModel: [
                {
                  field: 'date',
                  sort: 'desc',
                },
              ],
            },
          }}
        />
        {!!snackbar && (
          <Snackbar
            open
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            onClose={handleCloseSnackbar}
            autoHideDuration={6000}
          >
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}
      </Box>
    </Paper>
  )
}

export default CapitalList
