

**PayTM Application**



The PayTM  Application aims to replicate some of the core
functionalities of the popular payment platform PayTM.
It allows users to perform various actions such as signing up, logging in, checking balances, and sending money to other users.

**Features**

1. **User Authentication:**
   - Signup and login functionalities are provided for users to create and access their accounts securely.

2. **Account Management:**
   - Accounts are created with random balances to simulate real-world scenarios.

3. **Displaying User Balance:**
   - Users can view their account balance after logging in.

4. **User Search and Profile Viewing:**
   - Users can search for other users and view own profile.

5. **Money Transfer:**
   - Users can send money to other users within the application.

**Technologies Used**

**Frontend:**
- React: A JavaScript library for building user interfaces.
- Axios: A promise-based HTTP client for making HTTP requests.
- React Router: A routing library for React to enable navigation in the application.

**Backend:**
- Node.js with Express.js: A web application framework for building APIs and web servers with Node.js.
- MongoDB: A NoSQL database for storing and managing application data.
- JWT (JSON Web Tokens): A compact, URL-safe means of representing claims to be transferred between two parties securely.
- Crypto: A Node.js module for cryptographic operations, used for securely hashing passwords and implementing user authentication.

**Getting Started**

1. Clone this repository to your local machine.
2. Navigate to the `frontend` directory and run `npm install` to install frontend dependencies.
3. Navigate to the `backend` directory and run `npm install` to install backend dependencies.
4. Start the backend server by running `nodemon`.
5. Start the frontend development server by running `npm run dev` in the frontend directory.
6. Access the application in your browser at http://localhost:3000.
