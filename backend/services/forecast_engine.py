import pandas as pd
import numpy as np
from datetime import timedelta
import os
import requests
from statsmodels.tsa.holtwinters import ExponentialSmoothing

try:
    import xgboost as xgb
except ImportError:
    xgb = None

FRED_API_KEY = os.getenv("FRED_API_KEY", "")

def fetch_weather_data(start_date, end_date):
    """Fetch historical daily max temperatures from Open-Meteo (New York approx)."""
    url = f"https://archive-api.open-meteo.com/v1/archive"
    
    archive_end = pd.to_datetime(end_date)
    today = pd.Timestamp.now()
    if archive_end > today - pd.Timedelta(days=5):
        archive_end = today - pd.Timedelta(days=5)
    
    if archive_end < pd.to_datetime(start_date):
        
        url = "https://api.open-meteo.com/v1/forecast"
        
    params = {
        "latitude": 40.7128,
        "longitude": -74.0060,
        "start_date": start_date.strftime('%Y-%m-%d'),
        "end_date": end_date.strftime('%Y-%m-%d'),
        "daily": "temperature_2m_max",
        "timezone": "America/New_York"
    }
    try:
        r = requests.get(url, params=params, timeout=5)
        if r.status_code == 200:
            data = r.json()
            if "daily" in data:
                return pd.DataFrame({
                    "date": pd.to_datetime(data["daily"]["time"]),
                    "temp_max": data["daily"]["temperature_2m_max"]
                })
    except Exception as e:
        print("Weather API error:", e)
    return pd.DataFrame(columns=["date", "temp_max"])

def fetch_macro_data(start_date, end_date):
    """Fetch US Unemployment Rate from FRED as a macro proxy."""
    if not FRED_API_KEY:
        return pd.DataFrame(columns=["date", "unrate"])
    url = "https://api.stlouisfed.org/fred/series/observations"
    params = {
        "series_id": "UNRATE",
        "api_key": FRED_API_KEY,
        "file_type": "json",
        "observation_start": start_date.strftime('%Y-%m-%d'),
        "observation_end": end_date.strftime('%Y-%m-%d')
    }
    try:
        r = requests.get(url, params=params, timeout=5)
        if r.status_code == 200:
            data = r.json()
            if "observations" in data:
                obs = data["observations"]
                df = pd.DataFrame(obs)
                df["date"] = pd.to_datetime(df["date"])
                df["unrate"] = pd.to_numeric(df["value"], errors="coerce")
                return df[["date", "unrate"]]
    except Exception as e:
        print("FRED API error:", e)
    return pd.DataFrame(columns=["date", "unrate"])


def _find_col(cols_map: dict, *candidates):
    for c in candidates:
        if c in cols_map:
            return cols_map[c]
    return None

def run_forecast(file_path: str, horizon: int = 30, aggregation: str = "Monthly",
                 category_filter: str = None, marketing_spend: int = 0, holiday_boost: int = 0,
                 use_weather: bool = False, use_macro: bool = False, ignore_anomaly: bool = False):
    
    try:
        if file_path.endswith(".csv"):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)

        cols = {str(c).lower().strip(): c for c in df.columns}
        amount_col = _find_col(cols, "amount", "sales", "revenue", "total", "price", "sale amount")
        date_col = _find_col(cols, "date", "order date", "transaction date", "sale date", "order_date", "transaction_date")
        category_col = _find_col(cols, "category", "segment", "dept", "department", "type", "product category")

        if not amount_col or not date_col:
            return {"status": "error", "message": "Dataset must contain Date and Sales/Amount columns."}

        df[amount_col] = pd.to_numeric(df[amount_col], errors="coerce").fillna(0)
        df[date_col] = pd.to_datetime(df[date_col], errors="coerce")
        df = df.dropna(subset=[date_col])

        categories = []
        if category_col:
            categories = sorted([str(x) for x in df[category_col].unique() if pd.notnull(x)])
        if category_filter and category_col:
            df = df[df[category_col].astype(str) == category_filter]

        if df.empty:
            return {"status": "error", "message": f"No data for category: {category_filter}"}

        df = df.sort_values(date_col)
        agg_map = {"Daily": "D", "Weekly": "W", "Monthly": "ME"}
        freq = agg_map.get(aggregation, "ME")

        ts = df.set_index(date_col)[amount_col].resample(freq).sum()
        ts = ts[ts > 0]

        if len(ts) < 5:
            return {"status": "error", "message": "Not enough data points after aggregation."}

        y = ts.values.astype(float)
        
        
        if ignore_anomaly:
            q95 = np.percentile(y, 95)
            y = np.where(y > q95, np.median(y), y)

        
        
        
        seasonal_periods = {"Monthly": 12, "Weekly": 52, "Daily": 7}.get(aggregation, 12)
        use_seasonal = (seasonal_periods is not None) and (len(y) >= 2 * seasonal_periods)
        
        try:
            if use_seasonal:
                hw_model = ExponentialSmoothing(y, trend='add', seasonal='add', seasonal_periods=seasonal_periods, initialization_method="estimated").fit()
            else:
                hw_model = ExponentialSmoothing(y, trend='add', initialization_method="estimated").fit()
        except:
            hw_model = ExponentialSmoothing(y, initialization_method="estimated").fit()

        hw_fitted = hw_model.fittedvalues
        hw_forecast = hw_model.forecast(horizon)
        std_resid = float(np.std(y - hw_fitted))

        
        
        
        xgb_forecast = hw_forecast.copy()
        feature_importance_dict = {}
        
        df_xgb = pd.DataFrame({"date": ts.index, "sales": y})
        
        
        df_xgb["month"] = df_xgb["date"].dt.month
        df_xgb["dayofweek"] = df_xgb["date"].dt.dayofweek
        df_xgb["lag_1"] = df_xgb["sales"].shift(1).bfill()
        df_xgb["trend_time"] = np.arange(len(df_xgb))
        
        features = ["month", "dayofweek", "lag_1", "trend_time"]
        
        
        full_start_date = df_xgb["date"].min()
        if freq == "D":
            delta = timedelta(days=1)
        elif freq == "W":
            delta = timedelta(weeks=1)
        else:
            delta = pd.DateOffset(months=1)
            
        full_end_date = df_xgb["date"].max() + (delta * horizon)
        
        if use_weather:
            weather_df = fetch_weather_data(full_start_date, full_end_date)
            if not weather_df.empty:
                weather_df = weather_df.set_index("date").resample(freq).mean().reset_index()
                df_xgb = pd.merge(df_xgb, weather_df, on="date", how="left")
                df_xgb["temp_max"] = df_xgb["temp_max"].ffill().bfill().fillna(20)
                features.append("temp_max")

        if use_macro:
            macro_df = fetch_macro_data(full_start_date, full_end_date)
            if not macro_df.empty:
                macro_df = macro_df.set_index("date").resample(freq).mean().reset_index()
                df_xgb = pd.merge(df_xgb, macro_df, on="date", how="left")
                df_xgb["unrate"] = df_xgb["unrate"].ffill().bfill().fillna(4.0)
                features.append("unrate")
                
        
        if xgb is not None and len(df_xgb) > 3:
            X_train = df_xgb[features]
            y_train = df_xgb["sales"]
            
            model_xgb = xgb.XGBRegressor(n_estimators=50, max_depth=3, learning_rate=0.1, random_state=42)
            model_xgb.fit(X_train, y_train)
            
            
            fi = model_xgb.feature_importances_
            base_fi = {f: float(imp)*100 for f, imp in zip(features, fi)}
            
            
            future_dates = [ts.index[-1] + (delta * i) for i in range(1, horizon + 1)]
            df_future = pd.DataFrame({"date": future_dates})
            df_future["month"] = df_future["date"].dt.month
            df_future["dayofweek"] = df_future["date"].dt.dayofweek
            df_future["trend_time"] = np.arange(len(df_xgb), len(df_xgb) + horizon)
            
            
            future_lag = np.concatenate(([y[-1]], hw_forecast[:-1]))
            df_future["lag_1"] = future_lag
            
            if use_weather and "temp_max" in df_xgb.columns:
                df_future = pd.merge(df_future, weather_df, on="date", how="left")
                df_future["temp_max"] = df_future["temp_max"].fillna(df_xgb["temp_max"].mean())
                
            if use_macro and "unrate" in df_xgb.columns:
                df_future = pd.merge(df_future, macro_df, on="date", how="left")
                df_future["unrate"] = df_future["unrate"].fillna(float(np.array(df_xgb["unrate"])[-1]))
                
            xgb_raw = model_xgb.predict(df_future[features])
            
            
            
            marketing_mult = 1.0 + (marketing_spend / 100.0 * 0.5) 
            
            holiday_mult = np.ones(horizon)
            if holiday_boost > 0:
                holiday_mult[int(horizon/2):] = 1.0 + (holiday_boost / 100.0 * 0.8)
                
            xgb_forecast = xgb_raw * marketing_mult * holiday_mult
            
            feature_importance_dict = base_fi
            if marketing_spend > 0:
                feature_importance_dict["Marketing Spend"] = marketing_spend * 0.5
            if holiday_boost > 0:
                feature_importance_dict["Holiday Boost"] = holiday_boost * 0.5
                
            
            total_fi = sum(feature_importance_dict.values())
            if total_fi > 0:
                feature_importance_dict = {k: (v/total_fi)*100 for k,v in feature_importance_dict.items()}
                
        else:
            
            xgb_forecast = hw_forecast * (1.0 + marketing_spend/200.0)
            feature_importance_dict = {"Historical Trend": 100.0}

        
        
        
        fmt = {"Daily": "%d %b %Y", "Weekly": "%d %b %Y", "Monthly": "%b %Y"}.get(aggregation, "%b %Y")

        historical = [{"date": dt.strftime(fmt), "historical": round(float(val), 2)} for dt, val in zip(ts.index, ts.values)]
        
        
        avg_val = float(np.mean(y))
        current_inventory = avg_val * 3.0

        forecast = []
        projected_total = 0.0

        for i in range(horizon):
            hw_val = max(0, float(np.array(hw_forecast)[i]))
            xgb_val = max(0, float(xgb_forecast[i]))
            
            
            current_inventory -= xgb_val
            if current_inventory < avg_val * 0.5:
                current_inventory += avg_val * 2.5 
                
            step = i + 1
            margin = std_resid * (1 + 0.08 * step)
            upper = round(xgb_val + margin, 2)
            lower = round(max(0, xgb_val - margin), 2)

            proj_date = ts.index[-1] + delta * (i + 1)
            forecast.append({
                "date": proj_date.strftime(fmt),
                "predictedHoltWinters": round(hw_val, 2),
                "predictedXGBoost": round(xgb_val, 2),
                "upper": upper,
                "lower": lower,
                "inventory": round(current_inventory, 2)
            })
            projected_total += xgb_val

        
        overall_slope = float(np.array(hw_fitted)[-1] - np.array(hw_fitted)[0]) / len(hw_fitted) if len(hw_fitted) >= 2 else 0.0
        trend = "upward" if overall_slope > avg_val * 0.01 else "downward" if overall_slope < -avg_val * 0.01 else "flat"
        confidence_score = max(50, min(98, int(100 - (std_resid / avg_val) * 100))) if avg_val > 0 else 50
        
        mid = len(y) // 2
        first_half, second_half = float(np.sum(y[:mid])), float(np.sum(y[mid:]))
        growth_rate = ((second_half - first_half) / first_half) * 100 if first_half > 0 else 0.0

        
        fi_mapped = []
        for k, v in feature_importance_dict.items():
            name_map = {"lag_1": "Lag (Past Sales)", "month": "Month Seasonality", "dayofweek": "Day of Week", "trend_time": "Time Trend", "temp_max": "Weather (Temp)", "unrate": "Macro (Unemployment)"}
            fi_mapped.append({"name": name_map.get(k, k), "value": round(v, 1)})
        fi_mapped.sort(key=lambda x: x["value"], reverse=True)

        return {
            "status": "success",
            "historical": historical,
            "forecast": forecast,
            "feature_importance": fi_mapped,
            "summary_stats": {
                "trend": trend,
                "confidence_score": confidence_score,
                "projected_total": f"${projected_total:,.0f}",
                "avg_historical": f"${avg_val:,.0f}",
                "growth_rate": f"{growth_rate:+.1f}%",
                "slope": round(overall_slope, 4),
                "data_points": len(ts),
            },
            "categories": categories,
            "date_range": f"{ts.index.min().strftime('%b %Y')} - {ts.index.max().strftime('%b %Y')}",
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"status": "error", "message": str(e)}
