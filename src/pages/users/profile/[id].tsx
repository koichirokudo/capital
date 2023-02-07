import Template from 'components/Templates'
import UserProfileContainer from 'container/UserProfileContainer'
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

type UserProfilePageProps = InferGetStaticPropsType<typeof getStaticProps>

const UserProfilePage: NextPage<UserProfilePageProps> = ({
  id,
  user,
}: UserProfilePageProps) => {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <Template title="プロフィール">
      <UserProfileContainer userId={id} user={user} />
    </Template>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const context: ApiContext = {
    apiRootUrl: process.env.API_BASE_URL || 'http://localhost:3000',
  }
  const users = await getAllUsers(context)
  const paths = users.map((u) => `/users/profile/${u.id}`)

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
  }
}

export default UserProfilePage
