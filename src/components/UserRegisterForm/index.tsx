import { Button, Grid, TextField, Stack, Box } from '@mui/material'
import React, { ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'

export type UserRegisterFormData = {
  groupId: number
  authType: number
  username: string
  password: string
  confirmPassword: string
  email: string
  profileImage: string
  cancel: string
}

interface UserFormProps {
  // eslint-disable-next-line no-unused-vars
  onUserSave?: (data: UserRegisterFormData) => void
}

/**
 * ユーザープロファイル登録
 */
const UserRegisterForm = ({ onUserSave }: UserFormProps) => {
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)

  const onSubmit = (data: UserRegisterFormData) => {
    onUserSave && onUserSave(data)
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserRegisterFormData>()

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
            {...register('username', {
              required: 'ユーザー名を入力してください。',
              minLength: {
                value: 2,
                message: '2文字以上のユーザー名を入力してください。',
              },
              maxLength: {
                value: 15,
                message: '15文字以下のユーザー名を入力してください。',
              },
            })}
            margin="normal"
            type="text"
            label="ユーザー名"
            sx={{ width: '350px' }}
            error={'username' in errors}
            helperText={errors.username?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            {...register('email', {
              required: 'メールアドレスを入力してください。',
              pattern: {
                value: /^[\w\-.]+@([\w-]+\.)+[\w-]{2,}$/,
                message: 'メールアドレスの形式を正しく入力してください。',
              },
            })}
            margin="normal"
            type="email"
            label="メールアドレス"
            sx={{ width: '350px' }}
            error={'email' in errors}
            helperText={errors.email?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            {...register('password')}
            margin="normal"
            type="password"
            label="パスワードを入力"
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
                  return '入力したパスワードが違います。'
                }
              },
            })}
            margin="normal"
            type="password"
            label="もう一度パスワードを入力"
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
            登録する
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default UserRegisterForm
