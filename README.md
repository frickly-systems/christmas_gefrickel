# Frickly Systems Christmas Frickling

Dieses Projekt ist eine Anleitung zum Nachbauen einer kleinen, weihnachtlichen Modellplatte mit einem blinkenden Weihnachtsbaum.
Hierbei kann der Weihnachtsbaum über eine Webapp via Bluetooth gesteuert werden und auch nach dem hochladen einer Musik im Rhytmus zu dieser blinken.

This project is a tutorial to build a small Christmas model with a blinking Christmas tree.
The Christmas tree can be controlled via a web app connected to the system via Bluetooth and can also flash to the rhythm of music you can upload in the webapp.

## Parts list

Model:
* Wooden board, around 13mm
* Plaster
* White tint paint
* Woodglue
* Superglue
* illuminated christmas tree, snowy, 12cm (Noch 22130) you can also get it in different sizes
* Snowflakes (Noch 8760)
* Powder snow (Noch 08750)
* Figures: Figures theme world "Winter day" (Noch 16220)
* Figures: Christmas figures (Noch 15920)


Electronics:
* 5V single channel relay module
* ESP32 NodeMCU
* 9V Battery block and cable
* Breadboard
* Some jumpercables

## Base plate structure

First you cut out the base plate. In this case, I took a masking tape roll as a template. Of course, you can also choose other shapes, for example, a free form or a rectangle. The latter has the advantage that it is easier to cut out of course.

![Zuschnitt Markierung](./imgs/zuschnitt-1.jpg "Cutting marks for the base plate")

The wood you use should have a certain thickness, in our case it's 13 mm. 
Depending on the shape and the tools you have, the wood can be cut with a handsaw, jigsaw or even a CNC router. Subsequently, sand the edges to avoid splicing.

![Zuschnitt](./imgs/zuschnitt-2.jpg "Cutting the wood")

The first step is to mask the edge with masking tape. This prevents the edge from being painted unless it is to be painted anyway.

Then stir the plaster according to the instructions and apply the rough shape of the snow masses with a fine spatula. Consider at which places you'd like to have more or less snow. In our case, we want less snow in front of the tree and directly under the tree. In reality, there is also less snow here, because, for example, many people walk along there and the tree shields the snow.

![Gips](imgs/auftrag-gips.jpg "Applying the plaster")

The plaster should not have any sharp edges. To achieve this, you can either tap the plaster lightly with a fine trowel so that it gets smoother or sand away the edges with sandpaper or a grinder after drying. Be warned of a strong plaster dust formation, which usually makes appropriate precautions such as a mask necessary.

After the plaster got hard and fully dry, you can sand it again and apply several thick coats of white tinting paint (2-3 coats). After that, use light tapping to apply an additional layer so that no brush strokes are visible and the surface is slightly rough.

![Farbauftrag](imgs/bemalung.jpg)

When the paint has fully dried, mix the wood glue with a little water and spread it on the entire surface. After that, the snowflake powder is directly sprinkled on and the whole assembly is allowed to dry well. Ideally, do not use fast-drying wood glue. After drying, vacuum-clean the entire surface.

![Ergebnis](imgs/stellprobe.jpg "Final result with some figures and some static snowflakes")


Now comes the decoration. Drill a hole in the middle of the plate, pass the cables of the Christmas tree through it, and glue it in. Superglue has proven to be very suitable for this purpose.

After that, you can decorate the plate with figures as you like. You can use the photos as a source of inspiration. Superglue or all-purpose glue is suitable for gluing on the figures.

## Assembling the electronics

Now on to the electronics. First solder some thicker wires to the wires of the Christmas tree to be able to connect them properly.

After that, connect the positive pole of the tree (to be found out by testing) to the NO-output of the relay and the negative pole to the battery directly. The positive pole of the battery is connected to the middle terminal of the relay (input). Alternatively to the 9V battery block, you can also use a DC source between 9 and 12V.

The relay itself is connected to the 5V output and the ground of the ESP32 according to the labeling. The control signal is connected to pin 12. Keep in mind that the relay needs 5V as supply voltage. However, for switching the 3.3V of the GPIOs of the ESP32 are sufficient.

For the power supply of the ESP32 we use the micro USB cable. We need it for flashing anyway.

In case this is a little bit difficult to understand, here is a schematic
![Schema](./imgs/Schematic.png "Schematic")

Now we can flash the ESP32 (in `esp32_firmware`) by opning the .ino file using the Arduino IDE and pressing the "compile and flash" button. However, you have to install the ESP32 support packages in the Arduino IDE. You can use the [Manual](https://github.com/espressif/arduino-esp32/blob/master/docs/arduino-ide/boards_manager.md) to do that. After that choose the `ESP32 Dev Module` in the menu Tools -> Board.  Depending on the ESP32 board a button needs to be be pressed for flashing. This means in case of a connection error simply repeat the process and press the button.

To connect to the ESP32 you can use the included React webapp in `weihnacts-app`. Simply run `yarn start` in the `weihnacts-app` folder. 
This will start the webapp and you can use it directly. However, there are two restrictions to consider
First, you need a Bluetooth enabled device to connect from and second, you need a modern web browser (tested with Chrome 87.0.4280.88).

After connecting the tree, the LEDs can be turned on and off (toggle LED) or a piece of music can be uploaded and played. In this case the tree flashes in rhythm to the music.

![Webapp](./imgs/webapp.png "Screenshot Webapp")

### How does it work?
The music analysis takes place in `AudioAnalyzer.js`. After uploading a piece of music, first the basic rhythm is determined. Then a low pass filter is applied to the music to emphasize the main rhythm. This is now examined for maxima, which at the same time have a certain minimum strength. To do this, the maximum is determined in a window before and after a data point and it is checked whether this is greater than a threshold. These maxima are entered into a list and used to activate the lighting when the music is played at the respective time. The rest of the code consists of the display of the UI and the Bluetooth communication.