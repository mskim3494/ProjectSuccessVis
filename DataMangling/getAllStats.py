import pandas as pd 


df = pd.read_csv('CleanData.csv')

df = df[['at_least_1_teacher_referred_donor','fully_funded','three_or_more_non_teacher_referred_donors',
'one_non_teacher_referred_donor_giving_100_plus','school_metro','primary_focus_subject',
'primary_focus_area','resource_type','poverty_level','total_price_excluding_optional_support']]

"""
data requirements
root is focus area
	in each focus_area need total count in each focus area, parent = root 
	in each focus area need number in each poverty level , parent = each focus area
	in each poverty level need num succuses and number of failures , parent = each ppoverty level
	in success and failure need number in metro number in urban , parent = failure or success
	in each metro and urban need number with one_non_taecher_referred_donor_giving_100_plus, parent = urban or metro

"""

focus = df[['fully_funded', 'primary_focus_area']]
focus['success'] = (focus['fully_funded'] == 't').astype(int)
del focus['fully_funded']
total_by_focus = focus.groupby('primary_focus_area').count()


def tf_to_int(data, acc):
	data[acc] = (data[acc] == 't').astype(int)
	return data

poverty = df[['fully_funded', 'primary_focus_area', 'poverty_level']]
poverty = tf_to_int(poverty, 'fully_funded')

by_poverty = poverty.groupby(['primary_focus_area', 'poverty_level'])

count_by_subj_poverty = by_poverty.count()
succ_by_subj_povert = by_poverty.sum()
failures_by_subj_poverty = count_by_subj_poverty['fully_funded'] - succ_by_subj_povert['fully_funded']


metro = df[['fully_funded', 'primary_focus_area', 'poverty_level', 'school_metro']]
by_subj_pov_succ_fail = metro.groupby(['primary_focus_area', 'poverty_level', 'fully_funded', 'school_metro'])
t_f_subj_pov_counts = by_subj_pov_succ_fail.size()




one_teacher = df[['fully_funded', 'primary_focus_area', 'poverty_level', 'school_metro', 'one_non_teacher_referred_donor_giving_100_plus']]

by_all = one_teacher.groupby(['primary_focus_area', 'poverty_level', 'fully_funded', 'school_metro', 'one_non_teacher_referred_donor_giving_100_plus'])

by_all_counts = by_all.size()
