import pandas as pd
import numpy as np

# Load data
df = pd.read_csv("Data.csv", low_memory=False)

def get_phase(over):
    if over <= 5:
        return 'Powerplay'
    elif over <= 14:
        return 'Middle'
    else:
        return 'Death'

df['phase'] = df['over'].apply(get_phase)

# Filter matches with a winner
df_matches = df.drop_duplicates(subset=['match_id']).copy()
matches_with_winner = df_matches[df_matches['winner'].notna()]['match_id'].unique()
df_valid = df[df['match_id'].isin(matches_with_winner)].copy()

# Merge winner info
df_valid = df_valid.merge(df_matches[['match_id', 'winner']], on='match_id', suffixes=('', '_match'))
df_valid['is_winner'] = df_valid['batting_team'] == df_valid['winner']

# Wicket flags
df_valid['is_wicket'] = df_valid['wicket_player_out'].notna()

# Group by match_id, is_winner, phase
phase_stats = df_valid.groupby(['match_id', 'is_winner', 'phase']).agg(
    runs=('runs_total', 'sum'),
    balls=('ball', 'count'), # total balls including extras
    legal_balls=('extras_wides', lambda x: (x.fillna(0) == 0).sum() + (df_valid.loc[x.index, 'extras_noballs'].fillna(0) == 0).sum() - len(x)), # wait, let's just count rows where extras_wides == 0 and extras_noballs == 0 as legal balls
    wickets=('is_wicket', 'sum')
).reset_index()

# Better legal balls calculation:
# A ball is legal if extras_wides is 0 and extras_noballs is 0.
df_valid['is_legal_ball'] = (df_valid['extras_wides'].fillna(0) == 0) & (df_valid['extras_noballs'].fillna(0) == 0)

phase_stats = df_valid.groupby(['match_id', 'is_winner', 'phase']).agg(
    runs=('runs_total', 'sum'),
    balls_total=('ball', 'count'),
    balls_legal=('is_legal_ball', 'sum'),
    wickets=('is_wicket', 'sum')
).reset_index()

# Now aggregate across matches
# Let's see the average of runs, average wickets, and average run-rate per match phase.
# To compute run-rate per phase per match: (runs / balls_legal) * 6 (handle division by zero if balls_legal is 0)
phase_stats['run_rate'] = np.where(phase_stats['balls_legal'] > 0, (phase_stats['runs'] / phase_stats['balls_legal']) * 6, 0)

# We want to know the average run rate and wickets lost per phase for winners and losers
summary = phase_stats.groupby(['is_winner', 'phase']).agg(
    avg_runs=('runs', 'mean'),
    avg_wickets=('wickets', 'mean'),
    avg_run_rate=('run_rate', 'mean')
).reset_index()

print("Winner vs Loser Phase Statistics:")
print(summary.to_string(index=False))

# Let's also look at how often a team wins if they "win" a particular phase.
# Winning a phase means scoring more runs (or having a higher run rate) than the opponent in that phase,
# or losing fewer wickets.
# Let's compare winner vs loser in the same match.
pivot_runs = phase_stats.pivot_table(
    index='match_id',
    columns=['phase', 'is_winner'],
    values='runs',
    aggfunc='first'
).fillna(0)

print("\nWin correlation check:")
for phase in ['Powerplay', 'Middle', 'Death']:
    winner_runs = pivot_runs[phase][True]
    loser_runs = pivot_runs[phase][False]
    # How often did the team with more runs in this phase win the match?
    more_runs_won = (winner_runs > loser_runs).sum()
    ties = (winner_runs == loser_runs).sum()
    total = len(pivot_runs)
    pct = (more_runs_won / total) * 100
    print(f"Team with more runs in {phase} wins the match: {more_runs_won} / {total} ({pct:.2f}%) [Ties: {ties}]")

pivot_wickets = phase_stats.pivot_table(
    index='match_id',
    columns=['phase', 'is_winner'],
    values='wickets',
    aggfunc='first'
).fillna(0)

for phase in ['Powerplay', 'Middle', 'Death']:
    winner_w = pivot_wickets[phase][True]
    loser_w = pivot_wickets[phase][False]
    fewer_wickets_won = (winner_w < loser_w).sum()
    ties = (winner_w == loser_w).sum()
    total = len(pivot_wickets)
    pct = (fewer_wickets_won / total) * 100
    print(f"Team with fewer wickets lost in {phase} wins the match: {fewer_wickets_won} / {total} ({pct:.2f}%) [Ties: {ties}]")
