from sqlalchemy import Column, Integer, String, Float, Boolean
from database import Base

# 1. DATASET TABLE
class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    file_path = Column(String)
    is_deleted = Column(Boolean, default=False)


# 2. FORECAST TABLE
class Forecast(Base):
    __tablename__ = "forecasts"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer)
    predicted_value = Column(Float)
    confidence = Column(Float)


# 3. ANALYTICS TABLE
class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer)
    total_revenue = Column(Float)
    avg_sales = Column(Float)
    growth_rate = Column(Float)