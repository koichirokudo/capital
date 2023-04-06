import { Box, Button, Container, TextField, Typography } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { Controller, useForm } from 'react-hook-form'

export type LoginFormData = {
  username: string
  password: string
}

interface LoginFormProps {
  /**
   * ログインボタンを押した時のイベントハンドラ
   */
  // eslint-disable-next-line no-unused-vars
  handleLogin?: (username: string, password: string) => void
}

const LoginForm = ({ handleLogin }: LoginFormProps) => {
  // React Hook Formの使用
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>()
  const onSubmit = (data: LoginFormData) => {
    const { username, password } = data
    handleLogin && handleLogin(username, password)
  }

  return (
    <Container component="main" maxWidth="xs">
      <Image
        src="/logo.png"
        width={350}
        height={100}
        alt="MyCapi"
        priority={true}
      />
      <Box
        sx={{
          mt: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="username"
            control={control}
            defaultValue=""
            rules={{ required: 'ユーザ名を入力してください。' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="ユーザ名"
                fullWidth
                error={!!errors.username}
                helperText={errors.username?.message}
                margin="normal"
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{
              required: 'パスワードを入力してください。',
              minLength: {
                value: 8,
                message: 'パスワードは8文字以上で入力してください。',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="パスワード"
                type="password"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                margin="normal"
              />
            )}
          />
          <Button
            type="submit"
            color="primary"
            variant="contained"
            fullWidth
            sx={{ mt: 1 }}
          >
            ログイン
          </Button>
          <Typography>
            <Link href="/users/register">ユーザー新規登録</Link>
          </Typography>
        </form>
      </Box>
    </Container>
  )
}

export default LoginForm
