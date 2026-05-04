import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

def get_ai_insight(kpis: dict, user_api_key: str = None) -> dict:
    if not user_api_key:
        return {
            "summary": "AI Insight unavailable. Please configure your personal Groq API Key in Settings.",
            "recommendation": "Set API key in Settings to enable live insights.",
            "insights": []
        }

    client = OpenAI(
        base_url="https://api.groq.com/openai/v1",
        api_key=user_api_key
    )
    
    prompt = f"""
    Act as a high-level business data analyst. Analyze these retail KPIs for a dynamic executive dashboard:
    - Total Revenue: {kpis.get('total_revenue')}
    - Growth Rate: {kpis.get('growth_rate')}
    - Sales Variance: {kpis.get('sales_variance')}
    - Peak Sales Day: {kpis.get('peak_sales_day')}
    - Average Order Value: {kpis.get('average_order_value')}
    
    You MUST return ONLY a valid JSON object with this exact structure:
    { 
        "summary": "A concise 2-3 sentence high-level executive overview of business performance written as a business narrative.",
        "recommendation": "A single actionable recommendation starting with 'Recommended: '",
        "insights": [
            { 
                "title": "Short insight title",
                "description": "Detailed 1-2 sentence insight description based on the data.",
                "impact": "High",
                "type": "opportunity"
            } ,
            { 
                "title": "Short insight title",
                "description": "Detailed 1-2 sentence insight description based on the data.",
                "impact": "Medium",
                "type": "anomaly"
            } ,
            { 
                "title": "Short insight title",
                "description": "Detailed 1-2 sentence insight description based on the data.",
                "impact": "Critical",
                "type": "risk"
            } 
        ]
    } 

    Rules:
    - 'type' MUST be one of: 'opportunity', 'anomaly', 'risk'
    - 'impact' MUST be one of: 'High', 'Medium', 'Critical', 'Low'
    - Return EXACTLY 3 insights — one of each type
    - Return ONLY valid JSON, no markdown fences, no extra text
    """
    
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=700,
            response_format={ "type": "json_object" }
        )
        
        content = response.choices[0].message.content
        return json.loads(content)
        
    except Exception as e:
        print(f"AI Service Error: {str(e)}")
        return {
            "summary": f"Business performance shows a growth rate of {kpis.get('growth_rate', 'N/A')} with a peak sales day of {kpis.get('peak_sales_day', 'N/A')}. Revenue trends indicate stability with monitoring in progress.",
            "recommendation": "Recommended: Maintain current inventory levels and monitor the upcoming seasonal demand cycle closely.",
            "insights": [
                {
                    "title": "Revenue Momentum Detected",
                    "description": f"Current growth rate of {kpis.get('growth_rate', 'N/A')} suggests a positive momentum window. Consider capitalizing with targeted promotions.",
                    "impact": "High",
                    "type": "opportunity"
                },
                {
                    "title": "Sales Variance Requires Monitoring",
                    "description": f"Sales variance of {kpis.get('sales_variance', 'N/A')} indicates some instability. Investigate period-over-period fluctuations for root cause.",
                    "impact": "Medium",
                    "type": "anomaly"
                },
                {
                    "title": "Peak Demand Concentration Risk",
                    "description": "Revenue appears concentrated around a single peak period. Over-reliance on peak days increases susceptibility to demand shocks.",
                    "impact": "Critical",
                    "type": "risk"
                }
            ]
        }

def chat_with_ai(kpis: dict, history: list, message: str, user_api_key: str = None,
                 forecast_context: dict = None) -> str:
    if not user_api_key:
        return "I am currently disconnected. Please configure your personal Groq API Key in your Profile Settings."

    client = OpenAI(
        base_url="https://api.groq.com/openai/v1",
        api_key=user_api_key
    )

    
    forecast_section = ""
    if forecast_context:
        fi = forecast_context.get("feature_importance") or []
        fi_text = ", ".join([f"{f['name']} ({f['value']:.0f}%)" for f in fi[:5]]) if fi else "Not available"

        active_inputs = []
        if forecast_context.get("marketing_spend", 0) > 0:
            active_inputs.append(f"Marketing Spend +{forecast_context['marketing_spend']}%")
        if forecast_context.get("holiday_boost", 0) > 0:
            active_inputs.append(f"Holiday Boost +{forecast_context['holiday_boost']}%")
        if forecast_context.get("use_weather"):
            active_inputs.append("Weather data (Open-Meteo)")
        if forecast_context.get("use_macro"):
            active_inputs.append("Macroeconomic data (FRED Unemployment Rate)")
        if forecast_context.get("ignore_anomaly"):
            active_inputs.append("Viral Spike Filter (95th percentile clipping)")
        inputs_text = ", ".join(active_inputs) if active_inputs else "None"

        points = forecast_context.get("forecast_points") or []
        points_text = "Not available"
        if points:
            
            formatted_points = [f"{p['date']}: ${p['value']/1000:.1f}k (Inv: {p['inventory']/1000:.1f}k)" for p in points[:12]]
            points_text = ", ".join(formatted_points)
            if len(points) > 12:
                points_text += f" ... (+{len(points)-12} more periods)"

        forecast_section = f"""
Latest AI Forecast Results (XGBoost + Holt-Winters Model):
- Trend direction: {forecast_context.get('trend', 'N/A')}
- Historical growth rate: {forecast_context.get('growth_rate', 'N/A')}
- AI Confidence score: {forecast_context.get('confidence_score', 'N/A')}%
- Average historical period revenue: {forecast_context.get('avg_historical', 'N/A')}
- Projected total (forecast horizon): {forecast_context.get('projected_total', 'N/A')}
- Data points used to train model: {forecast_context.get('data_points', 'N/A')}
- Dataset date range: {forecast_context.get('date_range', 'N/A')}
- Active model inputs applied: {inputs_text}
- Top XGBoost feature drivers: {fi_text}
- Projected Points Timeline: {points_text}
"""

    system_prompt = f"""You are a high-level business data analyst and strategic AI assistant integrated into an executive sales forecasting dashboard.

Current Dashboard KPIs (from user's uploaded dataset):
- Total Revenue: {kpis.get('total_revenue', 'N/A')}
- Growth Rate: {kpis.get('growth_rate', 'N/A')}
- Average Order Value: {kpis.get('average_order_value', 'N/A')}
- Peak Sales Day: {kpis.get('peak_sales_day', 'N/A')}
- Sales Variance: {kpis.get('sales_variance', 'N/A')}
{forecast_section}
You have full awareness of all KPIs, the AI forecast model results, XGBoost feature drivers, and any active data inputs (weather, macro, sliders).
Answer the user's strategic questions using this data. Be concise, professional, and directly state actionable insights.
Use Markdown for formatting if helpful (e.g., bolding important metrics). Never say you don't have data if it's listed above."""

    messages = [{"role": "system", "content": system_prompt}]
    
    for msg in history[-10:]:
        messages.append({
            "role": msg.get("role", "user") if isinstance(msg, dict) else msg.role, 
            "content": msg.get("content", "") if isinstance(msg, dict) else msg.content
        })
        
    messages.append({"role": "user", "content": message})

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=800
        )
        return response.choices[0].message.content
        
    except Exception as e:
        print(f"AI Service Error (Chat): {str(e)}")
        return "I am currently experiencing higher than normal analytical load. Please try your request again shortly."


def get_forecast_narrative(summary_stats: dict, horizon: int, aggregation: str,
                           category: str = None, user_api_key: str = None,
                           marketing_spend: int = 0, holiday_boost: int = 0,
                           use_weather: bool = False, use_macro: bool = False,
                           ignore_anomaly: bool = False,
                           feature_importance: list = None) -> str:
    """Generate a natural-language forecast explanation using AI."""
    if not user_api_key:
        trend = summary_stats.get("trend", "stable")
        projected = summary_stats.get("projected_total", "N/A")
        return (
            f"Based on historical data, revenue shows a {trend} trend. "
            f"The model projects {projected} over the next {horizon} {aggregation.lower()} periods.\n"
            f"(Please configure your personal Groq API Key in Settings for deep AI projections)"
        )

    client = OpenAI(base_url="https://api.groq.com/openai/v1", api_key=user_api_key)
    cat_note = f" for the '{category}' category" if category else ""

    
    active_inputs = []
    if marketing_spend > 0:
        active_inputs.append(f"Marketing Spend boost of +{marketing_spend}%")
    if holiday_boost > 0:
        active_inputs.append(f"Holiday Season Effect of +{holiday_boost}%")
    if use_weather:
        active_inputs.append("real-time Weather data (Open-Meteo temperature feed)")
    if use_macro:
        active_inputs.append("Macroeconomic data (FRED US Unemployment Rate)")
    if ignore_anomaly:
        active_inputs.append("Viral Spike filter (95th percentile anomaly removal)")
    inputs_note = ("Active AI inputs: " + ", ".join(active_inputs) + ".") if active_inputs else "No external inputs or sliders were applied."

    
    fi_note = ""
    if feature_importance:
        top_features = feature_importance[:3]
        fi_note = "Top XGBoost feature drivers: " + ", ".join([f"{f['name']} ({f['value']:.0f}%)" for f in top_features]) + "."

    prompt = f"""You are an expert business analyst embedded in an AI forecasting dashboard.
Analyze the following forecast summary{cat_note} and write a professional, concise 3-4 sentence
explanation of the {horizon}-period {aggregation} forecast that references the active AI inputs.

Forecast Stats:
- Trend direction: {summary_stats.get('trend')}
- Growth rate (historical): {summary_stats.get('growth_rate')}
- Confidence score: {summary_stats.get('confidence_score')}%
- Average historical period revenue: {summary_stats.get('avg_historical')}
- Projected total over forecast horizon: {summary_stats.get('projected_total')}
- Historical data points used: {summary_stats.get('data_points')}

Model Inputs:
- {inputs_note}
- {fi_note if fi_note else 'Feature importance not available.'}

Instructions:
- Mention the trend direction and projected total clearly.
- Briefly reference 1-2 of the active model inputs if any, explaining how they shaped the forecast.
- Mention the top driving feature from XGBoost if available.
- End with one concrete strategic recommendation.
- Write in a direct, professional tone. No bullet points. Plain prose only."""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=350,
        )
        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"Forecast Narrative Error: {str(e)}")
        trend = summary_stats.get("trend", "stable")
        projected = summary_stats.get("projected_total", "N/A")
        confidence = summary_stats.get("confidence_score", "N/A")
        return (
            f"Based on the historical analysis, sales show a {trend} trend{cat_note}. "
            f"The model projects {projected} in total revenue over the next {horizon} "
            f"{aggregation.lower()} periods with a {confidence}% confidence score. "
            f"{inputs_note} "
            f"Align inventory and promotional spend with the projected demand curve "
            f"to maximize capture of the upcoming growth window."
        )
