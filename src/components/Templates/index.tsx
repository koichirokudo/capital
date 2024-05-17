import Image from 'next/image'
import {
  Menu as MenuIcon,
  Notifications,
  AccountCircle,
  Person,
  CurrencyYen,
  BarChart,
  MultilineChart,
  ChevronLeft,
  ModeEdit,
} from '@mui/icons-material'
import {
  AppBar as MuiAppBar,
  Box,
  CircularProgress,
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  styled,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import Link from 'components/Link'
import { useAuthContext } from 'contexts/AuthContext'
import * as React from 'react'
import { useEffect } from 'react'

const drawerWidth = 220

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
    height: '100vh',
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(7.5),
      },
    }),
  },
}))

const Template = (props: TemplateProps) => {
  const { authUser, isLoading, logout } = useAuthContext()
  const { title, children } = props
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  useEffect(() => {
    const drawerOpen = localStorage.getItem('drawerOpen')
    setDrawerOpen(drawerOpen === 'true')
  }, [])

  const handleDrawerOpen = () => {
    setDrawerOpen(true)
    localStorage.setItem('drawerOpen', 'true')
  }
  const handleDrawerClose = () => {
    setDrawerOpen(false)
    localStorage.setItem('drawerOpen', 'false')
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    handleMenuClose()
    handleDrawerClose()
    await logout()
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="absolute" open={drawerOpen}>
        <Toolbar>
          {(() => {
            // 認証済み
            if (authUser) {
              return (
                <IconButton
                  edge="start"
                  aria-label="open drawer"
                  sx={{
                    ...(drawerOpen && { display: 'none' }),
                  }}
                  onClick={handleDrawerOpen}
                >
                  <MenuIcon />
                </IconButton>
              )
            }
          })()}
          <Box sx={{ ml: 3 }} />
          <Image
            src="/logo.png"
            width={120}
            height={40}
            style={{ cursor: 'pointer' }}
            alt="MyCapi"
            priority={true}
            onClick={() => {
              location.href = '/'
            }}
          />
          <Typography variant="h6" color="white" sx={{ ml: 3 }}>
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
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Tooltip title="プロフィール">
                    <IconButton
                      onClick={handleMenuClick}
                      size="small"
                      sx={{ ml: 2 }}
                      aria-controls={open ? 'account-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                    >
                      <AccountCircle sx={{ color: 'white' }} />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    onClick={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <Link href={`/users/profile`}>
                      <MenuItem onClick={handleMenuClose}>
                        プロフィール
                      </MenuItem>
                    </Link>
                    <Link href={`/users/edit`}>
                      <MenuItem onClick={handleMenuClose}>
                        プロフィール編集
                      </MenuItem>
                    </Link>
                    <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
                  </Menu>
                </Box>
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
          <Drawer variant="permanent" open={drawerOpen}>
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
            <List>
              <Link href={'/capital'}>
                <ListItemButton>
                  <ModeEdit />
                  <ListItem sx={{ ml: 1 }}>
                    <ListItemText primary="収支登録・編集" />
                  </ListItem>
                </ListItemButton>
              </Link>
              <Link href={'/report/year'}>
                <ListItemButton>
                  <MultilineChart />
                  <ListItem sx={{ ml: 1 }}>
                    <ListItemText primary="年間レポート" />
                  </ListItem>
                </ListItemButton>
              </Link>
              <Link href={'/report/month'}>
                <ListItemButton>
                  <BarChart />
                  <ListItem sx={{ ml: 1 }}>
                    <ListItemText primary="月間レポート" />
                  </ListItem>
                </ListItemButton>
              </Link>
              <Link href={'/calculate'}>
                <ListItemButton>
                  <CurrencyYen />
                  <ListItem sx={{ ml: 1 }}>
                    <ListItemText primary="精算" />
                  </ListItem>
                </ListItemButton>
              </Link>
            </List>
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
