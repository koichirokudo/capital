import { User } from 'types'
import { Controller, useForm } from 'react-hook-form'
import { Box, Button, Container, TextField } from '@mui/material'
import Image from 'next/image'

export type UserRegisterFormData = User & {
  passwordConfirm: string
  inviteCode: string
}

interface UserRegisterFormProps {
  handleUserRegister?: (data: UserRegisterFormData) => void
}

/**
 * ユーザー登録フォーム
 * @param handleUserRegister
 * @constructor
 */
const UserRegisterForm = ({ handleUserRegister }: UserRegisterFormProps) => {

  const onSubmit = (data: UserRegisterFormData) => {
    handleUserRegister && handleUserRegister(data)
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch
  } = useForm<UserRegisterFormData>({
    defaultValues: {
      email: '',
      name: '',
      password: '',
      passwordConfirm: '',
      inviteCode: '',
    },
  })

  const password = watch('password')

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Image
          src="/logo.png"
          width={350}
          height={100}
          alt="MyCapi"
          priority={true}
        />
        <h2>ユーザー登録</h2>
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
              name="email"
              control={control}
              defaultValue=""
              rules={{ required: 'メールアドレスを入力してください。' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="メールアドレス"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  margin="normal"
                />
              )}
            />
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: 'ユーザ名を入力してください。' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ユーザ名"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
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
                maxLength: {
                  value: 16,
                  message: 'パスワードは16文字以下で入力してください。',
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
            <Controller
              name="passwordConfirm"
              control={control}
              defaultValue=""
              rules={{
                required: 'もう一度パスワードを入力してください。',
                minLength: {
                  value: 8,
                  message: 'パスワードは8文字以上で入力してください。',
                },
                maxLength: {
                  value: 16,
                  message: 'パスワードは16文字以下で入力してください。',
                },
                validate: (value) =>
                  value === password || 'パスワードが一致しません。',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="もう一度パスワードを入力する"
                  type="password"
                  fullWidth
                  error={!!errors.passwordConfirm}
                  helperText={errors.passwordConfirm?.message}
                  margin="normal"
                />
              )}
            />
            <Controller
              name="inviteCode"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="グループ招待コード"
                  fullWidth
                  error={!!errors.inviteCode}
                  helperText={errors.inviteCode?.message}
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
              ユーザー登録
            </Button>
          </form>
        </Box>
      </Container>
    </>
  )
}

export default UserRegisterForm
