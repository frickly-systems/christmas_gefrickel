import "./App.css";
import React, { useState, useCallback, useRef } from "react";
import BLECom from "./Bluetooth";
import * as trackAnalyzer from "./AudioAnalyzer";

import { ReactComponent as ChristmasTree } from "./images/Weihnachtsbaum.svg";
import Packet1 from "./images/Geschenk1.svg";
import Packet2 from "./images/Geschenk2.svg";
import Packet3 from "./images/Geschenk3.svg";
import Packet4 from "./images/Geschenk4.svg";

const AudioLoaderComponent = ({ onAudiofileChange, onPeaklistChange }) => {
  const analyzeBpm = async (file) => {
    console.log("Analyzing bpm");

    const context = new (window.AudioContext || window.webkitAudioContext)();
    console.log(context);
    let reader = new FileReader();
    reader.onload = () => {
      console.log(reader.result);

      context.decodeAudioData(reader.result, async (buffer) => {
        console.log("Received buffer");
        onPeaklistChange(await trackAnalyzer.getTrackPeaks(buffer));
      });
    };

    reader.readAsArrayBuffer(file);
  };

  const onAudiofileChoosen = async (event) => {
    console.log("On audiofile called");
    console.log(event.target.files[0]);

    var file = URL.createObjectURL(event.target.files[0]);

    onAudiofileChange(file);

    await analyzeBpm(event.target.files[0]);
  };

  return (
    <input
      id="audio_file"
      type="file"
      accept="audio/*"
      onChange={onAudiofileChoosen}
    />
  );
};

const AudioComponent = ({ bleCom }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [peakList, setPeakList] = useState(null);
  const [ledOn, setLedOn] = useState(false);
  const [lastEvent, setLastEvent] = useState(0);
  const audioPlayer = useRef(null);

  const onTimeupdate = useCallback(
    (e) => {
      if (!peakList) {
        return;
      }

      const currentTime = audioPlayer.current.currentTime;
      var current_event = 0;
      for (var i = 0; i < peakList.length; i++) {
        if (peakList[i] / 44100 > currentTime) {
          break;
        }
        current_event = peakList[i];
      }

      if (current_event !== lastEvent) {
        setLedOn((ledOn) => !ledOn);
        bleCom.sendLEDState(!ledOn);

        setLastEvent(current_event);
      }
    },
    [peakList, bleCom, ledOn]
  );

  const onPlayButtonClicked = (e) => {
    if (audioPlayer.current?.src) {
      audioPlayer.current.src = null;
    } else if (audioPlayer.current) {
      audioPlayer.current.src = audioFile;
      audioPlayer.current.play();
    }
  };

  return (
    <div className="controls">
      <AudioLoaderComponent
        className="controlElement"
        onAudiofileChange={setAudioFile}
        onPeaklistChange={setPeakList}
      />
      <audio id="audio_player" ref={audioPlayer} onTimeUpdate={onTimeupdate} />
      <button
        className="controlElement"
        onClick={onPlayButtonClicked}
        disabled={!peakList}
      >
        TogglePlayback
      </button>
      <BlinkComponent bleCom={bleCom} className="controlElement" />
    </div>
  );
};

const BlinkComponent = ({ bleCom }) => {
  const [ledOn, setLedOn] = useState(false);

  const toggleLed = async () => {
    setLedOn((ledOn) => !ledOn);
    bleCom.sendLEDState(!ledOn);
  };

  return <button onClick={toggleLed}>Toggle LED</button>;
};

function App() {
  const [bleCom] = useState(new BLECom());
  const [isPaired, setIsPaired] = useState(false);

  const onConnectClicked = async () => {
    console.log("Click event");
    await bleCom.getChristmasTreeConnection();
    setIsPaired(bleCom.isConnected());
  };

  return (
    <div className="App">
      <header></header>
      {!isPaired && (
        <button onClick={onConnectClicked} className="controls">
          Connect bluetooth
        </button>
      )}
      {isPaired && <AudioComponent bleCom={bleCom} />}

      <div className="christmas_stuff">
        <img className="packet" src={Packet1} />
        <img className="packet" src={Packet2} />
        <ChristmasTree className="christmasTree" />
        <img className="packet" src={Packet3} />
        <img className="packet" src={Packet4} />
      </div>
    </div>
  );
}

export default App;
