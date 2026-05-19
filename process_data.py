import pandas as pd
import numpy as np
import json

# 1. Load data
df = pd.read_csv("Data.csv", low_memory=False)

def clean_season(s):
    s = str(s).strip()
    if s == '2007/08':
        return '2008'
    elif s == '2009/10':
        return '2010'
    elif s == '2020/21':
        return '2020'
    return s

df['season'] = df['season'].apply(clean_season)

# 2. Standardization mappings
team_map = {
    'Delhi Daredevils': 'Delhi Capitals',
    'Kings XI Punjab': 'Punjab Kings',
    'Royal Challengers Bangalore': 'Royal Challengers Bengaluru',
    'Rising Pune Supergiants': 'Rising Pune Supergiant',
}

venue_map = {
    'Eden Gardens': 'Eden Gardens, Kolkata',
    'Eden Gardens, Kolkata': 'Eden Gardens, Kolkata',
    'Wankhede Stadium': 'Wankhede Stadium, Mumbai',
    'Wankhede Stadium, Mumbai': 'Wankhede Stadium, Mumbai',
    'M Chinnaswamy Stadium': 'M Chinnaswamy Stadium, Bengaluru',
    'M Chinnaswamy Stadium, Bengaluru': 'M Chinnaswamy Stadium, Bengaluru',
    'M.Chinnaswamy Stadium': 'M Chinnaswamy Stadium, Bengaluru',
    'Feroz Shah Kotla': 'Arun Jaitley Stadium, Delhi',
    'Arun Jaitley Stadium': 'Arun Jaitley Stadium, Delhi',
    'Arun Jaitley Stadium, Delhi': 'Arun Jaitley Stadium, Delhi',
    'Rajiv Gandhi International Stadium, Uppal': 'Rajiv Gandhi International Stadium, Hyderabad',
    'Rajiv Gandhi International Stadium, Uppal, Hyderabad': 'Rajiv Gandhi International Stadium, Hyderabad',
    'Rajiv Gandhi International Stadium': 'Rajiv Gandhi International Stadium, Hyderabad',
    'MA Chidambaram Stadium, Chepauk': 'MA Chidambaram Stadium, Chennai',
    'MA Chidambaram Stadium, Chepauk, Chennai': 'MA Chidambaram Stadium, Chennai',
    'MA Chidambaram Stadium': 'MA Chidambaram Stadium, Chennai',
    'Sawai Mansingh Stadium': 'Sawai Mansingh Stadium, Jaipur',
    'Sawai Mansingh Stadium, Jaipur': 'Sawai Mansingh Stadium, Jaipur',
    'Narendra Modi Stadium, Ahmedabad': 'Narendra Modi Stadium, Ahmedabad',
    'Sardar Patel Stadium, Motera': 'Narendra Modi Stadium, Ahmedabad',
    'Punjab Cricket Association Stadium, Mohali': 'Punjab Cricket Association Stadium, Mohali',
    'Punjab Cricket Association IS Bindra Stadium, Mohali': 'Punjab Cricket Association Stadium, Mohali',
    'Punjab Cricket Association IS Bindra Stadium': 'Punjab Cricket Association Stadium, Mohali',
    'Punjab Cricket Association IS Bindra Stadium, Mohali, Chandigarh': 'Punjab Cricket Association Stadium, Mohali',
    'Sheikh Zayed Stadium': 'Sheikh Zayed Stadium, Abu Dhabi',
    'Zayed Cricket Stadium, Abu Dhabi': 'Sheikh Zayed Stadium, Abu Dhabi',
    'Sharjah Cricket Stadium': 'Sharjah Cricket Stadium, Sharjah',
    'Dubai International Cricket Stadium': 'Dubai International Cricket Stadium, Dubai',
    'Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow': 'Ekana Cricket Stadium, Lucknow',
    'Maharashtra Cricket Association Stadium': 'Maharashtra Cricket Association Stadium, Pune',
    'Maharashtra Cricket Association Stadium, Pune': 'Maharashtra Cricket Association Stadium, Pune',
    'Subrata Roy Sahara Stadium': 'Maharashtra Cricket Association Stadium, Pune',
    'Dr DY Patil Sports Academy': 'Dr DY Patil Sports Academy, Mumbai',
    'Dr DY Patil Sports Academy, Mumbai': 'Dr DY Patil Sports Academy, Mumbai',
    'Brabourne Stadium': 'Brabourne Stadium, Mumbai',
    'Brabourne Stadium, Mumbai': 'Brabourne Stadium, Mumbai',
    'Maharaja Yadavindra Singh International Cricket Stadium, Mullanpur': 'Maharaja Yadavindra Singh Stadium, Mullanpur',
    'Maharaja Yadavindra Singh International Cricket Stadium, New Chandigarh': 'Maharaja Yadavindra Singh Stadium, Mullanpur',
    'Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium': 'ACA-VDCA Stadium, Visakhapatnam',
    'Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium, Visakhapatnam': 'ACA-VDCA Stadium, Visakhapatnam',
    'Himachal Pradesh Cricket Association Stadium': 'HPCA Stadium, Dharamsala',
    'Himachal Pradesh Cricket Association Stadium, Dharamsala': 'HPCA Stadium, Dharamsala',
}

def clean_team(team):
    if pd.isna(team):
        return team
    return team_map.get(team, team)

def clean_venue(venue):
    if pd.isna(venue):
        return venue
    return venue_map.get(venue, venue)

# Clean variables in main dataframe
df['team1'] = df['team1'].apply(clean_team)
df['team2'] = df['team2'].apply(clean_team)
df['toss_winner'] = df['toss_winner'].apply(clean_team)
df['winner'] = df['winner'].apply(clean_team)
df['batting_team'] = df['batting_team'].apply(clean_team)
df['venue'] = df['venue'].apply(clean_venue)

# Extract unique matches
df_matches = df.drop_duplicates(subset=['match_id']).copy()
df_matches = df_matches[df_matches['winner'].notna()] # Only matches with a winner

# Calculate Chasing / batting 2nd team
df_matches['chasing_team'] = np.where(
    df_matches['toss_decision'] == 'field',
    df_matches['toss_winner'],
    np.where(df_matches['team1'] == df_matches['toss_winner'], df_matches['team2'], df_matches['team1'])
)
df_matches['chase_won'] = df_matches['winner'] == df_matches['chasing_team']
df_matches['toss_winner_won'] = df_matches['toss_winner'] == df_matches['winner']

# 1. Toss Analysis Output
total_matches = len(df_matches)
toss_won_match_won = int(df_matches['toss_winner_won'].sum())
toss_won_match_lost = total_matches - toss_won_match_won

toss_decision_stats = df_matches.groupby('toss_decision').agg(
    total=('match_id', 'count'),
    won=('toss_winner_won', 'sum')
).reset_index()

toss_decisions_dict = {}
for idx, row in toss_decision_stats.iterrows():
    toss_decisions_dict[row['toss_decision']] = {
        'total': int(row['total']),
        'won': int(row['won']),
        'win_pct': float(round((row['won'] / row['total']) * 100, 2))
    }

chasing_won_count = int(df_matches['chase_won'].sum())
batting_first_won_count = total_matches - chasing_won_count

# Season trends
season_trends_raw = df_matches.groupby('season').agg(
    matches=('match_id', 'count'),
    chase_wins=('chase_won', 'sum'),
    field_toss_choices=('toss_decision', lambda x: (x == 'field').sum())
).reset_index()

season_trends = []
for idx, row in season_trends_raw.iterrows():
    season_trends.append({
        'season': str(row['season']),
        'matches': int(row['matches']),
        'chase_win_pct': float(round((row['chase_wins'] / row['matches']) * 100, 2)),
        'field_choice_pct': float(round((row['field_toss_choices'] / row['matches']) * 100, 2))
    })

# Venue trends (min 15 matches)
venue_stats = df_matches.groupby('venue').agg(
    matches=('match_id', 'count'),
    toss_wins=('toss_winner_won', 'sum'),
    chase_wins=('chase_won', 'sum')
).reset_index()
venue_stats['toss_win_pct'] = (venue_stats['toss_wins'] / venue_stats['matches']) * 100
venue_stats['chase_win_pct'] = (venue_stats['chase_wins'] / venue_stats['matches']) * 100

venue_stats_filtered = venue_stats[venue_stats['matches'] >= 15].sort_values(by='toss_win_pct', ascending=False)
venue_trends = []
for idx, row in venue_stats_filtered.iterrows():
    venue_trends.append({
        'venue': str(row['venue']),
        'matches': int(row['matches']),
        'toss_win_pct': float(round(row['toss_win_pct'], 2)),
        'chase_win_pct': float(round(row['chase_win_pct'], 2))
    })

toss_stats = {
    'overall': {
        'total_matches': total_matches,
        'toss_winner_won': toss_won_match_won,
        'toss_winner_won_pct': float(round((toss_won_match_won / total_matches) * 100, 2)),
        'toss_winner_lost': toss_won_match_lost,
        'toss_winner_lost_pct': float(round((toss_won_match_lost / total_matches) * 100, 2)),
        'chasing_won': chasing_won_count,
        'chasing_won_pct': float(round((chasing_won_count / total_matches) * 100, 2)),
        'batting_first_won': batting_first_won_count,
        'batting_first_won_pct': float(round((batting_first_won_count / total_matches) * 100, 2))
    },
    'decisions': toss_decisions_dict,
    'season_trends': season_trends,
    'venue_trends': venue_trends
}

# 2. Phase Impact Analysis
def get_phase(over):
    if over <= 5:
        return 'Powerplay'
    elif over <= 14:
        return 'Middle'
    else:
        return 'Death'

df['phase'] = df['over'].apply(get_phase)
df_valid = df[df['match_id'].isin(df_matches['match_id'])].copy()
df_valid = df_valid.merge(df_matches[['match_id', 'winner']], on='match_id', suffixes=('', '_match'))
df_valid['is_winner'] = df_valid['batting_team'] == df_valid['winner']
df_valid['is_wicket'] = df_valid['wicket_player_out'].notna()
df_valid['is_legal_ball'] = (df_valid['extras_wides'].fillna(0) == 0) & (df_valid['extras_noballs'].fillna(0) == 0)

phase_stats_raw = df_valid.groupby(['match_id', 'is_winner', 'phase']).agg(
    runs=('runs_total', 'sum'),
    balls_legal=('is_legal_ball', 'sum'),
    wickets=('is_wicket', 'sum')
).reset_index()
phase_stats_raw['run_rate'] = np.where(phase_stats_raw['balls_legal'] > 0, (phase_stats_raw['runs'] / phase_stats_raw['balls_legal']) * 6, 0)

# Pivot runs and wickets per match to check win correlations
pivot_runs = phase_stats_raw.pivot_table(
    index='match_id',
    columns=['phase', 'is_winner'],
    values='runs',
    aggfunc='first'
).fillna(0)

pivot_wickets = phase_stats_raw.pivot_table(
    index='match_id',
    columns=['phase', 'is_winner'],
    values='wickets',
    aggfunc='first'
).fillna(0)

pivot_rr = phase_stats_raw.pivot_table(
    index='match_id',
    columns=['phase', 'is_winner'],
    values='run_rate',
    aggfunc='first'
).fillna(0)

phase_details = {}
for phase in ['Powerplay', 'Middle', 'Death']:
    winner_sub = phase_stats_raw[(phase_stats_raw['phase'] == phase) & (phase_stats_raw['is_winner'] == True)]
    loser_sub = phase_stats_raw[(phase_stats_raw['phase'] == phase) & (phase_stats_raw['is_winner'] == False)]
    
    avg_runs_w = float(round(winner_sub['runs'].mean(), 2))
    avg_wickets_w = float(round(winner_sub['wickets'].mean(), 2))
    avg_rr_w = float(round(winner_sub['run_rate'].mean(), 2))
    
    avg_runs_l = float(round(loser_sub['runs'].mean(), 2))
    avg_wickets_l = float(round(loser_sub['wickets'].mean(), 2))
    avg_rr_l = float(round(loser_sub['run_rate'].mean(), 2))
    
    # Win correlation
    # runs correlation (runs scored)
    more_runs_won = int((pivot_runs[phase][True] > pivot_runs[phase][False]).sum())
    runs_total_matches = len(pivot_runs)
    runs_corr_pct = float(round((more_runs_won / runs_total_matches) * 100, 2))
    
    # wickets correlation (fewer wickets lost)
    fewer_wickets_won = int((pivot_wickets[phase][True] < pivot_wickets[phase][False]).sum())
    wickets_corr_pct = float(round((fewer_wickets_won / runs_total_matches) * 100, 2))
    
    # run rate correlation
    higher_rr_won = int((pivot_rr[phase][True] > pivot_rr[phase][False]).sum())
    rr_corr_pct = float(round((higher_rr_won / runs_total_matches) * 100, 2))
    
    phase_details[phase] = {
        'winner': {
            'avg_runs': avg_runs_w,
            'avg_wickets': avg_wickets_w,
            'avg_run_rate': avg_rr_w
        },
        'loser': {
            'avg_runs': avg_runs_l,
            'avg_wickets': avg_wickets_l,
            'avg_run_rate': avg_rr_l
        },
        'gap': {
            'runs': float(round(avg_runs_w - avg_runs_l, 2)),
            'wickets': float(round(avg_wickets_w - avg_wickets_l, 2)),
            'run_rate': float(round(avg_rr_w - avg_rr_l, 2))
        },
        'correlations': {
            'more_runs_win_pct': runs_corr_pct,
            'fewer_wickets_win_pct': wickets_corr_pct,
            'higher_rr_win_pct': rr_corr_pct
        }
    }

# 3. Player Stats (Last 5 seasons: 2022-2026)
target_seasons = ['2022', '2023', '2024', '2025', '2026']
df_players = df[df['season'].astype(str).isin(target_seasons)].copy()

# Add batsman match-by-match runs for 50s and 100s
batter_match_runs = df_players.groupby(['match_id', 'batter'])['runs_batter'].sum().reset_index(name='match_runs')
batter_match_runs['is_50'] = (batter_match_runs['match_runs'] >= 50) & (batter_match_runs['match_runs'] < 100)
batter_match_runs['is_100'] = batter_match_runs['match_runs'] >= 100

batter_milestones = batter_match_runs.groupby('batter').agg(
    fifties=('is_50', 'sum'),
    hundreds=('is_100', 'sum')
).reset_index()

df_players['is_ball_faced'] = df_players['extras_wides'].fillna(0) == 0
batter_stats = df_players.groupby('batter').agg(
    total_runs=('runs_batter', 'sum'),
    balls_faced=('is_ball_faced', 'sum'),
    innings=('match_id', 'nunique')
).reset_index()

dismissals = df_players[df_players['wicket_player_out'].notna() & (df_players['wicket_player_out'] == df_players['batter'])].groupby('batter').size().reset_index(name='dismissals')

batter_stats = batter_stats.merge(dismissals, on='batter', how='left').fillna({'dismissals': 0})
batter_stats = batter_stats.merge(batter_milestones, on='batter', how='left').fillna({'fifties': 0, 'hundreds': 0})

batter_stats['strike_rate'] = (batter_stats['total_runs'] / batter_stats['balls_faced']) * 100
batter_stats['average'] = batter_stats['total_runs'] / np.where(batter_stats['dismissals'] == 0, 1, batter_stats['dismissals'])

top_batters_df = batter_stats[batter_stats['total_runs'] >= 500].sort_values(by='total_runs', ascending=False).head(10)
top_batters = []
for idx, row in top_batters_df.iterrows():
    top_batters.append({
        'name': str(row['batter']),
        'runs': int(row['total_runs']),
        'balls_faced': int(row['balls_faced']),
        'innings': int(row['innings']),
        'dismissals': int(row['dismissals']),
        'strike_rate': float(round(row['strike_rate'], 2)),
        'average': float(round(row['average'], 2)) if row['dismissals'] > 0 else "N/A",
        'fifties': int(row['fifties']),
        'hundreds': int(row['hundreds'])
    })

# Bowlers
# Conceded runs: runs_batter + extras_wides + extras_noballs
df_players['bowler_runs'] = df_players['runs_batter'] + df_players['extras_wides'].fillna(0) + df_players['extras_noballs'].fillna(0)
df_players['is_bowler_ball'] = (df_players['extras_wides'].fillna(0) == 0) & (df_players['extras_noballs'].fillna(0) == 0)
df_players['is_dot_ball'] = (df_players['runs_total'] == 0) & df_players['is_bowler_ball']
bowler_wicket_kinds = ['caught', 'bowled', 'lbw', 'stumped', 'caught and bowled', 'hit wicket']
df_players['is_bowler_wicket'] = df_players['wicket_kind'].isin(bowler_wicket_kinds)

# Calculate bowler match-by-match stats for best figures and 5-wicket hauls
bowler_match = df_players.groupby(['match_id', 'bowler']).agg(
    wickets=('is_bowler_wicket', 'sum'),
    runs=('bowler_runs', 'sum')
).reset_index()
bowler_match['is_5w'] = bowler_match['wickets'] >= 5

# Get best figure for each bowler
# Sort by wickets desc, then runs asc
bowler_match_sorted = bowler_match.sort_values(by=['wickets', 'runs'], ascending=[False, True])
best_figures = bowler_match_sorted.drop_duplicates(subset=['bowler']).copy()
best_figures['best_fig'] = best_figures['wickets'].astype(str) + "/" + best_figures['runs'].astype(str)

bowler_milestones = bowler_match.groupby('bowler').agg(
    five_w=('is_5w', 'sum')
).reset_index()

bowler_stats = df_players.groupby('bowler').agg(
    wickets=('is_bowler_wicket', 'sum'),
    runs_conceded=('bowler_runs', 'sum'),
    balls_bowled=('is_bowler_ball', 'sum'),
    matches=('match_id', 'nunique'),
    dot_balls=('is_dot_ball', 'sum')
).reset_index()

bowler_stats = bowler_stats.merge(best_figures[['bowler', 'best_fig']], on='bowler', how='left')
bowler_stats = bowler_stats.merge(bowler_milestones, on='bowler', how='left').fillna({'five_w': 0})

bowler_stats['economy'] = (bowler_stats['runs_conceded'] / bowler_stats['balls_bowled']) * 6
bowler_stats['strike_rate'] = bowler_stats['balls_bowled'] / np.where(bowler_stats['wickets'] == 0, 1, bowler_stats['wickets'])
bowler_stats['average'] = bowler_stats['runs_conceded'] / np.where(bowler_stats['wickets'] == 0, 1, bowler_stats['wickets'])

top_bowlers_df = bowler_stats[bowler_stats['wickets'] >= 20].sort_values(by='wickets', ascending=False).head(10)
top_bowlers = []
for idx, row in top_bowlers_df.iterrows():
    top_bowlers.append({
        'name': str(row['bowler']),
        'wickets': int(row['wickets']),
        'runs_conceded': int(row['runs_conceded']),
        'balls_bowled': int(row['balls_bowled']),
        'matches': int(row['matches']),
        'dot_balls': int(row['dot_balls']),
        'economy': float(round(row['economy'], 2)),
        'strike_rate': float(round(row['strike_rate'], 2)),
        'average': float(round(row['average'], 2)),
        'best_figures': str(row['best_fig']),
        'five_w': int(row['five_w'])
    })

# 4. Powerplay Wicket Trap details (extra insight stats)
pp_wickets = df_valid[df_valid['over'] <= 5].groupby(['match_id', 'batting_team'])['is_wicket'].sum().reset_index(name='pp_wickets')
pp_w_winner = pp_wickets.merge(df_matches[['match_id', 'winner']], on='match_id')
pp_w_winner['is_winner'] = pp_w_winner['batting_team'] == pp_w_winner['winner']

pp_trap = []
for w in sorted(pp_w_winner['pp_wickets'].unique()):
    sub = pp_w_winner[pp_w_winner['pp_wickets'] == w]
    pp_trap.append({
        'wickets': int(w),
        'innings': int(len(sub)),
        'wins': int(sub['is_winner'].sum()),
        'win_pct': float(round((sub['is_winner'].sum() / len(sub)) * 100, 2))
    })

# Gather everything
output_data = {
    'tossStats': toss_stats,
    'phaseStats': phase_details,
    'topBatters': top_batters,
    'topBowlers': top_bowlers,
    'ppTrap': pp_trap
}

import os

output_path = os.path.join('src', 'data', 'processed.json')
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, 'w') as f:
    json.dump(output_data, f, indent=2)

print(f"\nSuccessfully processed data and generated {output_path}!")
