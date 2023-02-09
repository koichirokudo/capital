import { Box, Button, Container, TextField, Typography } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

export type LoginFormData = {
  username: string
  password: string
}

interface LoginFormProps {
  /**
   * ログインボタンを押した時のイベントハンドラ
   */
  handleLogin?: (username: string, password: string) => void
}

const LoginForm = ({ handleLogin }: LoginFormProps) => {
  // React Hook Formの使用
  const {
    register,
    handleSubmit,
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
          <TextField
            required
            {...register('username')}
            autoComplete="off"
            margin="normal"
            type="text"
            label="ユーザ名"
            fullWidth
          />
          <TextField
            required
            {...register('password')}
            autoComplete="off"
            margin="normal"
            type="password"
            label="パスワード"
            fullWidth
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
