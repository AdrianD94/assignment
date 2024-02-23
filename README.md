## Prerequisites
- Docker installed and running.
- Node.js 16+.

## How to run the app
1. Execute `docker-compose up -d` to spin up the PostgreSQL database container and the database GUI client Adminer.
2. Run `npm i` to install dependencies.
3. Start the app by running `npm run dev`.

## About the application
The application follows the N-tier architecture, specifically the 3-tier architecture, comprising controllers, services, and a data access layer. It is well-suited for small to medium-sized applications.
The app leverages the Routing Controllers package for defining controllers, TypeORM as the ORM, and TypeDI as an IOC container.
The application is deployable as an NPM package, with a configured GitHub pipeline located in the .github folder. This pipeline utilizes Babel for transpilation, ensuring compatibility with both ECMAScript Modules (ESM) and CommonJS formats. Following each commit, the pipeline automates the build process and seamlessly deploys the application to the NPM registry.