from concurrent.futures.process import _chain_from_iterable_of_lists
import csv
from turtle import speed
import obd
import time
from datetime import datetime
import threading
import os,signal
import board
import adafruit_gps
import serial
import adafruit_icm20x
from picamera import PiCamera
from obd import OBDStatus
from subprocess import call 

OBD_readings = {'RPM':0, 'Speed':0, 'Throttle':0}
IMU_readings = {'AX':0, 'AY':0, 'AZ':0, 'GX':0, 'GY':0, 'GZ':0 }
GPS_readings = {'Latitude':0, 'Longitude':0 }
exit_event = threading.Event()
exit_gracefully_event = threading.Event()

class pi_Camera:
    def __init__(self, f_name):
        print('Camera: Preparing')
        self.camera = PiCamera()
        self.file_n = f_name
  
    def stop(self):
        print('Camera: Stoping')
        self.camera.stop_recording()
        
    def run(self):
        print('Camera: Running')
        self.camera.start_recording('/home/pi/Documents/' + self.file_n + '.h264')
                

class GPS_sensor:
    def __init__(self):
        print('GPS: Preparing')
        self.uart = serial.Serial("/dev/ttyS0", baudrate=9600, timeout=10)
        self.gps = adafruit_gps.GPS(self.uart, debug=False)  # Use UART/pyserial
        self.gps.send_command(b"PMTK314,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0")
        self.gps.send_command(b'PMTK220,500')
  
    def stop(self):
        print('GPS: Stoping')
        self.gather_data = False
        
    def run(self):
        print('GPS: Running')
        self.gather_data = True
        last_print = time.monotonic()
        while self.gather_data:
            try:
                self.gps.update()
                current = time.monotonic()
                if current - last_print >= 1.0:
                    last_print = current
                    if self.gps.has_fix:
                        GPS_readings['Latitude'] = self.gps.latitude
                        GPS_readings['Longitude'] = self.gps.longitude
                    else:
                        print("GPS setting exit event")
                        exit_event.set()
               
            except Exception as err:
                print("Error GPS:", err)
                x = int(time.time())
                print(x)
                
        print("GPS: Ending Run")
        

class OBD_sensor:
    def __init__(self):
        print('OBD: Preparing')
        self.obd = obd.OBD('/dev/rfcomm0', fast=False, baudrate=10400)
        self.counter = 0
  
    def stop(self):
        print('OBD: Stoping')
        self.gather_data = False

    def exit(self):
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
                    if self.counter != 0:
                        self.counter = 0

                else:
                    print("OBD setting exit event")
                    exit_event.set()

            except Exception as err:
                print("Error OBD:", err)
                x = int(time.time())
                print(x)
                self.counter = self.counter + 1
                if(self.counter >= 20):
                    exit_gracefully_event.set()

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

    delete = False

    header = ['Time', 'RPM', 'MPH', 'THROTTLE_POS', 'AX','AY','AZ', 'GX', 'GY', 'GZ', 'Latitude', 'Longitude']
    name = datetime.now().strftime("%Y_%m_%d-%I_%M_%S_%p")
    filename = name + '.csv'
    
    # OBD = OBD_sensor()
    IMU = IMU_sensor()
    GPS = GPS_sensor()
    Camera = pi_Camera(name)

    retry = True
    while(retry):
        OBD = OBD_sensor()
        OBD_thread = threading.Thread(target=OBD.run)
        IMU_thread = threading.Thread(target=IMU.run)
        GPS_thread = threading.Thread(target=GPS.run)
        Camera_thread = threading.Thread(target=Camera.run)
        time.sleep(3)

        IMU_thread.start()
        GPS_thread.start()
        Camera_thread.start()
        OBD_thread.start()

        
        with open(filename, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(header)
            while True:
                try:
                    if exit_event.is_set():
                        exit_event.clear()
                        delete = True
                        break

                    if exit_gracefully_event.is_set():
                        delete = False
                        retry = False
                        break

                    data = [int(time.time()) , OBD_readings['RPM'], OBD_readings['Speed'], OBD_readings['Throttle'], IMU_readings['AX'], IMU_readings['AY'], IMU_readings['AZ'],IMU_readings['GX'], IMU_readings['GY'], IMU_readings['GZ'], GPS_readings['Latitude'], GPS_readings['Longitude']]
                    writer.writerow(data)
                    time.sleep(1)
                
                except KeyboardInterrupt:
                    retry = False
                    break

        time.sleep(1)
        OBD.stop()
        IMU.stop()
        GPS.stop()
        Camera.stop()
        
        time.sleep(1)


        GPS_thread.join()
        OBD_thread.join()
        IMU_thread.join()
        Camera_thread.join()

    OBD.exit()

    if os.path.isfile(filename) & os.path.isfile(name + '.h264') & delete == True:
        os.remove(filename)
        os.remove(name + '.h264')
        exit()

    command = "MP4Box -add " + name + '.h264' + " " + name + '.mp4'
    call([command], shell=True)
    print("Video converted to mp4")
    
    if os.path.isfile(name + '.mp4'):
        os.remove(name + '.h264')

    exit(0)
    

    