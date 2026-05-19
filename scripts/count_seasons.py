import pandas as pd

df = pd.read_csv("Data.csv", low_memory=False)
matches = df.groupby('season')['match_id'].nunique().reset_index()
matches = matches.rename(columns={'match_id': 'match_count'})
print(matches.to_string(index=False))
