# WeAI Life

WeAI Life is a comprehensive life management platform built with [RedwoodJS](https://redwoodjs.com), offering a collection of tools designed to help users organize, reflect, and improve various aspects of their lives.

## Features

### Personal Life Management Tools
- **Rule**: Making rules for better relationships
- **Todo**: Manage todos and tasks
- **Memo**: Capture and organize memos
- **Timeline**: Timeline for life, record for family and friends
- **Review**: Review and reflect on unhappy events
- **Habit**: Track and build positive habits
- **Bucket**: Create and manage bucket lists
- **Diary**: Write and maintain personal diaries
- **Excerpt**: Capture excerpts when reading books
- **Resume**: Write and manage multiple resumes and cover letters
- **SOP**: Create standard operating procedures
- **The One**: Focus on the most important one thing
- **Change**: Learn how to change yourself
- **Decision**: Tools for making good decisions
- **Link**: Manage personal bio links

### Platform Features
- **User Authentication**: Secure user registration and login system
- **Data Synchronization**: Access your tools and data across multiple devices
- **Privacy Controls**: Manage what information is shared and with whom
- **Optional Sharing**: Selectively share insights and achievements with trusted connections

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
