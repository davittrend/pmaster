# Pin Master

A powerful Pinterest pin scheduling application built with React and TypeScript.

## Features

- OAuth 2.0 authentication with Pinterest
- Bulk pin scheduling via CSV upload
- Smart scheduling with time randomization
- Account management and settings
- Board selection and management
- Comprehensive error handling and validation

## Tech Stack

- React 18
- TypeScript
- Vite
- React Query
- Zustand
- Tailwind CSS
- Zod
- Lucide React

## Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pin-master.git
cd pin-master
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Building for Production

```bash
npm run build
```

## Environment Variables

The following environment variables are required:

- `VITE_PINTEREST_CLIENT_ID`: Pinterest API client ID
- `VITE_PINTEREST_CLIENT_SECRET`: Pinterest API client secret
- `VITE_PINTEREST_REDIRECT_URI`: OAuth callback URL

## License

MIT