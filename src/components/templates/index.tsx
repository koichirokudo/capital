import {
  Menu as MenuIcon,
  Notifications,
  AccountCircle,
  Person,
  CurrencyYen,
  BarChart,
  Logout,
  Category,
  ChevronLeft,
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
import Link from 'components/Link/indext'
import { useAuthContext } from 'contexts/AuthContext'
import * as React from 'react'
import { getSpecificDate } from 'utils/format'

const drawerWidth = 220
const date = new Date()

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
  const { title, children } = props
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false)

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleDrawerOpen = () => {
    setDrawerOpen(true)
  }
  const handleDrawerClose = () => {
    setDrawerOpen(false)
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
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
          <Typography variant="h5" color="white" sx={{ ml: 3 }}>
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
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <Link href={`/users/profile/${authUser.id}`}>
                      <MenuItem onClick={handleMenuClose}>
                        プロフィール
                      </MenuItem>
                    </Link>
                    <Link href={`/users/edit/${authUser.id}`}>
                      <MenuItem onClick={handleMenuClose}>
                        プロフィール編集
                      </MenuItem>
                    </Link>
                    <Link href={`/logout`}>
                      <MenuItem onClick={handleMenuClose}>ログアウト</MenuItem>
                    </Link>
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
              <Link href={`/capital`}>
                <ListItemButton>
                  <CurrencyYen />
                  <ListItem sx={{ ml: 1 }}>
                    <ListItemText primary="収支登録・編集" />
                  </ListItem>
                </ListItemButton>
              </Link>
              <Link href={`/report/year?year=${getSpecificDate(date, 'year')}`}>
                <ListItemButton>
                  <BarChart />
                  <ListItem sx={{ ml: 1 }}>
                    <ListItemText primary="年間レポート" />
                  </ListItem>
                </ListItemButton>
              </Link>
              <Link
                href={`/report/month?year=${getSpecificDate(
                  date,
                  'year',
                )}&month=${getSpecificDate(date, 'month', -1)}`}
              >
                <ListItemButton>
                  <Category />
                  <ListItem sx={{ ml: 1 }}>
                    <ListItemText primary="月間レポート" />
                  </ListItem>
                </ListItemButton>
              </Link>
              <Link href={`/settlement/bill`}>
                <ListItemButton>
                  <Logout />
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
