from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from api.routes import auth_router, goals_router

app = FastAPI()

app.include_router(auth_router)
app.include_router(goals_router)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    schema = get_openapi(title="Finastar API", version="1.0.0", routes=app.routes)
    schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    for path in schema["paths"].values():
        for method in path.values():
            method["security"] = [{"BearerAuth": []}]
    app.openapi_schema = schema
    return schema

app.openapi = custom_openapi

@app.get("/")
def read_root():
    return {"message": "Finastar API"}