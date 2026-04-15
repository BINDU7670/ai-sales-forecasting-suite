import pandas as pd
df = pd.read_csv('data/orders.csv')
print("Column names found in CSV:", df.columns.tolist())