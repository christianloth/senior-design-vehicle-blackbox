import sys
import pandas as pd
import numpy as np
import os
import matplotlib.pyplot as plt
import boto3
import time
import math
import decimal
import json
from decimal import Decimal
from boto3.dynamodb.conditions import Key, Attr
from utilities import *
from datetime import datetime

def latest_change(filename):

    reference_time = datetime.now().timestamp() - 60*60*24
    f_name = "Raspberry_Pi/Release_Code/CSVs/" + filename
    # print(os.path.getctime(f_name))
    mtime = os.path.getmtime(f_name)
    ctime = os.path.getctime(f_name)

    if (mtime >= reference_time) | (ctime >= reference_time):
        return f_name

def get_latest_files(dir):
    list_of_files = os.listdir(dir)
    latest_files = []
    for f in list_of_files:
        latest_files.append(latest_change(f))
    latest_files = [i for i in latest_files if i]
    
    return latest_files

latest_files_csv = get_latest_files('Raspberry_Pi/Release_Code/CSVs/')

# accessing Amazon Dynamodb
dynamodb = boto3.resource('dynamodb')

# accessing Amazon S3 bucket
bucket = boto3.resource('s3')

# getting access to DataSummary table
vehicle_data_table = dynamodb.Table('vehicle_data')

# getting access to vboxbucket
vboxbucket = bucket.Bucket('vboxbucket')

print(vehicle_data_table.creation_date_time) # test if connected to the database
print(vboxbucket.name) # test if connected to the s3 bucket

list_of_files_csv = os.listdir('Raspberry_Pi/Release_Code/CSVs/')
uploaded_file_count = len(list_of_files_csv) - len(latest_files_csv)
print(uploaded_file_count)

for fname in latest_files_csv:
    raw_data = pd.read_csv(fname)
    raw_data['trip'] = uploaded_file_count
    
    uploaded_file_count += 1
    
    raw_data = raw_data.dropna()
    raw_data = raw_data[raw_data['Longitude'] != 0]
    for i in range(raw_data.trip.size):
        if i > 0:
            delta_acc_x =  Decimal(str(raw_data.AX[i].item() - raw_data.AX[i-1].item()))
            delta_acc_y = Decimal(str(raw_data.AY[i].item() - raw_data.AY[i-1].item()))
            delta_acc_z = Decimal(str(raw_data.AZ[i].item() - raw_data.AZ[i-1].item()))
        else: 
            delta_acc_x =  0
            delta_acc_y = 0
            delta_acc_z = 0

        vehicle_data_table.put_item(
            ##### Change the table name here if necessary #####
            TableName = "vehicle_data",
            Item = {
                "trip": Decimal(str(raw_data.trip[i].item())),
                "tm": Decimal(str(raw_data.Time[i].item())),
                'rpm': Decimal(str(raw_data.RPM[i].item())),
                'speed': Decimal(str(raw_data.MPH[i].item())),
                'throttle_pos': Decimal(str(raw_data.THROTTLE_POS[i].item())),
                'acc_x': Decimal(str(raw_data.AX[i].item())),
                'acc_y': Decimal(str(raw_data.AY[i].item())),
                'acc_z': Decimal(str(raw_data.AZ[i].item())),
                'gyro_x': Decimal(str(raw_data.GX[i].item())),
                'gyro_y': Decimal(str(raw_data.GY[i].item())),
                'gyro_z': Decimal(str(raw_data.GZ[i].item())),
                'delta_acc_x': delta_acc_x,
                'delta_acc_y': delta_acc_y, 
                'delta_acc_z': delta_acc_z, 
                'long': Decimal(str(raw_data.Longitude[i].item())), 
                'lat': Decimal(str(raw_data.Latitude[i].item())),
            }
        )

