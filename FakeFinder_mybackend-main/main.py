from fastapi import FastAPI

from routers import extract, analyze

app = FastAPI()

app.include_router(extract.router, prefix="/extract")
app.include_router(analyze.router, prefix="/analyze")