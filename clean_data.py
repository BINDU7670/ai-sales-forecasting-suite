import pandas as pd
import os

def load_and_clean_data():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    orders_path = os.path.join(base_dir, 'data', 'orders.csv')
    details_path = os.path.join(base_dir, 'data', 'details.csv')
    
    if not os.path.exists(orders_path) or not os.path.exists(details_path):
        raise Exception(f"Files not found. Ensure they are in: {os.path.join(base_dir, 'data')}")

    # FIX: Use sep=None and engine='python' to automatically detect if it's a comma or a tab
    orders = pd.read_csv(orders_path, sep=None, engine='python')
    details = pd.read_csv(details_path, sep=None, engine='python')

    # Clean up column names (removes extra spaces and tab characters)
    orders.columns = orders.columns.str.strip()
    details.columns = details.columns.str.strip()

    # Re-verify 'Order Date' existence
    if 'Order Date' not in orders.columns:
        # If it's still missing, it's likely a character encoding issue or a specific tab issue
        # This fallback manually splits if the auto-detection failed
        if len(orders.columns) == 1:
            col_name = orders.columns[0]
            if '\t' in col_name:
                orders = pd.read_csv(orders_path, sep='\t')
                orders.columns = orders.columns.str.strip()

    # Convert Date - DD-MM-YYYY format
    orders['Order Date'] = pd.to_datetime(orders['Order Date'], dayfirst=True, errors='coerce')
    
    # Merge datasets
    df = pd.merge(details, orders, on='Order ID')
    
    # Remove any invalid dates or missing values
    df = df.dropna(subset=['Order Date', 'Amount'])
    
    return df