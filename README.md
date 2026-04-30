# Finastar Project

Welcome to the Finastar project! This application consists of a PostgreSQL database, a Python FastAPI backend, and a modern web frontend. 

Follow the instructions below to set up and run the project locally on your machine.

## Prerequisites

Before you begin, make sure you have the following installed on your computer:
*   [PostgreSQL](https://www.postgresql.org/) (Version 18)
*   [Python 3](https://www.python.org/)
*   [Node.js and npm](https://nodejs.org/)

---

## Getting Started

To run the full application, you need to start the database, the backend, and the frontend. It is best to open a separate terminal window for each of these three steps.

### 1. Start the Database

First, you need to start the PostgreSQL service so the backend can connect to it.
```bash
brew services start postgresql@18
psql postgres