import pandas as pd
import numpy as np

def get_sales_forecast(df, months=8):
    monthly_sales = df.groupby(df['Order Date'].dt.to_period('M'))['Amount'].sum()
    monthly_sales_df = monthly_sales.reset_index()
    monthly_sales_df['MonthNum'] = np.arange(len(monthly_sales_df))
    
    # Linear Regression (y = mx + c)
    z = np.polyfit(monthly_sales_df['MonthNum'], monthly_sales_df['Amount'], 1)
    p = np.poly1d(z)
    
    last_month = monthly_sales.index[-1]
    forecast_results = {}
    
    for i in range(1, months + 1):
        future_month = (last_month + i).strftime('%Y-%m')
        prediction = p(len(monthly_sales_df) + i - 1)
        forecast_results[future_month] = round(max(0, prediction), 2)
        
    return forecast_results