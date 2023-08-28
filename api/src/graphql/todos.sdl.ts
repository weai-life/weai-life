export const schema = gql`
  type Todo {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    post: Post!
    postId: Int!
    completed: Boolean!
    deadline: DateTime
    assignees: [User!]!
    timerAt: DateTime
  }

  type PagedTodos {
    data: [Todo!]!
    hasNext: Boolean!
  }

  type Query {
    todos(
      page: Int
      pageSize: Int
      where: TodosWhereInput
      orderBy: TodosOrderByInput
    ): PagedTodos! @requireAuth
    myTodos(
      page: Int
      pageSize: Int
      where: TodosWhereInput
      orderBy: TodosOrderByInput
    ): PagedTodos! @requireAuth
    myCreatedTodos(
      page: Int
      pageSize: Int
      where: TodosWhereInput
      orderBy: TodosOrderByInput
    ): PagedTodos! @requireAuth
    todo(id: Int!): Todo @requireAuth
  }

  input TodosWhereInput {
    completed: BooleanFilter
  }

  input TodosOrderByInput {
    id: SortOrder
    completed: SortOrder
  }

  input CreateTodoInput {
    postId: Int!
    deadline: DateTime
    assignees: [Int!]
    timerAt: DateTime
  }

  input UpdateTodoInput {
    completed: Boolean
    deadline: DateTime
    assignees: [Int!]
    timerAt: DateTime
  }

  type Mutation {
    createTodo(input: CreateTodoInput!): Todo! @requireAuth
    updateTodo(id: Int!, input: UpdateTodoInput!): Todo! @requireAuth
    deleteTodo(id: Int!): Todo! @requireAuth
  }
`
