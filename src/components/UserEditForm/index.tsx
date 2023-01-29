import { Button, Grid, TextField, Stack } from '@mui/material'
import React, { ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { User } from 'types'

export type UserFormData = {
  id: number
  groupId: number
  authType: number
  username: string
  password: string
  email: string
  profileImage: string
  cancel: string
}

interface UserFormProps {
  user: User
  onUserSave?: (data: UserFormData) => void
}

/**
 * ユーザープロファイル登録編集
 */
const UserEditForm = ({ user, onUserSave }: UserFormProps) => {
  const [imageUrl, setImageUrl] = React.useState<string | null | undefined>(
    user.profileImage,
  )
  const onSubmit = (data: UserFormData) => {
    onUserSave && onUserSave(data)
  }

  const { register, handleSubmit } = useForm<UserFormData>()

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    const fileReader = new FileReader()
    fileReader.onload = () => {
      const res = fileReader!.result
      if (res && typeof res === 'string') {
        setImageUrl(res)
      }
    }
    files && fileReader.readAsDataURL(files[0])
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <Grid item xs={8} md={8} xl={8}>
          <Stack direction="row">
            <img
              id="profileImage"
              src={imageUrl ?? '/Avatar/DefaultProfileImage.png'}
              width={80}
              height={80}
              alt="プロフィール画像"
              style={{ borderRadius: '50%' }}
            />
            <Button
              variant="outlined"
              component="label"
              sx={{ mt: 3, ml: 1, height: 40 }}
            >
              画像を変更する
              <input
                {...register('profileImage')}
                type="file"
                hidden
                accept="image/*,.jpg,.png,.jpeg,.gif"
                onChange={onChange}
              />
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            {...register('username')}
            autoComplete="off"
            margin="normal"
            type="text"
            label="ユーザー名"
            defaultValue={user.username}
            sx={{ width: '300px' }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            {...register('email')}
            autoComplete="off"
            margin="normal"
            type="email"
            label="メールアドレス"
            defaultValue={user.email}
            sx={{ width: '300px' }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            {...register('password')}
            autoComplete="off"
            margin="normal"
            type="password"
            label="パスワード"
            defaultValue={user.password}
            sx={{ width: '300px' }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            fullWidth
            sx={{ mt: 1, width: '300px', color: 'white' }}
          >
            更新する
          </Button>
        </Grid>
      </Grid>
      {user && (
        <>
          <input
            type="hidden"
            {...register('id', { valueAsNumber: true })}
            defaultValue={user.id}
          />
          <input
            type="hidden"
            {...register('authType', {
              valueAsNumber: true,
            })}
            defaultValue={user.authType}
          />
          <input
            type="hidden"
            {...register('groupId', {
              valueAsNumber: true,
            })}
            defaultValue={user.groupId}
          />
          <input
            type="hidden"
            {...register('cancel')}
            defaultValue={user.cancel}
          />
        </>
      )}
    </form>
  )
}

export default UserEditForm
