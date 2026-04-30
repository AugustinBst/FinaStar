## tech stack

- **backend**: python, fastapi, postgresql
- **frontend**: NextJS, tailwind css, React bit lib, daisy UI
- **database**: postgresql 18

## setup instructions

### database setup

start postgresql service:
```bash
brew services start postgresql@18
psql postgres
```

### backend setup

1. create and activate virtual environment:
```bash
python3 -m venv path/to/venv
source path/to/venv/bin/activate
```

2. install dependencies:
```bash
pip install -r requirements.txt
```

3. start the server:
```bash
uvicorn api.main:app --reload
```

the api will run on `http://localhost:8000`

### frontend setup

start the development server:
```bash
npm run dev
```


## dependencies

make sure you have installed:
- python 3.8+
- postgresql 18
- node.js and npm
- httpx (for async http requests)
- fastapi
- sqlalchemy
