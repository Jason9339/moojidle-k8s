# Express Server

## Set-up instruction

### for the first time

1. `npm i`
2. set your `.env` file according to `.env.example`
3. open your MongoDB, paste the content in `Seed.bson`
4. `npm run dev`

### after init set up

1. `npm run dev`

## File Structure

```
backend
├── src
│   ├── controllers
│   │   └── example_controller.js
│   ├── routes
│   │   └── example_route.js
│   ├── services
│   │   └── example_service.js
│   └── database.js
├── README.md
├── jsconfig.json
├── main.js
├── package-lock.json
├── package.json
└── .env.example
```