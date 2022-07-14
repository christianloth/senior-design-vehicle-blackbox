#!/usr/bin/env python
# coding: utf-8

# In[2]:


import csv
import pandas as pd
import numpy as np
file = pd.read_csv("test1_true.csv")
file.head()


# In[3]:


trip_time, col_count = file.shape
diff_list = []
wreck_points = 0
sharp_steer = 0
for x, y in zip(file['MPH'][0::], file['MPH'][1::]):
    if (abs(y-x) > 2):
        wreck_points += 1
    diff_list.append(y-x)

# printing difference list
count_length = trip_time - 1
percent_wreck = (wreck_points/count_length)*100
#print ("difference list: ", str(diff_list))
print("Amount of total trip that identified major difference in speeds per timestamp:",percent_wreck)



# In[4]:


## average speed per cluster of 5
sum_list = []
for i in range(0,count_length, 5):
   sum_list.append(sum(file['MPH'][i:i+5])/5)
print(sum_list[0:10])

## maximum speed observed 
print("Maximum Speed Observed:",max(file['MPH']))
    


# In[47]:


## identify sudden brakes 
#according to research, deceleration of < 15 fps is considered safe
jerk_break_count = 0
for x, y in zip(file['MPH'][0::], file['MPH'][1::]):
    x = x * 1.467
    y = y * 1.467 
    if ((y-x) < 0 and abs(y-x) > 7): #use 7 bc there was 0 occurence of >15
        jerk_break_count +=1
print("Percent of sudden brake instances indentified:",(jerk_break_count/count_length)*100)


# In[53]:


import matplotlib.pyplot as plt
import random

data = file['MPH']  #create a list of 10 random numbers

plt.plot(data, color='magenta', marker='o',mfc='pink' ) #plot the data
plt.xticks(range(0,count_length, 1)) #set the tick frequency on x-axis

plt.ylabel('MPH') #set the label for y axis
plt.xlabel('time(s)') #set the label for x-axis
plt.title("Overall Trip Image") #set the title of the graph
plt.show() #display the graph


# In[11]:


## is the driver displaying stable speeding?
unstable_count = 0
for x, y in zip(file['MPH'][0::], file['MPH'][1::]):
    if (abs(y-x)>1.5):
        unstable_count +=1
print("Percent of trip with inconsistent speeding: ",round((unstable_count/count_length)*100,2))


# In[5]:


## Number of stops made during trips
stop_count = 0
for x, y in zip(file['MPH'][0::], file['MPH'][1::]):
    if (y == 0 and abs(y-x) > 0.6):
        stop_count +=1
print("Number of stops made during this trip: ", round(stop_count,2))


# In[70]:


## add traffic condition and speed_limit from GMAPsAPI


# In[ ]:


##final report here
## how do we wanna do this?

