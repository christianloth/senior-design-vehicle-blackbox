import obd
import logging
from data_readings import obd_readings

class obd_sensor:
    def __init__(self):
        self.obd = obd.Async("COM2", 57600)
        obd_rpm = obd.commands.RPM
        obd_speed = obd.commands.SPEED
        obd_throttle = obd.commands.THROTTLE_POS
        self.gatherdata = True
        self.obd.watch(obd_rpm)
        self.obd.watch(obd_speed)
        self.obd.watch(obd_throttle)
        self.obd.start()
  
    def stop_data(self):
        self.gatherdata = False

    def exit(self):
        self.obd.stop()
        self.obd.unwatch_all()
        self.obd.close()
        
    def run(self):
        logging.info("Thread obd: starting")
        while self._gatherdata:
            try:
                if self.obd.is_connected():
                    res_obd_rpm = self.obd.query(self.obd_rpm)
                    res_obd_speed = self.obd.query(self.obd_speed)
                    res_obd_throttle = self.obd.query(self.obd_throttle)
                    print(res_obd_rpm)
                    obd_readings['RPM'] = res_obd_rpm
                    obd_readings['Speed'] = res_obd_speed
                    obd_readings['Throttle'] = res_obd_throttle
            except:
                print("Error in OBD")
                
        print("OBD exiting")
        logging.info("Thread obd: finishing")
        
    