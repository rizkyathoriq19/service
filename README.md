# Vehicle Service Booking API 

## Tech Stacks 

- [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)  
- [Prisma](https://www.prisma.io/) as ORM  
- [MySQL](https://www.mysql.com/) database  
- [JWT](https://jwt.io/) for authentication  
- [TypeScript](https://www.typescriptlang.org/) for type safety  

> [!NOTE]  
>  As stated in Getting Started parts of our notion, don't forget to make sure that you have Node.js >= 16.14.2 and MySQL >= 8.0.3

## Steps To Run Project Locally

Clone Repository :
```powershell
git clone https://github.com/rizkyathoriq19/service.git
cd service
```

Install dependencies :

```powershell
npm install
```

Setup Environment :

```powershell
cp .env.example .env
```
Get .env value, and change db connection url in .env

Setup Database :

```powershell
# Generate Prisma client
npx prisma generate

# Run migration
npx prisma migrate --name <migration_name>
```
Run seeder :

  > [!IMPORTANT]  
  > Delete this part on your repository in case there is no seeder available on your codebase.

```powershell
npm run seed
```

## Running The App 


By Default, to run the app with hot-reload simply run 
```
npm run dev -- --service=rest
```

If you want to start the build version, run it with : 
```
npm start -- --service=rest
```

## API Endpoints  

### Authentication  
| Method | Endpoint             | Description           | Access  |
|--------|----------------------|-----------------------|---------|
| POST   | `/api/auth/register` | Register new dealer   | Public  |
| POST   | `/api/auth/login`    | Dealer login          | Public  |
| GET    | `/api/auth/profile`  | Get dealer profile    | Dealer  |

### Schedules  
| Method | Endpoint                   | Description          | Access  |
|--------|-----------------------------|----------------------|---------|
| GET    | `/api/schedules/available` | View available schedules | Public  |
| GET    | `/api/schedules`           | View all schedules   | Dealer  |
| GET    | `/api/schedules/:id`       | View schedules by ID   | Dealer  |
| POST   | `/api/schedules`           | Create new schedule  | Dealer  |
| PUT    | `/api/schedules/:id`       | Update schedule      | Dealer  |
| DELETE | `/api/schedules/:id`       | Delete schedule      | Dealer  |

### Bookings  
| Method | Endpoint                     | Description           | Access  |
|--------|-------------------------------|-----------------------|---------|
| POST   | `/api/bookings`              | Create new booking    | Public  |
| GET    | `/api/bookings`              | View all bookings     | Dealer  |
| GET    | `/api/bookings/:id`          | View booking details  | Dealer  |
| PUT    | `/api/bookings/:id/status`   | Update booking status | Dealer  |
| DELETE | `/api/bookings/:id`          | Delete booking        | Dealer  |

## Collection
https://drive.google.com/drive/folders/1yNOJC4pMJZI8MTdY1LOha2cHkdDCLGGK?usp=sharing