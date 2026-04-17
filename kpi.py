import pandas as pd
import numpy as np

def get_kpi_metrics(df):
    total_revenue = float(df['Amount'].sum())
    avg_sales = float(df['Amount'].mean())
    
    # Peak Date
    daily_sales = df.groupby('Order Date')['Amount'].sum()
    peak_date = daily_sales.idxmax().strftime('%Y-%m-%d')
    
    # Variance
    variance = float(df['Amount'].var())
    
    # Growth Rate (Monthly)
    monthly_sales = df.groupby(df['Order Date'].dt.to_period('M'))['Amount'].sum()
    growth_rate = float(monthly_sales.pct_change().mean() * 100)
    
    # Top 5 States (Heatmap Data)
    top_states = df.groupby('State')['Amount'].sum().sort_values(ascending=False).head(5).to_dict()
    
    # Basket Analysis (Most frequent sub-category pairs)
    # Simple logic: items frequently bought in the same order
    basket = df.groupby('Order ID')['Sub-Category'].apply(list)
    common_pairs = {}
    for items in basket:
        if len(items) > 1:
            items.sort()
            for i in range(len(items)):
                for j in range(i + 1, len(items)):
                    pair = f"{items[i]} & {items[j]}"
                    common_pairs[pair] = common_pairs.get(pair, 0) + 1
    
    sorted_pairs = dict(sorted(common_pairs.items(), key=lambda x: x[1], reverse=True)[:5])

    return {
        "total_revenue": round(total_revenue, 2),
        "avg_sales": round(avg_sales, 2),
        "peak_date": peak_date,
        "variance": round(variance, 2),
        "growth_rate_pct": round(growth_rate, 2),
        "top_states": top_states,
        "basket_analysis": sorted_pairs
    }