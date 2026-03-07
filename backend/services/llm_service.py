# LLM Service for Sales Forecasting
# This module prepares prompts and processes AI insights

def generate_sales_prompt(data):
    """
    Prepare prompt for AI model to analyze sales data
    """
    prompt = f"""
    Analyze the following sales dataset and identify:
    1. Sales trends
    2. High performing products
    3. Forecast for next month

    Data:
    {data}
    """
    return prompt


def generate_sales_summary(result):
    """
    Convert AI response into a simple readable summary
    """
    summary = f"AI Sales Insight: {result}"
    return summary
