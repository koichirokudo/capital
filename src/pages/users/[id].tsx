import { Grid } from '@mui/material'
import Template from 'components/Templates'
import UserEditFormContainer from 'container/UserEditFormContainer'
import { useAuthContext } from 'contexts/AuthContext'
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import getAllUsers from 'services/users/get-all-users'
import getUser from 'services/users/get-user'
import { ApiContext } from 'types'
import { useAuthGaurd } from 'utils/hook'

type UserPageProps = InferGetStaticPropsType<typeof getStaticProps>

const UserPage: NextPage<UserPageProps> = ({ id, user }: UserPageProps) => {
  // 認証ガード
  useAuthGaurd()

  const router = useRouter()
  const { authUser } = useAuthContext()
  const onSave = (err?: Error) => {
    if (authUser && !err) {
      router.push(`/users/${authUser.id}`)
    }
  }

  return (
    <Template title="プロフィール">
      <Grid container>
        <Grid item xs={12} md={12} lg={12}>
          <UserEditFormContainer onSave={onSave} />
        </Grid>
      </Grid>
    </Template>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const context: ApiContext = {
    apiRootUrl: process.env.API_BASE_URL || 'http://localhost:3000',
  }
  const users = await getAllUsers(context)
  const paths = users.map((u) => `/users/${u.id}`)

  return { paths, fallback: true }
}

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  const context: ApiContext = {
    apiRootUrl: process.env.API_BASE_URL || 'http://localhost:3000',
  }

  if (!params) {
    throw new Error('params is undefined')
  }

  const userId = Number(params.id)
  const user = await getUser(context, { id: userId })

  return {
    props: {
      id: userId,
      user,
    },
    revalidate: 10,
  }
}

export default UserPage
