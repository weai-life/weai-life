import type { MyPostsQuery } from 'types/graphql'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'weai-ui'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

export const QUERY = gql`
  query myPosts(
    $where: PostsWhereInput
    $page: Int
    $orderBy: PostsOrderByInput
  ) {
    myPosts(page: $page, where: $where, orderBy: $orderBy) {
      data {
        id
        title
        content
        archived
        sequenceAt
        createdAt
        updatedAt
        schema
        liked
        likesCount
        commentsCount
        store
        externalId
        authorId
        author {
          name
        }
        accessToken
        channelId
        channel {
          id
          name
          kind
        }
        postBlocks {
          id
          block {
            id
            content
            contentType
            createdAt
          }
          position
        }
        tags {
          id
          tag {
            id
            name
          }
        }
        tool {
          id
          title
        }
      }
      hasNext
    }
  }
`

export const Loading = () => <div>Loading...</div>

const Introduction = () => {
  return (
    <div className="my-4 italic leading-loose tracking-wide opacity-90">
      <div>You data, you choice.</div>
      <div>All your data, under your control.</div>
    </div>
  )
}

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => {
  const { isAuthenticated } = useAuth()

  function handleGotoLogin() {
    window.location.href = `https://auth.weai.life?redirectUrl=${location.href}`
  }

  if (!isAuthenticated) {
    return (
      <div className="mt-6 text-center">
        <Introduction />
        <div className="mb-2 mt-6 opacity-50">View data need log in</div>
        <Button onClick={handleGotoLogin}>Log in</Button>
      </div>
    )
  } else {
    return <div style={{ color: 'red' }}>Error: {error?.message}</div>
  }
}

export const Success = ({ myPosts }: CellSuccessProps<MyPostsQuery>) => {
  return (
    <div className="mb-10 mt-6">
      {myPosts.data.map((item) => {
        return (
          <Card key={item.id} className="mt-2">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.content}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge>{item.tool.title}</Badge>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
