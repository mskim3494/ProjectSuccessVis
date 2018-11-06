import pandas as pd


df = pd.read_csv('cleanData.csv')



"""
Get the succ/failure coutn by subject
"""
focus = df[['fully_funded', 'primary_focus_area']]
focus['success'] = (focus['fully_funded'] == 't').astype(int)
del focus['fully_funded']
by_focus = focus.groupby('primary_focus_area')
total_counts = by_focus.count()
succ_by_focus = by_focus.sum()
focus_stats = succ_by_focus.join(total_counts, how='outer', lsuffix=' Total')
focus_stats.columns = ['success', 'total']
focus_stats['failures'] = focus_stats['total'] - focus_stats['success']
focus_stats.to_csv('sankeyStats2.csv')


poverty_df = states[['success', 'poverty_level']]

successes = poverty_df.loc[states['success'] == 1]
by_poverty_success = successes.groupby('poverty_level').sum()

fails  = poverty_df.loc[states['success'] == 0]
fail_poverty = fails.groupby('poverty_level').count()
fail_poverty.columns=['failures']

poverty_success = fail_poverty.join(by_poverty_success, how='outer',)

poverty_success.to_csv("success_by_poverty.csv")


"""
Get the succ/failure coutn by state
"""
states = df[['fully_funded', 'school_state', 'poverty_level', 'primary_focus_area']] 
states['State']= states.school_state.str.upper()
states['success'] =  (states['fully_funded'] == 't').astype(int)
del states['fully_funded']
del states['school_state']
by_state = states.groupby('State')
total_counts = by_state.count()
succ_by_state = by_state.sum()
stats = succ_by_state.join(total_counts, how='outer', lsuffix='Total ')

stats.columns = ['success', 'total']
stats['failures'] = stats['total']- stats['success']

stats.to_csv('sankeyStats.csv')
