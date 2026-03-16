from fastapi import FastAPI
from data_upload import router as upload_router

app = FastAPI(
    title="AI Sales Forecasting Suite",
    description="API for uploading and processing sales datasets",
    version="1.0.0"
)

# Include the upload router
app.include_router(upload_router)


@app.get("/")
async def root():
    return {"message": "AI Sales Forecasting Suite API is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
