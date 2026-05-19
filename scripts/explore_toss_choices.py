import pandas as pd

df = pd.read_csv("Data.csv", low_memory=False)
df_matches = df.drop_duplicates(subset=['match_id']).copy()

# Group by season and toss_decision
toss_trends = df_matches.groupby(['season', 'toss_decision']).size().unstack(fill_value=0)
toss_trends['total'] = toss_trends['bat'] + toss_trends['field']
toss_trends['field_pct'] = (toss_trends['field'] / toss_trends['total']) * 100

print("--- Toss Choice Trends by Season ---")
print(toss_trends)
