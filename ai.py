import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GROQ_API_KEY")

def get_ai_narrative(metrics, forecast):
    if not api_key:
        return "AI Narrative unavailable: GROQ_API_KEY not found in .env"

    try:
        client = Groq(api_key=api_key)
        
        # We use 'metrics' and 'forecast' here because they are the arguments
        # passed into the function above.
        prompt = f"""
        As a Senior Business Analyst, transform the following raw data into a professional executive report.
        
        DATA: {metrics}
        FORECAST: {forecast}

        REQUIREMENTS:
        1. All currency values must be in Indian Rupees (₹) using the Indian numbering system (e.g., Lakhs).
        2. Use clear headings: 'Business Performance', 'Regional Insights', 'Product Affinity', and 'Future Outlook'.
        3. Explain 'Variance' as inconsistent order sizes and 'Growth' as sales momentum.
        4. Highlight the declining 8-month trend and suggest a brief action plan.
        5. Use bullet points for readability. DO NOT return code or JSON blocks.
        """
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile", 
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
        )
        
        return completion.choices[0].message.content
    except Exception as e:
        return f"AI Analysis failed: {str(e)}"