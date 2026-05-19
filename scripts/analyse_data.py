import pandas as pd
import numpy as np

# Load dataset
df = pd.read_csv("Data.csv", low_memory=False)

# Clean team names if there are variations
# Let's inspect unique team names first
print("Unique teams:")
print(sorted(df['team1'].dropna().unique()))

# Filter for matches that have a winner
df_matches = df.drop_duplicates(subset=['match_id']).copy()
print(f"Total matches: {len(df_matches)}")
print(f"Matches with winners: {df_matches['winner'].notna().sum()}")

# 1. Toss Analysis
# Calculate Toss Win %
toss_match = df_matches[df_matches['winner'].notna()].copy()
toss_match['toss_winner_won'] = toss_match['toss_winner'] == toss_match['winner']

toss_win_count = toss_match['toss_winner_won'].sum()
total_toss_matches = len(toss_match)
toss_win_pct = (toss_win_count / total_toss_matches) * 100

print(f"\n--- Toss Win Analysis (All Seasons) ---")
print(f"Total matches with winner: {total_toss_matches}")
print(f"Toss winner won: {toss_win_count} ({toss_win_pct:.2f}%)")
print(f"Toss winner lost: {total_toss_matches - toss_win_count} ({100 - toss_win_pct:.2f}%)")

# Group by toss decision
toss_decision_stats = toss_match.groupby('toss_decision').agg(
    total=('match_id', 'count'),
    won=('toss_winner_won', 'sum')
).reset_index()
toss_decision_stats['win_pct'] = (toss_decision_stats['won'] / toss_decision_stats['total']) * 100
print("\nToss Win % by Decision:")
print(toss_decision_stats)

# Batting first vs chasing win %
toss_match['batting_first_won'] = ((toss_match['toss_decision'] == 'bat') & toss_match['toss_winner_won']) | \
                                  ((toss_match['toss_decision'] == 'field') & ~toss_match['toss_winner_won'])
bat_first_won = toss_match['batting_first_won'].sum()
print(f"\nBatting First won: {bat_first_won} ({bat_first_won / total_toss_matches * 100:.2f}%)")
print(f"Chasing (Batting Second) won: {total_toss_matches - bat_first_won} ({(total_toss_matches - bat_first_won) / total_toss_matches * 100:.2f}%)")

# 2. Phase Analysis
print(f"\n--- Innings Phase Analysis ---")
# Over definitions: Powerplay (0-5), Middle (6-14), Death (15-19)
def get_phase(over):
    if over <= 5:
        return 'Powerplay'
    elif over <= 14:
        return 'Middle'
    else:
        return 'Death'

df['phase'] = df['over'].apply(get_phase)

# Filter matches with a winner
matches_with_winner = df_matches[df_matches['winner'].notna()]['match_id'].unique()
df_valid = df[df['match_id'].isin(matches_with_winner)].copy()

# Add match winner info to ball-by-ball
df_valid = df_valid.merge(df_matches[['match_id', 'winner']], on='match_id', suffixes=('', '_match'))

df_valid['is_winner_batting'] = df_valid['batting_team'] == df_valid['winner']

# We need to aggregate runs scored by winning team and losing team per phase per match
# A match has 2 innings usually.
# Let's group by match_id, innings, is_winner_batting, phase and sum runs_total
phase_runs = df_valid.groupby(['match_id', 'innings', 'is_winner_batting', 'phase'])['runs_total'].sum().reset_index()

# For average runs per phase, we average across matches
# Wait! In some matches, a team might not play the Death phase (e.g. they chased down the target in 14 overs).
# In that case, should their Death runs be counted as 0 or should we divide by total matches?
# If a team finishes in 14 overs, they didn't play Death overs. Dividing by total matches is standard because it represents
# the average runs scored by winning/losing teams in that phase overall. Let's look at average runs.
# Let's calculate the average runs per phase for winning teams vs losing teams.
# Note: we need to ensure each match has a entry for each phase, even if 0 runs.
# Let's create a pivot table or compute the mean directly.
# Let's see the unique match_ids and phases.
all_matches = df_valid['match_id'].unique()
phases = ['Powerplay', 'Middle', 'Death']

# Let's pivot phase_runs
pivot_phase = phase_runs.pivot_table(
    index='match_id',
    columns=['is_winner_batting', 'phase'],
    values='runs_total',
    aggfunc='sum'
).fillna(0) # If a phase wasn't played, they scored 0 runs in it.

print("\nAverage runs by phase:")
# Winner batting = True
print("Winner:")
winner_avg = pivot_phase[True].mean()
print(winner_avg)
# Winner batting = False (Losing team)
print("Loser:")
loser_avg = pivot_phase[False].mean()
print(loser_avg)

print("\nDifference (Winner - Loser):")
print(winner_avg - loser_avg)

# 3. Top Players (Last 5 seasons: 2022, 2023, 2024, 2025, 2026)
print(f"\n--- Player Rankings (Last 5 Seasons: 2022-2026) ---")
target_seasons = ['2022', '2023', '2024', '2025', '2026']
df_players = df[df['season'].astype(str).isin(target_seasons)].copy()

# Batters
print("\nTop Batters:")
# Total runs, strike rate, innings, average
# Wides are not balls faced
df_players['is_ball_faced'] = df_players['extras_wides'].fillna(0) == 0

batter_stats = df_players.groupby('batter').agg(
    total_runs=('runs_batter', 'sum'),
    balls_faced=('is_ball_faced', 'sum'),
    innings=('match_id', 'nunique')
).reset_index()

# Calculate dismissals (where wicket_player_out == batter)
dismissals = df_players[df_players['wicket_player_out'].notna() & (df_players['wicket_player_out'] == df_players['batter'])].groupby('batter').size().reset_index(name='dismissals')

batter_stats = batter_stats.merge(dismissals, on='batter', how='left').fillna({'dismissals': 0})
batter_stats['strike_rate'] = (batter_stats['total_runs'] / batter_stats['balls_faced']) * 100
batter_stats['average'] = batter_stats['total_runs'] / np.where(batter_stats['dismissals'] == 0, 1, batter_stats['dismissals'])

# Filter batters with minimum runs, say 500 runs
top_batters = batter_stats[batter_stats['total_runs'] >= 500].sort_values(by='total_runs', ascending=False).head(10)
print(top_batters.to_string(index=False))

# Bowlers
print("\nTop Bowlers:")
# Wickets, economy, matches, dot balls
# Bowler wickets exclude run out, retired hurt, retired out, obstructing the field, and nan
bowler_wicket_kinds = ['caught', 'bowled', 'lbw', 'stumped', 'caught and bowled', 'hit wicket']
df_players['is_bowler_wicket'] = df_players['wicket_kind'].isin(bowler_wicket_kinds)

# Bowler runs conceded = runs_batter + extras_wides + extras_noballs
df_players['bowler_runs'] = df_players['runs_batter'] + df_players['extras_wides'].fillna(0) + df_players['extras_noballs'].fillna(0)

# Bowler balls = balls excluding wides and noballs
df_players['is_bowler_ball'] = (df_players['extras_wides'].fillna(0) == 0) & (df_players['extras_noballs'].fillna(0) == 0)

# Dot balls (runs_total == 0)
# Note: dot ball is usually a ball where runs_total == 0 and it was a bowler ball (no wide/noball)
df_players['is_dot_ball'] = (df_players['runs_total'] == 0) & df_players['is_bowler_ball']

bowler_stats = df_players.groupby('bowler').agg(
    wickets=('is_bowler_wicket', 'sum'),
    runs_conceded=('bowler_runs', 'sum'),
    balls_bowled=('is_bowler_ball', 'sum'),
    matches=('match_id', 'nunique'),
    dot_balls=('is_dot_ball', 'sum')
).reset_index()

bowler_stats['economy'] = (bowler_stats['runs_conceded'] / bowler_stats['balls_bowled']) * 6
# Filter bowler with at least 20 wickets
top_bowlers = bowler_stats[bowler_stats['wickets'] >= 20].sort_values(by='wickets', ascending=False).head(10)
print(top_bowlers.to_string(index=False))
