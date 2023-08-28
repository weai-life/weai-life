// TODO: 优化
//
// SELECT
// 	Post.*,
// FROM
// 	Post
// WHERE ((Post.isDraft = FALSE
// 		AND(Post.id)
// 		NOT IN(
// 			SELECT
// 				t0.id FROM Post AS t0
// 				INNER JOIN USER AS j0 ON (j0.id) = (t0.authorId)
// 			WHERE ((j0.id)
// 			IN(
// 				SELECT
// 					t1.id FROM USER AS t1
// 					INNER JOIN BlockUser AS j1 ON (j1.blockedUserId) = (t1.id)
// 				WHERE (j1.userId = ${userId}
// 					AND t1.id IS NOT NULL))
// 			AND t0.id IS NOT NULL)))
// ORDER BY
// 	Post.id DESC
export const postWhereOptionToBlockUser = (userId: number | undefined) =>
  userId
    ? {
        author: {
          isNot: {
            blockedFromUsers: {
              some: { userId: { equals: userId } },
            },
          },
        },
      }
    : {}
