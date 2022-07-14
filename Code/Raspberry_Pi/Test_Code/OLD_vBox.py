import csv
from msilib.schema import Error
from turtle import speed
import obd
import time
from datetime import datetime
import logging
from threading import Thread, Event
import obd_reader
from data_readings import *
# import board
# import adafruit_icm20x

# i2c = board.I2C()  # uses board.SCL and board.SDA
# icm = adafruit_icm20x.ICM20649(i2c)
#obd.logger.setLevel(obd.logging.DEBUG) # enables all debug information




if __name__ == "__main__":
    header = ['Time', 'RPM', 'MPH', 'THROTTLE_POS', 'AX','AY','AZ', 'GX', 'GY', 'GZ']

    filename = datetime.now().strftime("%Y_%m_%d-%I_%M_%S_%p") + '.csv'
 
    obd2 = Thread(target=obd_reader.obd_sensor)
    obd2.start()
    time.sleep(3)
    
    with open(filename, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(header)
        i = 0
        while i<10:
            try:
                data = [datetime.now().strftime("%I:%M:%S %p"), obd_readings['RPM'], obd_readings['Speed'], obd_readings['Throttle'] ]
                writer.writerow(data)
            
            #print("Acceleration: X:%.2f, Y: %.2f, Z: %.2f m/s^2" % (icm.acceleration))
            #print("Gyro X:%.2f, Y: %.2f, Z: %.2f rads/s" % (icm.gyro))
                time.sleep(0.5)
                i = i+1	
            except KeyboardInterrupt:
                break

        run_thread = False
        obd2.join()
        f.close()