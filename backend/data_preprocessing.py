import pandas as pd

def preprocess_data(file_path):

    # Load dataset
    df = pd.read_csv(file_path, sep="\s+")

    # Remove duplicates
    df = df.drop_duplicates()

    # Convert numeric columns
    df['Amount'] = pd.to_numeric(df['Amount'], errors='coerce')
    df['Profit'] = pd.to_numeric(df['Profit'], errors='coerce')
    df['Quantity'] = pd.to_numeric(df['Quantity'], errors='coerce')

    # Handle missing values
    df = df.fillna(0)

    # Reset index
    df = df.reset_index(drop=True)

    return df