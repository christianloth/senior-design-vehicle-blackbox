import csv
from turtle import speed
import obd
import time
from datetime import datetime
import logging
import threading
import obd_reader
import board
import adafruit_icm20x

OBD_readings = {'RPM':0, 'Speed':0, 'Throttle':0}
IMU_readings = {'AX':0, 'AY':0, 'AZ':0, 'GX':0, 'GY':0, 'GZ':0 }

class OBD_sensor:
    def __init__(self):
        print('OBD: Preparing')
        self.obd = obd.Async('/dev/rfcomm0', fast=False, check_voltage=False)
        self.obd.watch(obd.commands.RPM)
        self.obd.watch(obd.commands.SPEED)
        self.obd.watch(obd.commands.THROTTLE_POS)
        self.obd.start()
  
    def stop(self):
        print('OBD: Stoping')
        self.gather_data = False

    def exit(self):
        self.obd.stop()
        self.obd.unwatch_all()
        self.obd.close()
        print("OBD: Exiting")
        
    def run(self):
        print('OBD: Running')
        self.gather_data = True
        while self.gather_data:
            try:
                if self.obd.is_connected():
                    OBD_readings['RPM'] = self.obd.query(obd.commands.RPM).value.magnitude
                    OBD_readings['Speed'] = self.obd.query(obd.commands.SPEED).value.to("mph").magnitude
                    OBD_readings['Throttle'] = self.obd.query(obd.commands.THROTTLE_POS).value.magnitude
            except:
                print("Error in OBD")
                
        print("OBD: Ending Run")
        

class IMU_sensor():
    def __init__(self):
        print('IMU: Preparing')
        self.i2c = board.I2C()  # uses board.SCL and board.SDA
        self.icm = adafruit_icm20x.ICM20649(self.i2c)
  
    def stop(self):
        print('IMU: Stoping')
        self.gather_data = False
        
    def run(self):
        print('IMU: Running')
        self.gather_data = True
        while self.gather_data:
            try:
                Ax,Ay,Az = self.icm.acceleration
                Gx,Gy,Gz = self.icm.gyro
                IMU_readings['AX'] = Ax
                IMU_readings['AY'] = Ay
                IMU_readings['AZ'] = Az
                IMU_readings['GX'] = Gx
                IMU_readings['GY'] = Gy
                IMU_readings['GZ'] = Gz
            except:
                print("Error in IMU")
                
        print("IMU: Exiting")


if __name__ == "__main__":

    header = ['Time', 'RPM', 'MPH', 'THROTTLE_POS', 'AX','AY','AZ', 'GX', 'GY', 'GZ']
    filename = datetime.now().strftime("%Y_%m_%d-%I_%M_%S_%p") + '.csv'
 
    # obd2 = Thread(target=obd_reader.obd_sensor)
    # obd2.start()
    # time.sleep(3)
    # imu = threading.Thread(target=IMU_sensor())
    OBD = OBD_sensor()
    IMU = IMU_sensor()

    OBD_thread = threading.Thread(target=OBD.run)
    IMU_thread = threading.Thread(target=IMU.run)
    time.sleep(1)

    IMU_thread.start()
    OBD_thread.start()

    
    with open(filename, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(header)
        while True:
            try:
                data = [int(time.time()) , OBD_readings['RPM'], OBD_readings['Speed'], OBD_readings['Throttle'], IMU_readings['AX'], IMU_readings['AY'], IMU_readings['AZ'],IMU_readings['GX'], IMU_readings['GY'], IMU_readings['GZ']]
                writer.writerow(data)
                time.sleep(1)
            
            except KeyboardInterrupt:
                break

        OBD.stop()
        IMU.stop()
        
        time.sleep(1)

        OBD.exit()

        OBD_thread.join()
        IMU_thread.join()

        f.close()