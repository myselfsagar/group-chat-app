# Real-Time Group Chat Application

A web-based group chat application built with Node.js, Express, Sequelize (MySQL), Socket.IO, and AWS S3 for file sharing.

## Key Features ✨

- **User Authentication:** Secure user registration and login using JWT (JSON Web Tokens) and bcrypt for password hashing.
- **Group Management:**
  - Create new chat groups.
  - Invite users to groups via email.
  - View group members.
  - Group administration features (Make Admin, Remove Member) for existing admins.
- **Real-Time Messaging:** Send and receive messages instantly within groups using Socket.IO.
- **File Sharing:** Upload and share files (images, videos, PDFs up to 10MB) within chat groups, stored securely on AWS S3. Files are displayed with previews for images/videos.
- **Message History & Loading:** Loads recent messages from local storage for quick access and fetches older messages from the server on demand ("Load more..." button).
- **Automated Message Archiving:** A cron job runs daily to archive messages older than one day into a separate table (`archived_messages`) to keep the primary `messages` table efficient.
- **Input Validation:** Uses Joi for robust validation of request bodies.

## Technologies Used 💻

- **Backend:** Node.js, Express.js
- **Database:** MySQL with Sequelize ORM
- **Real-time Communication:** Socket.IO
- **Authentication:** JWT (jsonwebtoken), bcrypt
- **File Storage:** AWS SDK (S3), Multer, Multer-S3
- **Scheduled Tasks:** node-cron
- **Validation:** Joi
- **Frontend:** HTML, CSS, Vanilla JavaScript, Axios
- **Environment Variables:** dotenv
- **Development:** Nodemon

## Setup and Installation ⚙️

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/myselfsagar/group-chat-app.git](https://github.com/myselfsagar/group-chat-app.git)
    cd group-chat-app
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the following variables:

    ```env
    # Database Configuration
    DB_NAME=your_database_name
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    DB_HOST=your_database_host
    DIALECT=mysql # or your dialect
    DB_PORT=3306 # optional, defaults to 3306

    # JWT Secret Key
    ACCESS_TOKEN_SECRET_KEY=your_jwt_secret_key

    # AWS Configuration (for S3)
    AWS_REGION=your_aws_region
    AWS_ACCESS_KEY_ID=your_aws_access_key_id
    AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
    AWS_S3_BUCKET_NAME=your_s3_bucket_name

    # Server Port (optional)
    PORT=5000
    ```

4.  **Database Setup:**
    Ensure your MySQL server is running and create the database specified in `DB_NAME`. The application will automatically sync the models (create tables) when it starts.

## Usage 🚀

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This will start the server using Nodemon, which automatically restarts on file changes.
2.  **Start the production server:**
    ```bash
    npm run prod
    ```
    This starts the server in production mode.
3.  **Access the application:**
    Open your web browser and navigate to `http://localhost:PORT` (e.g., `http://localhost:5000` if using the default port).
4.  Register a new user or log in with existing credentials.
5.  Create or join groups and start chatting!

## Project Structure (Simplified) 📂
