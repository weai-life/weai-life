# WeAI Life

WeAI Life is a community-driven platform built with [RedwoodJS](https://redwoodjs.com), allowing users to join channels, create groups, share content, and connect with others who share similar interests.

## Features

- **User Authentication**: Secure user registration and login system
- **Channels & Groups**: Create and join various channels and groups
- **Content Sharing**: Share posts and comments within channels
- **User Connections**: Connect with other users on the platform
- **Permission System**: Granular permission controls for channel and group management
- **Activity Streams**: Track user activities and interactions
- **Tools Integration**: Connect with external tools and platforms

## Prerequisites

- Node.js (=20.x)
- Yarn (>=3.6.1)
- PostgreSQL database
- Redis (for caching and session management)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/weai-life.git
cd weai-life
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your database connection details and other configuration options.

4. Set up the database:
```bash
yarn rw prisma migrate dev
```

5. Start the development server:
```bash
yarn rw dev
```

Your browser should automatically open to [http://localhost:8910](http://localhost:8910) where you'll see the application running.

## Project Structure

- `api/`: Backend API with GraphQL and PostgreSQL
- `web/`: Frontend React application
- `api/db/schema.prisma`: Database schema definition
- `api/src/services/`: API service endpoints
- `api/src/lib/`: Shared library code and utilities
- `web/src/components/`: React components
- `web/src/pages/`: Application pages

## Testing

Run tests with:

```bash
yarn rw test
```

## Deployment

WeAI Life can be deployed to various platforms:

```bash
yarn rw setup deploy --help
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [RedwoodJS](https://redwoodjs.com) - The full-stack framework used
- [Prisma](https://www.prisma.io/) - ORM for database access
- [GraphQL](https://graphql.org/) - API query language
- [React](https://reactjs.org/) - Frontend UI library
