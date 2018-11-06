import pandas as pd

df = pd.read_csv('outcomes.csv')
df_proj = pd.read_csv('./projects.csv')

data = df.merge(df_proj, on='projectid')
data = data.drop(['great_chat', 'donation_from_thoughtful_donor',
				'teacher_ny_teaching_fellow', 'teacher_prefix', 'great_messages_proportion',
				'teacher_teach_for_america', 'secondary_focus_area', 'secondary_focus_subject',
				'school_year_round', 'school_charter', 'school_ncesid', 'schoolid', 'teacher_acctid'], axis=1)

data =  data[data['date_posted'] < '2014-01-01']

data.to_csv('cleanData.csv')
