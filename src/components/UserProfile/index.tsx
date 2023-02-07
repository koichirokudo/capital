import { EmailOutlined, PersonOutline } from '@mui/icons-material'
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
} from '@mui/material'
import Image from 'next/image'

interface UserProfileProps {
  username: string
  email: string
  profileImage: string
}

const UserProfile = ({ username, email, profileImage }: UserProfileProps) => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        mx: 'auto',
      }}
    >
      <Grid item>
        <Paper
          sx={{ p: 2, minWidth: 250, minHeight: 250, textAlign: 'center' }}
        >
          <Image
            src={profileImage}
            alt="プロフィール画像"
            width={80}
            height={80}
            style={{ borderRadius: '50%' }}
          />
          <List>
            <ListItem>
              <ListItemIcon>
                <PersonOutline />
              </ListItemIcon>
              <ListItemText>{username}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <EmailOutlined />
              </ListItemIcon>
              <ListItemText>{email}</ListItemText>
            </ListItem>
          </List>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default UserProfile
