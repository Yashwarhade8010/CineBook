
# CineBook

CineBook is a web application that allows movie enthusiasts to **browse**, **book**, and **manage** cinema tickets with ease. Built with a modern tech-stack, it offers a clean UI for users and flexible backend services for power-users.

## 🚀 Features

- Browse movies, showtimes and theatres  
- Register / login as a user  
- Book tickets for available showtimes  
- View your booking history  
- Admin panel for theatre & showtime management (if enabled)  
- Simple, responsive UI for both desktop & mobile  

## 🧪 Tech Stack

- **Backend**: Node.js, Express  
- **Database**: (specify here — MongoDb)  
- **Authentication**: JWT

## 🎯 Getting Started

### Prerequisites  
- Node.js (v14 or later)  
- npm

### Installation  
1. Clone the repo  
   ```bash
   git clone https://github.com/Yashwarhade8010/CineBook.git
   cd CineBook

	2.	Install dependencies

npm install


	3.	Configure environment variables
Create a .env file in the project root and add entries like:

DATABASE_URL="your_database_connection_string"
JWT_SECRET="your_secret_key"

	4.	Start the server

npm run dev

The application should now be running at http://localhost:3000 (or your configured port).

📁 Project Structure

CineBook/
├── prisma/
│   ├── schema.prisma         # Prisma schema
│   └── migrations/           # Migration history
├── server/                   # Backend source code
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── utils/
├── .env                      # Environment variables file
├── package.json
└── README.md


Thank you for checking out CineBook!
