import pandas as pd
import numpy as np

df = pd.read_csv("Data.csv", low_memory=False)
df_matches = df.drop_duplicates(subset=['match_id']).copy()
df_matches = df_matches[df_matches['winner'].notna()]

# 1. Chasing advantage over seasons
print("--- Chasing Win % by Season ---")
df_matches['chased_won'] = df_matches['winner'] != df_matches['toss_winner']
# Let's be precise about who batted second.
# If toss_winner chose field: team batting second is toss_winner. If toss_winner won, chasing team won.
# If toss_winner chose bat: team batting second is the other team. If other team won, chasing team won.
df_matches['chasing_team'] = np.where(df_matches['toss_decision'] == 'field', df_matches['toss_winner'], np.where(df_matches['team1'] == df_matches['toss_winner'], df_matches['team2'], df_matches['team1']))
df_matches['chase_won'] = df_matches['winner'] == df_matches['chasing_team']

season_chase = df_matches.groupby('season').agg(
    matches=('match_id', 'count'),
    chase_wins=('chase_won', 'sum')
).reset_index()
season_chase['chase_win_pct'] = (season_chase['chase_wins'] / season_chase['matches']) * 100
print(season_chase.to_string(index=False))

# 2. Venue-wise Toss Advantage (min 20 matches)
print("\n--- Venue-wise Toss Win % (Min 20 Matches) ---")
df_matches['toss_winner_won'] = df_matches['toss_winner'] == df_matches['winner']
venue_toss = df_matches.groupby('venue').agg(
    matches=('match_id', 'count'),
    toss_wins=('toss_winner_won', 'sum')
).reset_index()
venue_toss['toss_win_pct'] = (venue_toss['toss_wins'] / venue_toss['matches']) * 100
venue_toss = venue_toss[venue_toss['matches'] >= 20].sort_values(by='toss_win_pct', ascending=False)
print(venue_toss.head(10).to_string(index=False))
print("\nLowest Toss Win % by Venue:")
print(venue_toss.tail(10).to_string(index=False))

# 3. Powerplay wickets lost vs Win %
print("\n--- Powerplay Wickets Lost vs Win % ---")
# Count wickets lost by each team in the Powerplay
df['is_wicket'] = df['wicket_player_out'].notna()
pp_wickets = df[df['over'] <= 5].groupby(['match_id', 'batting_team'])['is_wicket'].sum().reset_index(name='pp_wickets')

# Merge with match winner
pp_w_winner = pp_wickets.merge(df_matches[['match_id', 'winner']], on='match_id')
pp_w_winner['is_winner'] = pp_w_winner['batting_team'] == pp_w_winner['winner']

pp_win_rate = pp_w_winner.groupby('pp_wickets').agg(
    innings=('match_id', 'count'),
    wins=('is_winner', 'sum')
).reset_index()
pp_win_rate['win_pct'] = (pp_win_rate['wins'] / pp_win_rate['innings']) * 100
print(pp_win_rate)
