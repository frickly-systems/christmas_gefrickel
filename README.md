# Frickly Systems Weihnachtsgefrickel

Dieses Projekt ist eine Anleitung zum Nachbauen einer kleinen, weihnachtlichen Modellplatte mit einem blinkenden Weihnachtsbaum.
Hierbei kann der Weihnachtsbaum über eine Webapp via Bluetooth gesteuert werden und auch nach dem hochladen einer Musik im Rhytmus zu dieser blinken.

## Bauteile Liste

Modell:
* Holzplatte, am besten 13mm
* Gips
* weiße Abtönfarbe
* Holzleim
* Sekundenkleber / Alles Kleber
* beleuchteter Weihnachtsbaum, verschneit, 12cm (Noch 22130) andere Größen alternativ auch erhältlich
* Schneeflocken (Noch 8760)
* Pulverschnee (Noch 08750)
* Figuren: Figuren-Themenwelt „Wintertag“ (Noch 16220)
* Figuren: Weihnachtsfiguren (Noch 15920)


Elektronik:
* 5V ein Kanal Relais Modul
* ESP32 NodeMCU
* 9V Batterieblock und Anschlusskabel
* Breadboard
* einige Jumper Kabel

## Aufbau der Grundplatte

Zuerst sägt man sich eine Grundplatte zurecht. In diesem Fall habe ich dazu eine Rolle Kreppband als Vorlage genommen. Natürlich kann man auch andere Formen wählen, zum Beispiel eine Freiform oder ein Rechteck. Letzteres hat den Vorteil das es einfacher zu sägen ist.

![Zuschnitt Markierung](./imgs/zuschnitt-1.jpg "Markierung der Grundplatte")

Das verwendete Holz sollte eine Gewisse Dicke aufweisen, in unserem Fall 13 mm. 
Das Holz kann je nach Form und Verfügbarkeit von Werkzeugen mit einer Handsäge, einer Stichsäge oder auch einer Fräse zugeschnitten werden. Im Anschluss die Kanten nachschleifen um Spleisen zu vermeiden.

![Zuschnitt](./imgs/zuschnitt-2.jpg "Zuschnitt des Holzes")

Als erster Schritt des Aufbaus wird der Rand mit Kreppband abgeklebt. Dies verhindert ein Bemalen des Randes sofern dieser nicht sowieso bemalt werden soll.

Im Anschluss rührt man Gips nach Packungsanleitung an und trägt die grobe Form der Schneemassen mit einem feinen Spachtel auf. Hierbei ist zu beachten an welchen Stellen man mehr oder weniger Schnee möchte. In unserem Fall soll vor dem Baum und direkt unter dem Baum weniger Schnee dargestellt werden. Auch in der Realität liegt hier weniger Schnee, da zum Beispiel viele Leute dort entlang gehen und der Baum den Schnee abschirmt.

![Gips](imgs/auftrag-gips.jpg "Auftrag des Gipses")

Der Gips sollte keine scharfen Kanten aufweisen, dazu kann man entweder mit einem feutchen Spachtel leicht auf den Gips klopfen, so dass er an diesen Stellen stärker verläuft. Alternativ kann man auch mit einem Schmiergelpapier oder einer Schleifmaschine nach der Trocknung die Kanten wegschleifen. Hier sei von einer starken Gipsstaubbildung gewarnt, was im Regelfall entsprechende Vorkehrungen wie eine Maske notwendig macht.

Nachdem der Gips ausgehärtet und eventuell nachgeschliffen ist, trägt man mehrmals dick weiße Abtönfarbe auf (2-3 Schichten). Im Anschluss tupft man eine zusätzliche Schicht auf, so dass keine Pinselstriche zu sehen sind und die Oberfläche leicht rau ist.

![Farbauftrag](imgs/bemalung.jpg)

Wenn die Farbe durchgetrocknet ist, mischt man Holzleim mit etwas Wasser und streicht es auf die gesammte Fläche. Im Anschluss wird direkt das Flockpulver aufgesträut und das Ganze gut trocknen gelassen. Im Idealfall wird kein schnelltrockender Holzleim verwendet. Nach dem Durchtrockenen die ganze Fläche absaugen.

![Ergebnis](imgs/stellprobe.jpg "Ergebnis mit einigen Figuren und noch etwas statischen Schneeflocken")


Nun kann es an die Dekoration gehen. Dazu bohrt man in die Mitte der Platte ein Loch, führt die Kabel des Weihnachtsbaumes durch, und klebt diesen darüber fest. Hierzu hat sich Sekundenkleber als sehr geeignet erwiesen.

Im Anschluss kann man die Platte noch nach Belieben mit Figuren ausdekorieren, hier kann man die Fotos als Inspirationsquelle nutzen. Zum Festkleben der Figuren eignet sich Sekundenkleber oder Alleskleber.

## Aufbau der Elektronik

Nun zum elektronischen Teil des Aufbaus. Zuerst lötet man an die Drähte des Weihnachtsbaumes dickere Drähte um in der Lage zu sein diese auch vernünftig anschließen zu können.

Dann verbindet man den Pluspol des Baumes (herauszufinden nur durch testen) mit dem NO-Ausgang des Relais und den Minuspol mit der Batterie direkt. Der Pluspol der Batterie wird mit dem mittleren Anschluss des Relais (Eingang) verbunden. Alternativ dem 9V Batterieblock kann auch eine Gleichstromquelle zwischen 9 und 12V verwendet werden.

Das Relais selbst wird nach Beschriftung mit dem 5V Ausgang und der Masse des ESP32 verbunden. Das Steuersignal wird an Pin 12 angeschlossen. Achtung das Relais braucht als Versorgungsspannung 5V, zum Schalten reichen aber auch die 3,3V der GPIOs des ESP32.

Für die Stromversorgung des ESP32 nutzen wir das Mikro USB Kabel, da wird dieses zum Flashen sowieso benötigen.

Falls das etwas schwierig nachzuvollziehen ist, hier ein Schaltbild
![Schema](./imgs/Schematic.png "Aufbau Elektronik")

Nun flashen wir das Program (in `esp32_firmware`), in dem wir das .ino File mit der Arduino IDE öffnen und den Compile und Flash Button drücken. Zuvor muss jedoch der ESP32 Support in der Arduino IDE installiert werden. Hierzu die [Anleitung](https://github.com/espressif/arduino-esp32/blob/master/docs/arduino-ide/boards_manager.md) verwenden. Im Anschluss als Board unter Tools -> Board das `ESP32 Dev Module` auswählen. Je nach ESP32 Board muss zum Flashen ein Boot Button gepresst werden. Das heißt im Falle eines Verbindungsfehlers den Vorgang einfach wiederholen und den Button drücken.

Zum Verbinden mit dem ESP32 kann die mitgelieferte React Webapp in `weihnachts-app` genutzt werden. Dazu im `weihnacts-app` Ordner einfach `yarn start` ausführen. 
Dadurch wird die Webapp gestartet und kann direkt benutzt werden. Dabei sind allerdings zwei Einschränkungen zu beachten
Erstens ist zum Verbinden ein Bluetooth fähiges Gerät nötig und zweitens ein moderner Webbrowser (getestet mit Chrome 87.0.4280.88).

Nach dem Verbinden des Baums kann entweder die LEDs an und ausgeschaltet werden (Toggle LED) oder ein Musikstück hochgeladen und abgespielt werden. In diesem Fall blinkt der Baum im Rhythmus zur Musik.

![Webapp](./imgs/webapp.png "Screenshot Webapp")

### Wie funktioniert das Ganze?
Die Musikanalyse findet in `AudioAnalyzer.js` Nach dem Hochladen eines Musikstücks wird zuerst der Grundtakt bestimmt. Im Anschluss wird ein Tiefpass Filter auf die Musik angewendet um den Hauptrythmus hervorzuheben. Dieser wird nun auf Maxima untersucht, die zugleich eine gewisse Mindesstärke haben. Hierzu wird in einem Fenster vor und nach einem Datenpunkt das Maximum bestimmt und geprüft ob dieses Größer als ein Threshold ist. Dieses Maxima werden in eine Liste eingetragen und beim Abspielen der Musik zum jeweiligen Zeitpunkt genutzt um die Beleuchtung zu aktivieren. Des Rest des Codes besteht aus der Darstellung der UI und der Bluetooth Kommunikation.