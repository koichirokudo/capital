import * as React from 'react'
import Link from 'components/link/indext'
import Image from 'next/image'
import {
  AppBar,
  Box,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import {
  Menu,
  Notifications,
  AccountCircle,
  Person,
  Dashboard,
  CurrencyYen,
  BarChart,
  Logout,
  Category,
} from '@mui/icons-material'
import { useAuthContext } from 'contexts/AuthContext'

const drawerWidth = 270

interface TemplateProps {
  window?: () => Window
  title?: string
  children?: React.ReactNode
}

const Template = (props: TemplateProps) => {
  const { authUser, isLoading } = useAuthContext()
  const { window, title, children } = props
  const [open, setOpen] = React.useState<boolean>(false)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const list = (
    <div>
      <Box sx={{ mt: 1, ml: 2 }}>
        <Image src="/logo.png" width={190} height={50} alt="MyCapi" />
      </Box>
      <Divider />
      <List>
        <Link href="/dashboard">
          <ListItemButton>
            <ListItemIcon>
              <Dashboard sx={{ ml: 1 }} />
            </ListItemIcon>
            <ListItem>
              <ListItemText primary="ダッシュボード" />
            </ListItem>
          </ListItemButton>
        </Link>
        <Link href="/income">
          <ListItemButton>
            <ListItemIcon>
              <CurrencyYen sx={{ ml: 1 }} />
            </ListItemIcon>
            <ListItem>
              <ListItemText primary="収入登録・編集" />
            </ListItem>
          </ListItemButton>
        </Link>
        <Link href="/outgo">
          <ListItemButton>
            <ListItemIcon>
              <CurrencyYen sx={{ ml: 1 }} />
            </ListItemIcon>
            <ListItem>
              <ListItemText primary="支出登録・編集" />
            </ListItem>
          </ListItemButton>
        </Link>
        <Link href="/report/month">
          <ListItemButton>
            <ListItemIcon>
              <BarChart sx={{ ml: 1 }} />
            </ListItemIcon>
            <ListItem>
              <ListItemText primary="月別レポート" />
            </ListItem>
          </ListItemButton>
        </Link>
        <Link href="/report/category">
          <ListItemButton>
            <ListItemIcon>
              <Category sx={{ ml: 1 }} />
            </ListItemIcon>
            <ListItem>
              <ListItemText primary="カテゴリ別レポート" />
            </ListItem>
          </ListItemButton>
        </Link>
        <Link href="/logout">
          <ListItemButton>
            <ListItemIcon>
              <Logout sx={{ ml: 1 }} />
            </ListItemIcon>
            <ListItem>
              <ListItemText primary="ログアウト" />
            </ListItem>
          </ListItemButton>
        </Link>
      </List>
    </div>
  )

  const container = window !== undefined ? () => document.body : undefined

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          ...(authUser && {
            width: {
              sm: `calc(100% - ${drawerWidth}px)`,
              ml: { sm: `${drawerWidth}px` },
            },
          }),
        }}
      >
        <Toolbar>
          {(() => {
            if (authUser) {
              return (
                <IconButton
                  size="large"
                  edge="start"
                  aria-label="menu"
                  onClick={handleDrawerOpen}
                >
                  <Menu
                    sx={{
                      color: 'white',
                      display: { xs: 'block', sm: 'none' },
                    }}
                  />
                </IconButton>
              )
            } else if (!authUser) {
              return (
                <Image src="/logo.png" width={190} height={50} alt="MyCapi" />
              )
            }
          })()}
          <Typography variant="h5" color="white">
            {title}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton size="large" aria-label="notifications">
            <Notifications sx={{ color: 'white' }} />
          </IconButton>
          {(() => {
            // 認証済み
            if (authUser) {
              return (
                <Link href={`/users/${authUser.userId}`}>
                  <IconButton size="large" aria-label="account">
                    <AccountCircle sx={{ color: 'white' }} />
                  </IconButton>
                </Link>
              )
            } else if (isLoading) {
              // ロード中
              return <CircularProgress />
            } else {
              // 認証していない
              return (
                <Link href="/login">
                  <IconButton size="large" aria-label="account">
                    <Person sx={{ color: 'white' }} />
                  </IconButton>
                </Link>
              )
            }
          })()}
        </Toolbar>
      </AppBar>
      {authUser && (
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
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ...(authUser && {
            width: {
              sm: `calc(100% - ${drawerWidth}px)`,
            },
          }),
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}

export default Template
