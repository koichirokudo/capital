import { NextPage } from 'next'
import { useAuthContext } from '../../contexts/AuthContext'
import Template from '../../components/Templates'
import { EmailOutlined, PersonOutline } from '@mui/icons-material'
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material'

const UserProfilePage: NextPage = () => {
  const { authUser, isLoading } = useAuthContext()

  if (isLoading) {
    return <div>loading...</div>
  }

  return (
    <Template>
      <Grid
        container
        justifyContent="center"
      >
        <Grid item>
          <Paper
            sx={{ p: 2, minWidth: 250, minHeight: 250, textAlign: 'center' }}
          >
            <h2>プロフィール</h2>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PersonOutline />
                </ListItemIcon>
                <ListItemText>{authUser?.name}</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EmailOutlined />
                </ListItemIcon>
                <ListItemText>{authUser?.email}</ListItemText>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Template>
  )
}

export default UserProfilePage
