import datetime
import time
from time import sleep
import requests
from ics import Calendar

url = "https://rooster.hsleiden.nl/ical bla bla bla"

excludeList = [
    "ISLPR_differentiatie.onderwijs_01",
    "ISLPR_differentiatie.onderwijs_02",
    "ISLPR_differentiatie.onderwijs_03",
    "ISLPR_differentiatie.onderwijs_04",
    "ISLPR_differentiatie.onderwijs_05",
    "ISLPR_propedeuse_lab/01",
    "ISLPR_propedeuse_lab/02",
    "ISLPR_propedeuse_lab/03",
    "ISLPR_propedeuse_lab/04",
    "ISLPR_propedeuse_lab/05",
]

rooster = Calendar(requests.get(url).text)
roosterList = list(rooster.timeline)

for roosterItem in roosterList:
    if roosterItem.name in excludeList:
        rooster.events.discard(roosterItem)

with open('rooster.ics', 'w') as icsFile:
    for line in rooster:
        icsFile.write(line.strip() + "\r\n")
    sCurrentTime = datetime.datetime.now().time().strftime("%H:%M")
    print("Updated at: " + sCurrentTime)
