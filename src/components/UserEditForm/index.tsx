import { Button, Grid, TextField, Stack, Box } from '@mui/material'
import React, { ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { User } from 'types'

export type UserEditFormData = {
  id: number
  groupId: number
  authType: number
  name: string
  password: string
  confirmPassword: string
  email: string
  profileImage: string
  delete: string
}

interface UserFormProps {
  user: User
  // eslint-disable-next-line no-unused-vars
  onUserSave?: (data: UserEditFormData) => void
}

/**
 * ユーザープロファイル編集
 */
const UserEditForm = ({ user, onUserSave }: UserFormProps) => {
  const [imagePreview, setImagePreview] = React.useState<string | null>(
    user.profileImage,
  )

  const onSubmit = (data: UserEditFormData) => {
    onUserSave && onUserSave(data)
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserEditFormData>()

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setImagePreview(URL.createObjectURL(files[0]))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <Grid item xs={12} md={12} xl={12}>
          <Stack direction="row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              id="profileImagePreview"
              src={imagePreview ?? '/Avatar/DefaultProfileImage.png'}
              width={80}
              height={80}
              alt="プロフィール画像"
              style={{ borderRadius: '50%' }}
            />
            <Box sx={{ mt: 3, ml: 3 }}>
              <input
                type="file"
                {...register('profileImage')}
                accept="image/*,.jpg,.png,.jpeg,.gif"
                onChange={onChange}
              />
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <TextField
            {...register('name', {
              required: 'ユーザ名を入力してください。',
              minLength: {
                value: 2,
                message: 'ユーザ名は2文字以上で入力してください。',
              },
              maxLength: {
                value: 15,
                message: 'ユーザ名は15文字以下で入力してください。',
              },
            })}
            margin="normal"
            type="text"
            label="ユーザ名"
            defaultValue={user.name}
            sx={{ width: '350px' }}
            error={'name' in errors}
            helperText={errors.name?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            {...register('email', {
              required: 'メールアドレスを入力してください。',
              pattern: {
                value: /^[\w\-.]+@([\w-]+\.)+[\w-]{2,}$/,
                message: 'メールアドレスの形式が不正です。',
              },
            })}
            margin="normal"
            type="text"
            label="メールアドレス"
            defaultValue={user.email}
            sx={{ width: '350px' }}
            error={'email' in errors}
            helperText={errors.email?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            {...register('password', {
              minLength: {
                value: 8,
                message: 'パスワードは8文字以上で入力してください。',
              },
            })}
            margin="normal"
            type="password"
            label="パスワード"
            sx={{ width: '350px' }}
            error={'password' in errors}
            helperText={errors.password?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            {...register('confirmPassword', {
              validate: (value: string) => {
                if (watch('password') != value) {
                  return 'パスワードとパスワード確認が一致しません。'
                }
              },
            })}
            margin="normal"
            type="password"
            label="パスワード確認"
            sx={{ width: '350px' }}
            error={'confirmPassword' in errors}
            helperText={errors.confirmPassword?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            fullWidth
            sx={{ mt: 1, width: '350px', color: 'white' }}
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
            {...register('delete')}
            defaultValue={user.delete}
          />
        </>
      )}
    </form>
  )
}

export default UserEditForm
