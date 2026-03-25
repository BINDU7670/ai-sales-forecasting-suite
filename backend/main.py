# FastAPI entry point
from fastapi import FastAPI
from api.routes.upload import router as upload_router

app = FastAPI(
    title       = "AI Sales Forecasting — Upload Module",
    description = "Data Upload API for the AI Sales Forecasting Suite",
    version     = "1.0.0",
)

app.include_router(upload_router)

@app.get("/")
def root():
    return {"message": "AI Sales Forecasting API is running 🚀"}