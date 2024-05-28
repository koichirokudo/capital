import { NextPage } from 'next'
import React, { useState } from 'react'
import { useAuthContext } from '../../contexts/AuthContext'
import Template from '../../components/Templates'
import { EmailOutlined, PersonOutline } from '@mui/icons-material'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import PasswordIcon from '@mui/icons-material/Password'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Button,
  Box,
  AlertProps,
  Snackbar,
  Alert,
} from '@mui/material'
import { useSpinnerActionsContext } from '../../contexts/SpinnerContext'
import updateUser from '../../services/users/update-user'

const UserProfilePage: NextPage = () => {
  const { authUser, isLoading, mutate } = useAuthContext()
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({
    name: authUser?.name,
    email: authUser?.email,
    password: '',
  })
  const setSpinner = useSpinnerActionsContext()
  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null)

  if (isLoading) {
    return <div>loading...</div>
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    setIsEditing(false)
    setSpinner(true)

    const updatedUser = {
      name: editedUser.name ? editedUser.name : authUser?.name,
      email: editedUser.email ? editedUser.email : authUser?.email,
      password: editedUser.password ? editedUser.password : undefined,
    }

    await updateUser(updatedUser)
    mutate()
    setSpinner(false)
    setSnackbar({ children: '保存しました', severity: 'success' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value })
  }

  const handleCloseSnackbar = () => {
    setSnackbar(null)
  }

  return (
    <Template title="プロフィール">
      <Grid container justifyContent="center">
        <Grid item>
          <Box
            sx={{ p: 2, minWidth: 450, minHeight: 350, textAlign: 'center' }}
          >
            <h2>プロフィール</h2>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PersonOutline />
                </ListItemIcon>
                <ListItemText>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      name="name"
                      value={editedUser.name}
                      onChange={handleChange}
                    />
                  ) : (
                    editedUser.name
                  )}
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EmailOutlined />
                </ListItemIcon>
                <ListItemText>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      name="email"
                      value={editedUser.email}
                      onChange={handleChange}
                    />
                  ) : (
                    editedUser.email
                  )}
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PasswordIcon />
                </ListItemIcon>
                {isEditing ? (
                  <TextField
                    fullWidth
                    name="password"
                    label="パスワード"
                    type="password"
                    value={editedUser.password}
                    onChange={handleChange}
                  />
                ) : (
                  <ListItemText>********</ListItemText>
                )}
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <GroupAddIcon />
                </ListItemIcon>
                <ListItemText>{authUser?.inviteCode}</ListItemText>
              </ListItem>
            </List>
            {isEditing ? (
              <Button
                startIcon={<SaveIcon />}
                onClick={handleSave}
                color="primary"
              >
                保存
              </Button>
            ) : (
              <Button
                startIcon={<EditIcon />}
                onClick={handleEdit}
                color="primary"
              >
                編集
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
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
    </Template>
  )
}

export default UserProfilePage
