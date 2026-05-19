import pandas as pd
import json

df = pd.read_csv("Data.csv", low_memory=False)

print("Dataset shape:", df.shape)
print("\nColumns:")
print(df.columns.tolist())

print("\nSeasons present:")
print(df['season'].unique())

print("\nNumber of unique matches:", df['match_id'].nunique())
print("\nSample row:")
print(df.iloc[0].to_dict())
