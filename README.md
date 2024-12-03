# Financial App - Deposit Management System

This is a financial management app where users can post deposits, cash out their balances, and generate reports with interest calculations. The app integrates a context API to manage user authentication, transaction data, and reports.

## Features

- **User Authentication**: Register, login, and reset passwords.
- **Deposit Management**: Users can post deposits at different intervals (daily, weekly, monthly, yearly).
- **Cashout Mechanism**: Users can cash out from their deposited balance.
- **Interest Calculation**: The app calculates interest of 7% per year on deposits, with the calculation varying based on the deposit interval.
- **Reports**: Generate reports that include total balance, interest, and remaining balance per commitment.UI
  se

## Technologies Used

- **Frontend**: React.js, Material UI
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Token)
- **State Management**: Context API
- **API Communication**: Axios for HTTP requests

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/dagmaros27/financial-app.git
   ```

2. **Install Dependencies**

   **Frontend**:
   Navigate to the frontend directory and install dependencies:

   ```bash
   cd frontend
   npm install
   ```

   **Backend**:
   Navigate to the backend directory and install dependencies:

   ```bash
   cd backend
   npm install
   ```

3. **Set Up Environment Variables**
   In the backend directory, create a `.env` file with the following variables:

   ```makefile
   MONGO_URI=mongodb://localhost:27017/financial-app
   JWT_SECRET=your-secret-key
   PORT=5000
   SMTP_USER = your email provider
   SMTP_PASS = your email provider password
   ```

   For production, you can replace `localhost` with your MongoDB Atlas URI.

4. **Start the Development Servers**

   **Frontend**:

   ```bash
   cd frontend
   npm run dev
   ```

   **Backend**:

   ```bash
   cd backend
   npm run dev
   ```

   The backend server will run on `http://localhost:5000`, and the frontend will be available at `http://localhost:5173`.

## Usage

### Authentication

- **Register**: Users can create an account by providing a username, email, and password.
- **Login**: Users can log in with their email and password.
- **Reset Password**: Users can reset their password via email if they forget it.

### Deposits

- **Add Deposit**: Users can add deposits by specifying the amount and the interval (daily, weekly, monthly, yearly). The deposit is saved, and the system will calculate the interest at a rate of 7% per year, depending on the interval.
- **Cashout**: Users can withdraw money from their deposits at any time. The cashout is processed based on their balance and the deposited amounts.

### Reports

- **Generate Reports**: Users can view reports that summarize their deposits, the interest earned, and the remaining balance per commitment. Reports are automatically updated as new deposits are made.

## Endpoints

### User Endpoints

- `POST /api/user/`: Register a new user
- `POST /api/user/login`: Login and get a JWT token
- `POST /api/user/forgot-password`: Send a password reset email
- `POST /api/user/reset-password`: Reset the password

### Transaction Endpoints

- `POST /api/transaction/deposit`: Post a new deposit
  - Body: `{ "amount": number, "interval": string }`
- `POST /api/transaction/cashout`: Request a cashout
  - Body: `{ "amount": number }`
- `GET /api/transaction/reports`: Get reports of deposits and interest

## State Management (Context API)

The `AppContext` is used to manage global state, including:

- **User state**: Stores user data and authentication status.
- **Transaction state**: Stores the list of deposits and cashouts.
- **Report state**: Stores the generated reports.

### How to Use Context API in Components

- Wrap your application with `AppProvider` to provide global state.
- Access context values with `useContext(AppContext)` in any component.

## Folder Structure

```bash
/frontend
  /public
  /src
    /components
    /context
    /pages
    /services
    /themes
    /utils
    /App.js
    /index.js
/backend
  /models
    /User.js
    /Transaction.js
  /controllers
    /userController.js
    /transactionController.js
   /middleware
    /auth.js
    /error.js
  /routes
    /userRoutes.js
    /transactionRoutes.js
   /utils
      /db.js
      /generateToken.js
      /sendOtp.js
  /app.js
  /server.js
```

### Frontend

- **components/**: Contains reusable UI components like `NavBar`.
- **context/**: Contains the `AppContext` and provider for state management.
- **pages/**: Contains different pages like `Dashboard`, `Reports`, etc.
- **App.js**: Main entry file for setting up routes and context provider.

### Backend

- **models/**: Defines Mongoose models for `User` and `Transaction`.
- **controllers/**: Contains the logic for user registration, login, deposit posting, and report generation.
- **middleware/**: Contains middleware functions for authentication and error handling.
- **routes/**: Defines the routes for each endpoint.
- **utils/**: Contains utility functions like database connection and token generation.
- **app.js**: Sets up Express, middleware, and routes.
- **server.js**: Starts the Express server.

## Error Handling

All API requests handle errors and provide feedback to the user. For example, if a user tries to post a deposit with an invalid amount, an error message will be displayed.

## Conclusion

This application allows users to manage their financial deposits, cashouts, and generate reports with interest calculations. The use of React’s Context API makes state management efficient and accessible across components, while Axios handles communication with the backend.
