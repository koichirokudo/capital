import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Image from 'next/image'
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from '@mui/material'
import {
  Menu,
  Mail,
  Notifications,
  AccountCircle,
  ChevronLeft,
} from '@mui/icons-material'

const Header = () => {
  // TODO: useAuthCotext()を導入
  // const { authUser, isLoading } = useAuthContext()
  const [open, setOpen] = React.useState<boolean>(false)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const list = (
    // TODO: アイコンとLinkを導入する
    <List>
      {[
        '収入登録・編集',
        '支出登録・編集',
        '月別レポート',
        'カテゴリ別レポート',
        'ユーザープロフィール',
        'ユーザー情報一覧',
        'ログアウト',
      ].map((text) => (
        <ListItem key={text}>
          <ListItemButton>
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ mr: 3 }}
            onClick={handleDrawerOpen}
          >
            <Menu sx={{ color: 'white' }} />
          </IconButton>
          <Image src="/logo.png" width={200} height={60} alt="MyCapi" />
          <Box sx={{ flexGrow: 1 }} />
          <IconButton size="large" aria-label="mail">
            <Mail sx={{ color: 'white' }} />
          </IconButton>
          <IconButton size="large" aria-label="notifications">
            <Notifications sx={{ color: 'white' }} />
          </IconButton>
          <IconButton size="large" aria-label="account">
            <AccountCircle sx={{ color: 'white' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={handleDrawerClose}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeft color="inherit" />
          </IconButton>
          <Divider />
        </Toolbar>
        {list}
      </Drawer>
    </Box>
  )
}

export default Header
