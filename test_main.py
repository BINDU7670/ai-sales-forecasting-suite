import pandas as pd
from kpi import get_kpi_metrics

def test_revenue_calculation():
    # Create a tiny fake dataset
    test_df = pd.DataFrame({
        'Amount': [100, 200, 300],
        'Order Date': pd.to_datetime(['2024-01-01', '2024-01-02', '2024-01-03']),
        'State': ['A', 'A', 'B'],
        'Order ID': [1, 2, 3],
        'Sub-Category': ['X', 'Y', 'Z']
    })
    
    metrics = get_kpi_metrics(test_df)
    
    # Assert (Check) if the total is 600
    assert metrics['total_revenue'] == 600.0
    assert metrics['avg_sales'] == 200.0