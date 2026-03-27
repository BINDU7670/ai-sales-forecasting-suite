from sqlalchemy.ext.asyncio import AsyncSession
from models import Dataset, Forecast, Analytics

# ✅ CREATE DATASET
async def create_dataset(db: AsyncSession, name: str, file_path: str):
    new_dataset = Dataset(name=name, file_path=file_path)
    db.add(new_dataset)
    await db.commit()
    await db.refresh(new_dataset)
    return new_dataset


# ✅ STORE FORECAST
async def save_forecast(db: AsyncSession, dataset_id: int, predicted_value: float, confidence: float):
    forecast = Forecast(
        dataset_id=dataset_id,
        predicted_value=predicted_value,
        confidence=confidence
    )
    db.add(forecast)
    await db.commit()
    await db.refresh(forecast)
    return forecast


# ✅ STORE ANALYTICS (KPI)
async def save_analytics(db: AsyncSession, dataset_id: int, total_revenue: float, avg_sales: float, growth_rate: float):
    analytics = Analytics(
        dataset_id=dataset_id,
        total_revenue=total_revenue,
        avg_sales=avg_sales,
        growth_rate=growth_rate
    )
    db.add(analytics)
    await db.commit()
    await db.refresh(analytics)
    return analytics


# ✅ SOFT DELETE
async def soft_delete_dataset(db: AsyncSession, dataset_id: int):
    dataset = await db.get(Dataset, dataset_id)
    if dataset:
        dataset.is_deleted = True
        await db.commit()
    return dataset