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
        happenedAt
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
    <div className="tracking-wide leading-loose my-4 opacity-90 italic">
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
        <div className="opacity-50 mt-6 mb-2">View data need log in</div>
        <Button onClick={handleGotoLogin}>Log in</Button>
      </div>
    )
  } else {
    return <div style={{ color: 'red' }}>Error: {error?.message}</div>
  }
}

export const Success = ({ myPosts }: CellSuccessProps<MyPostsQuery>) => {
  return (
    <div className="mt-6 mb-10">
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
