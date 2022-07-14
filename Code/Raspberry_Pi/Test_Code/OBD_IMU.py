import csv
from turtle import speed
import obd
import time
from datetime import datetime
import board
import adafruit_icm20x

i2c = board.I2C()  # uses board.SCL and board.SDA
icm = adafruit_icm20x.ICM20649(i2c)
#obd.logger.setLevel(obd.logging.DEBUG) # enables all debug information


if __name__ == "__main__":
	connection = obd.OBD("COM2", 57600)
	header = ['Time', 'RPM', 'MPH', 'THROTTLE_POS', 'AX','AY','AZ', 'GX', 'GY', 'GZ']

	filename = datetime.now().strftime("%Y_%m_%d-%I_%M_%S_%p") + '.csv'

	with open(filename, 'w', newline='') as f:
		obd_rpm = obd.commands.RPM
		obd_speed = obd.commands.SPEED
		obd_throttle = obd.commands.THROTTLE_POS
		writer = csv.writer(f)
		writer.writerow(header)

		i = 0
		while(i < 11):
			res_obd_rpm = connection.query(obd_rpm)
			res_obd_speed = connection.query(obd_speed)
			res_obd_throttle = connection.query(obd_throttle)
			
			print(res_obd_rpm.value)
			print(res_obd_speed.value.to("mph"))
			print(res_obd_throttle.value) # user-friendly unit conversions
			print("Acceleration: X:%.2f, Y: %.2f, Z: %.2f m/s^2" % (icm.acceleration))
			print("Gyro X:%.2f, Y: %.2f, Z: %.2f rads/s" % (icm.gyro))
			
			data = [datetime.now().strftime("%I:%M:%S %p"), res_obd_rpm.value.magnitude, res_obd_speed.value.to("mph").magnitude, res_obd_throttle.value.magnitude, icm.acceleration, icm.gyro]
			writer.writerow(data)
			
			time.sleep(0.5)
			i = i+1


		connection.close()
		f.close()