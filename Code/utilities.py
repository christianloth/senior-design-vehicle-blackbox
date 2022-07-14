import sys
import pandas as pd
import numpy as np
import os
import matplotlib.pyplot as plt
import boto3
import time
import datetime
import math
import decimal
import json
from boto3.dynamodb.conditions import Key, Attr
import csv

# This function converts log files into csv files
# filename: a string indicating the address of the log file
def log_to_csv(filename):
    name, type = filename.split(".") 
    with open(filename) as file:
        lines = file.read().splitlines()
        lines = [lines[x:x+3] for x in range(0, len(lines), 3)]
        with open('.csv'.format(name), 'w+') as csvfile:
            w = csv.writer(csvfile)
            w.writerows(lines)