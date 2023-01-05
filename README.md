## SawaUp Challenge

This application gives the user the ability to select skills and see the courses curated by SawaUp.

## Requirements

- Node.js
- NPM

## Installation

1. Clone the repository
2. Run `npm install` to install the dependencies
3. Run `npm run build` to build the application
4. Run `npm run dev` to start the application

## Application Structure

The application is built using NextJS and Prisma. The application is structured as follows:

- `components` - Contains the components used in the application
- `pages` - Contains the pages of the application
- `public` - Contains the static files of the application
- `styles` - Contains the styles of the application
- `types` - Contains the types used in the application
- `prisma` - Contains the database schema and migrations
- `lib` - Contains the helper functions used in the application

## Database

The database is a sqlite db file inside the `prisma` folder. The database schema is defined in the `prisma/schema.prisma` file. The database migrations are defined in the `prisma/migrations` folder.

## API

There are no APIs as such. The application uses the Prisma ORM to query the database. If I would have chose to store selected skills and favorite courses in the database I would have used the next `pages/api` folder, but as sqlite data would be lost on every build anyway. I did not implement this feature.

## Filtering Courses based on selected skills

The application uses the `useEffect` hook to filter the courses based on the selected skills. The `useEffect` hook is called every time the selected skills change. Inside the hook function courses are filtered based on total number of matched skills. A step by step explaination is present in the `pages/index.tsx` file.

## Lighthouse Metrics

![Screenshot 2023-01-06 at 12 28 42 AM](https://user-images.githubusercontent.com/27153515/210860351-83b288b4-f186-4af3-bd45-46208043cac4.png)

## Things I wanted to implement

- [ ] Fetch video thumbnail from youtube
- [ ] Implement a better UI
- [ ] Persist selected skills and favourites in db in a separate table similar to user preferences
