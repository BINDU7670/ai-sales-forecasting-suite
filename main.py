from fastapi import FastAPI
import uvicorn
from clean_data import load_and_clean_data
from kpi import get_kpi_metrics
from forecast import get_sales_forecast
from ai import get_ai_narrative

app = FastAPI(title="AI Sales Forecasting API")

@app.get("/analytics")
async def get_analytics():
    # 1. Load and clean
    df = load_and_clean_data()
    
    # 2. Compute KPIs
    metrics = get_kpi_metrics(df)
    
    # 3. Forecast
    forecast = get_sales_forecast(df)
    
    # 4. Get AI Narrative
    narrative = get_ai_narrative(metrics, forecast)
    
    # 5. Return JSON Output
    return {
        "status": "success",
        "data": {
            "kpi_metrics": metrics,
            "forecast_8_months": forecast
        },
        "executive_summary": narrative
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)