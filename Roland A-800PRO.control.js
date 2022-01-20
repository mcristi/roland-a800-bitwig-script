loadAPI(10);

host.defineController("Roland", "A-800 PRO", "1.0", "95173279-8c92-426c-bd48-4e63f555524b", "mcristi");
host.defineMidiPorts(1, 1);


/**
 * Midi CC mappings
 */
const _L1 = 21;
const _L2 = 22;
const _L3 = 23;
const _L4 = 24;
const _L5 = 25;
const _L6 = 26;
const _L7 = 27;
const _L8 = 28;

const _B1 = 29;
const _B2 = 30;
const _B3 = 31;
const _B4 = 32;

const _A1 = 41;
const _A2 = 42;
const _A3 = 43;
const _A4 = 44;
const _A5 = 45;
const _A6 = 46;
const _A7 = 47;
const _A8 = 48;

const _R1 = 102;
const _R2 = 103;
const _R3 = 104;
const _R4 = 105;
const _R5 = 106;
const _R6 = 107;
const _R7 = 108;
const _R8 = 109;
const _R9 = 119;

const _S1 = 110;
const _S2 = 111;
const _S3 = 112;
const _S4 = 113;
const _S5 = 114;
const _S6 = 115;
const _S7 = 116;
const _S8 = 117;
const _S9 = 118;


/**
 * Midi CC mappings
 */
const ON = 127;
const OFF = 0;
const GRID_SIZE = 32;
const NUMBER_OF_SENDS = 8;


function init() {
    application = host.createApplication();
    project = host.getProject();
    transport = host.createTransport();

    cursorTrack = host.createCursorTrack(NUMBER_OF_SENDS, GRID_SIZE);
    masterTrack = host.createMasterTrack(0);
    cursorClip = host.createLauncherCursorClip(GRID_SIZE, 1);
    trackBank = host.createTrackBank(GRID_SIZE, NUMBER_OF_SENDS, GRID_SIZE);
    sceneBank = trackBank.sceneBank();
    deviceCursor = cursorTrack.createCursorDevice();
    controlPageCursor = deviceCursor.createCursorRemoteControlsPage(GRID_SIZE);

    transport.isPlaying().markInterested();
    for (let i = 0; i < GRID_SIZE; i++) {
        cursorTrack.clipLauncherSlotBank().getItemAt(i).hasContent().markInterested();
        cursorTrack.clipLauncherSlotBank().getItemAt(i).isRecording().markInterested();
        cursorTrack.clipLauncherSlotBank().getItemAt(i).isPlaying().markInterested();
        sceneBank.getScene(i).exists().markInterested();
    }
    for (let i = 0; i < GRID_SIZE; i++) {
        trackBank.getTrack(i).trackType().markInterested();
    }

    // Create 16 NoteInputs + Omni
    MultiBi = host.getMidiInPort(0).createNoteInput("MultiBi - Omni", "??????");
    MultiBi1 = host.getMidiInPort(0).createNoteInput("MultiBi - Ch 1", "?0????");
    MultiBi2 = host.getMidiInPort(0).createNoteInput("MultiBi - Ch 2", "?1????");

    // Disable the consuming of events by the NoteInputs, so they are also available for mapping
    MultiBi.setShouldConsumeEvents(false);
    MultiBi1.setShouldConsumeEvents(false);

    // Enable Poly AT translation into Timbre for the internal BWS instruments
    MultiBi.assignPolyphonicAftertouchToExpression(0, NoteExpression.TIMBRE_UP, 5);
    MultiBi1.assignPolyphonicAftertouchToExpression(0, NoteExpression.TIMBRE_UP, 5);
    MultiBi2.assignPolyphonicAftertouchToExpression(1, NoteExpression.TIMBRE_UP, 5);

    // Enable Midi Beat Clock
    host.getMidiOutPort(0).setShouldSendMidiBeatClock;

    // Setting Callbacks for Midi and Sysex
    host.getMidiInPort(0).setMidiCallback(onMidi);
    host.getMidiInPort(0).setSysexCallback(onSysex);
}

function onMidi(status, data1, data2) {
    // printMidi(status, data1, data2);

    if (isChannelController(status)) {
        switch (data1) {
            case _L5:
                if (data2 == OFF) {
                    stop();
                }
                break;
            case _L6:
                if (data2 == OFF) {
                    play();
                }
                break;
            case _L8:
                if (data2 == ON) {
                    recordClip();
                }
                break;
            case _L7:
                if (data2 == OFF) {
                    pause();
                }
                break;
            case _L2:
                if (data2 == OFF) {
                    selectDevicePreviousPage();
                }
                break;
            case _L3:
                if (data2 == OFF) {
                    selectDeviceNextPage();
                }
                break;
            case _L1:
                if (data2 == OFF) {
                    selectAndArmPreviousTrack();
                }
                break;
            case _L4:
                if (data2 == OFF) {
                    selectAndArmNextTrack();
                }
                break;

            case _B1:
                if (data2 == OFF) {
                    undo();
                }
                break;
            case _B2:
                if (data2 == OFF) {
                    quantize();
                }
                break;
            case _B3:
                if (data2 == OFF) {
                    setClipOverdub(false);
                    setClipAutomationOverdub(false);
                } else if (data2 == ON) {
                    setClipOverdub(true);
                    setClipAutomationOverdub(true);
                }
                break;
            case _B4:
                if (data2 == OFF) {
                    setMetronome(false);
                } else if (data2 == ON) {
                    setMetronome(true);
                }
                break;

            case _R1:
                setDevicePageParameter(0, data2);
                break;
            case _R2:
                setDevicePageParameter(1, data2);
                break;
            case _R3:
                setDevicePageParameter(2, data2);
                break;
            case _R4:
                setDevicePageParameter(3, data2);
                break;
            case _R5:
                setDevicePageParameter(4, data2);
                break;
            case _R6:
                setDevicePageParameter(5, data2);
                break;
            case _R7:
                setDevicePageParameter(6, data2);
                break;
            case _R8:
                setDevicePageParameter(7, data2);
                break;
            case _R9:
                setCueVolume(data2);
                break;

            case _S1:
                setTrackVolume(0, data2);
                break;
            case _S2:
                setTrackVolume(1, data2);
                break;
            case _S3:
                setTrackVolume(2, data2);
                break;
            case _S4:
                setTrackVolume(3, data2);
                break;
            case _S5:
                setTrackVolume(4, data2);
                break;
            case _S6:
                setTrackVolume(5, data2);
                break;
            case _S7:
                setTrackVolume(6, data2);
                break;
            case _S8:
                setTrackVolume(7, data2);
                break;
            case _S9:
                setMasterVolume(data2);
                break;


            case _A1:
                if (data2 == OFF) {
                    clearArmTrack(0);
                } else if (data2 == ON) {
                    selectAndArmTrack(0);
                }
                break;
            case _A2:
                if (data2 == OFF) {
                    clearArmTrack(1);
                } else if (data2 == ON) {
                    selectAndArmTrack(1);
                }
                break;
            case _A3:
                if (data2 == OFF) {
                    clearArmTrack(2);
                } else if (data2 == ON) {
                    selectAndArmTrack(2);
                }
                break;
            case _A4:
                if (data2 == OFF) {
                    clearArmTrack(3);
                } else if (data2 == ON) {
                    selectAndArmTrack(3);
                }
                break;
            case _A5:
                if (data2 == OFF) {
                    clearArmTrack(4);
                } else if (data2 == ON) {
                    selectAndArmTrack(4);
                }
                break;
            case _A6:
                if (data2 == OFF) {
                    clearArmTrack(5);
                } else if (data2 == ON) {
                    selectAndArmTrack(5);
                }
                break;
            case _A7:
                if (data2 == OFF) {
                    clearArmTrack(6);
                } else if (data2 == ON) {
                    selectAndArmTrack(6);
                }
                break;
            case _A8:
                if (data2 == OFF) {
                    clearArmTrack(7);
                } else if (data2 == ON) {
                    selectAndArmTrack(7);
                }
                break;
        }
    }
}


function exit() {
    // nothing to do here ;-)
}


function onSysex(data) {
    //printSysex(data);
}


/**
 * Wrapper functions over Bitwig API
 */

function selectAndArmPreviousTrack() {
    clearAllArms();

    cursorTrack.selectPrevious();
    cursorTrack.getArm().set(true);
}

function selectAndArmNextTrack() {
    clearAllArms();

    cursorTrack.selectNext();
    cursorTrack.getArm().set(true);
}

function clearAllArms() {
    for (let i = 0; i < GRID_SIZE; i++) {
        trackBank.getChannel(i).getArm().set(false);
    }
}

function selectAndArmTrack(index) {
    trackBank.getChannel(index).select();
    cursorTrack.getArm().set(true);
}

function clearArmTrack(index) {
    trackBank.getChannel(index).getArm().set(false);
}

function setMasterVolume(data2) {
    masterTrack.getVolume().set(data2, 128);
    masterTrack.getVolume().setIndication(true);
}

function stop() {
    transport.stop();
}

function play() {
    if (!transport.isPlaying().get()) {
        transport.continuePlayback()
    }
}

function pause() {
    if (transport.isPlaying().get()) {
        transport.isPlaying().set(false);
    }
}

function selectDevicePreviousPage() {
    controlPageCursor.selectPreviousPage(true);
}

function selectDeviceNextPage() {
    controlPageCursor.selectNextPage(true);
}

function undo() {
    application.undo();
}

function setClipOverdub(value) {
    transport.isClipLauncherOverdubEnabled().set(value);
}

function setClipAutomationOverdub(value) {
    transport.isClipLauncherAutomationWriteEnabled().set(value);
}

function setMetronome(value) {
    transport.setClick(value);
}

function setDevicePageParameter(parameterIndex, value) {
    controlPageCursor.getParameter(parameterIndex).set(value, 128);
}

function setCueVolume(value) {
    project.cueVolume().set(value, 128);
}

function setTrackVolume(trackIndex, value) {
    // NOTE: set(value, 161) will top the fader to 0dB
    trackBank.getChannel(trackIndex).getVolume().set(value, 161);
}

function recordClip() {
    let slotBank = cursorTrack.clipLauncherSlotBank();

    let isAnyRecordingItem = false;
    for (let i = 0; i < GRID_SIZE; i++) {
        let isRecording = slotBank.getItemAt(i).isRecording().get();
        if (isRecording) {
            slotBank.getItemAt(i).launch();
            slotBank.getItemAt(i).select();
            isAnyRecordingItem = true;
            i = GRID_SIZE;
        }
    }

    if (!isAnyRecordingItem) {
        for (let i = 0; i < GRID_SIZE; i++) {
            let hasContent = slotBank.getItemAt(i).hasContent().get();
            if (!hasContent) {
                let sceneExists = sceneBank.getScene(i).exists().get();
                if (sceneExists) {
                    slotBank.record(i);
                    slotBank.getItemAt(i).select();
                } else {
                    host.showPopupNotification('No more scenes');
                }

                i = GRID_SIZE;
            }
        }
    }
}

function quantize() {
    cursorClip.quantize(1.0);
}
