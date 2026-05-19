import pandas as pd

df = pd.read_csv("Data.csv", low_memory=False)
df_matches = df.drop_duplicates(subset=['match_id']).copy()

venues = df_matches.groupby('venue').size().reset_index(name='count').sort_values(by='count', ascending=False)
for idx, row in venues.iterrows():
    print(f"'{row['venue']}': {row['count']}")
