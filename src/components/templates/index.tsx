import * as React from 'react'
import Link from 'components/Link/indext'
import Image from 'next/image'
import {
  AppBar as MuiAppBar,
  Avatar,
  Box,
  CircularProgress,
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  styled,
  Toolbar,
  Typography,
} from '@mui/material'
import {
  Menu,
  Notifications,
  AccountCircle,
  Person,
  CurrencyYen,
  BarChart,
  Logout,
  Category,
  ChevronLeft,
} from '@mui/icons-material'
import { useAuthContext } from 'contexts/AuthContext'

const drawerWidth = 240

interface TemplateProps {
  window?: () => Window
  title?: string
  children?: React.ReactNode
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'noWrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(3),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(7.5),
      },
    }),
  },
}))

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
    <>
      <List>
        <Link href={`/capital`}>
          <ListItemButton>
            <CurrencyYen />
            <ListItem sx={{ ml: 1 }}>
              <ListItemText primary="収支登録・編集" />
            </ListItem>
          </ListItemButton>
        </Link>
        <Link href="/report/year">
          <ListItemButton>
            <BarChart />
            <ListItem sx={{ ml: 1 }}>
              <ListItemText primary="年間レポート" />
            </ListItem>
          </ListItemButton>
        </Link>
        <Link href="/report/monthly">
          <ListItemButton>
            <Category />
            <ListItem sx={{ ml: 1 }}>
              <ListItemText primary="月間レポート" />
            </ListItem>
          </ListItemButton>
        </Link>
        <Link href={`/calculate/${authUser?.groupId}`}>
          <ListItemButton>
            <Logout />
            <ListItem sx={{ ml: 1 }}>
              <ListItemText primary="精算" />
            </ListItem>
          </ListItemButton>
        </Link>
      </List>
    </>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="absolute" open={open}>
        <Toolbar>
          <IconButton
            edge="start"
            aria-label="open drawer"
            sx={{
              ...(open && { display: 'none' }),
            }}
            onClick={handleDrawerOpen}
          >
            <Menu />
          </IconButton>
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
                <Link href={`/users/${authUser.id}`}>
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
        <>
          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
              }}
            >
              <IconButton onClick={handleDrawerClose}>
                <ChevronLeft />
              </IconButton>
            </Toolbar>
            <Divider />
            {list}
          </Drawer>
        </>
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
