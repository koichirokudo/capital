import * as React from 'react'
import Image from 'next/image'
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import { Menu, Mail, Notifications, AccountCircle } from '@mui/icons-material'

const drawerWidth = 240

interface TemplateProps {
  window?: () => Window
  title: string
  children?: React.ReactNode
}

const Template = (props: TemplateProps) => {
  // TODO: useAuthCotext()を導入
  // const { authUser, isLoading } = useAuthContext()
  const { window, title, children } = props
  const [open, setOpen] = React.useState<boolean>(false)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const list = (
    // TODO: アイコンとLinkを導入する
    <div>
      <Box sx={{ mt: 1, ml: 2 }}>
        <Image src="/logo.png" width={190} height={50} alt="MyCapi" />
      </Box>
      <Divider />
      <List>
        {[
          'ダッシュボード',
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
    </div>
  )

  const container = window !== undefined ? () => document.body : undefined

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            onClick={handleDrawerOpen}
          >
            <Menu
              sx={{ color: 'white', display: { xs: 'block', sm: 'none' } }}
            />
          </IconButton>
          <Typography variant="h5" color="white">
            {title}
          </Typography>
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
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={open}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
          }}
        >
          {list}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {list}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}

export default Template
