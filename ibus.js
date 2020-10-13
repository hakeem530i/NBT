var IbusInterface = require('ibus').IbusInterface;
var IbusDevices = require('ibus').IbusDevices;

var can = require('socketcan');

var fs = require('fs');
const { execSync } = require('child_process');

let date = new Date()
let hour = date.getHours().toString(16)
let index = 0
let timeout = Date.now();
var channel = can.createRawChannel("can1");

//
let canGoSleep = false;
                

let pauseCount = 0;

let t,nbtvolcount,volumeUpTimer;

function startNBT(){
    execSync('sudo /sbin/ip link set can1 up type can bitrate 500000');

    t= setInterval(()=> {
        channel.send(nbtOn);
        //DO NOT ENABLE CRASHES NBT
        // channel.send({id: 0x202, data: new Buffer([0x254, 0xFF])})
        // channel.send({id:0x6f1, data: new Buffer([[ 0x63, 0x10, 0x0B, 0x31, 0x01, 0xA0, 0x1C, 0x00 ]])})
        // channel.send(avg)
        // console.log("ONNN")
    }, 100);

    console.log("Started NBT")
}

startNBT();

//Shutdown pi after 10sec
function shutDownPi() {
    setTimeout(() => {
        console.log("Shutting down now")
        // execSync("sudo shutdown -h now")
    }, 10000);
}



// settime(()=> }, 10000);

// config
var device = '/dev/ttyUSB0';
// var device = '/dev/cu.usbserial-A601HPGR';

// data
var ibusInterface = new IbusInterface(device);

let nbtOn = {id: 0x12f, data: new Buffer([0x37, 0x7C, 0x8A, 0xDD, 0xd4, 0x05, 0x33, 0x6B])};
//let nbtOn = {id: 0x12f, data: new Buffer([0x5A,	0x8A,0xDD,0xD4,0x05,0xC0,0x01])};

let nbtOff = {id: 0x12f, data: new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])};
let volumeUp = {id: 0x1d6, data: new Buffer([0xC8, 0x00])}
let volumeDown = {id: 0x1d6, data: new Buffer([0xC4, 0x00])}
// let volumeCounter = {id: 0x1d6, data: new Buffer([0xC0, 0x0C])} //Buggy
let leftSteeringButton = {id: 0x1d6, data: new Buffer([0xE0, 0x00])}
let rightSteeringButton = {id: 0x1d6, data: new Buffer([0xD0, 0x0C])}
let voiceButton = {id: 0x1d6, data: new Buffer([0xC0, 0x0D])}
let pauseButton = {id: 0x0a1, data: new Buffer([0x04, 0xff])}
let ignitionOnMessage = {id: 0x336, data: new Buffer([0x00, 0x03,0x03, 0xFE,0xFF,0xFE,0xFF])}
let EGS_park = {id: 0x304, data: new Buffer([0xE3, 0xFF])}
let EGS_reverse = {id: 0x304, data: new Buffer([0xC2, 0xFF])}
let EGS_reverse2 = {id: 0x37a, data: new Buffer([0xF3,0xFE,0x20])}
let obc = {id:0x35c, data: new Buffer([0xDF,0xF4,0xFF,0xF0])}
let obc4 = {id:0x366, data: new Buffer([0x50,0xC0,0x16,0xFC	])}
let obc5 = {id:0x364, data: new Buffer([0xFD,0xFD,0xFF,0xFD,0xDF,0xFD,0xFF	])}
let obc2 = {id:0x35e, data: new Buffer([0xFE,0x0F,0xFE,0xFE,0xFF,0xFF,0xFF,0xFF	])}
//
let obc6 = {id:0x362, data: new Buffer([0xFC,0xE0,0xFF,0xFC,0xE0,0xFF,0xE5	])}//Speed 1st screen
let obc3 = {id:0x362, data: new Buffer([0xFE,0x0F,0x0C,0xFE,0xEF,0xFF,0xE5])}//Fuel consumption


let avg = {id:0x330, data: new Buffer([0x95,0x0A,0x01,0x2D,0x29,0x2F,0x9C,0x34])}




// events
//process.on('SIGINT', onSignalInt);
ibusInterface.on('data', onIbusData);

// implementation
function onSignalInt() {
    ibusInterface.shutdown(function() {
        process.exit();
    });
}

// function startNBT() { 
//     // channel.send(nbtOn);
//     t = setInterval(()=>console.log("ONNN"), 1000)
// } 
// function turnOffNBT() { 
//     // channel.send(nbtOn);
//     t = setInterval(()=>console.log("OFFF"), 1000)
// } 


///DELETE THIS BROO 
// nbtvolcount = setInterval(()=> {
//     // clearInterval(volumeUpTimer);
//     channel.send(volumeCounter)
//     channel.send(ignitionOnMessage)

//     timeDate = {id:0x2f8, data: new Buffer([`0x${new Date().getHours().toString(16)}`, `0x${new Date().getMinutes().toString(16)}`, `0x${new Date().getSeconds().toString(16)}`, `0x${new Date().getUTCDate().toString(16)}`, `0x${(new Date().getMonth()+1).toString(16)}F`, `0x${new Date().getFullYear().toString(16)[1]}${new Date().getFullYear().toString(16)[2]}`, `0x${new Date().getFullYear().toString(16)[0]}`, 0xFD])} //Time and date
//     channel.send(timeDate)
// }, 1000);

//Send ibus
//3f 0b BF 0c 00 00 80 00 00 00 00 06
// ibusInterface.sendMessage({
//     src: 0x68,
//     dst: 0xc0,
//     msg: Buffer.concat([new Buffer([0x23, 0x40, 0x20]), getPaddedLenBuf(_self.title2, 11)])
// });

function onIbusData(data) {
    
    // console.log('[IbusReader]', 'Id:      ', data.id);
    // console.log('[IbusReader]', 'From:    ', IbusDevices.getDeviceName(data.src));
    // console.log('[IbusReader]', 'To:      ', IbusDevices.getDeviceName(data.dst));
    // console.log('[IbusReader]', 'Message: ', data.msg.toString('ascii'), data.msg, '\n');
            // let timeDate = {id:0x2f8, data: new Buffer([`0x${new Date().getHours().toString(16)}`, `0x${new Date().getMinutes().toString(16)}`, `0x${new Date().getSeconds().toString(16)}`, `0x${new Date().getUTCDate().toString(16)}`, `0x${(new Date().getMonth()+1).toString(16)}F`, `0x${new Date().getFullYear().toString(16)[1]}${new Date().getFullYear().toString(16)[2]}`, `0x${new Date().getFullYear().toString(16)[0]}`, 0xFD])} //Time and date


    // if (Date.now() - timeout > 100 ){
    //     console.log("100")
        
        
    //     let timeDate = {id:0x2f8, data: new Buffer([`0x${new Date().getHours().toString(16)}`, `
    //     0x${new Date().getMinutes().toString(16)}`, 
    //     `0x${new Date().getSeconds().toString(16)}`, 
    //     `0x${new Date().getUTCDate().toString(16)}`, `0x${(new Date().getMonth()+1).toString(16)}F`, `0x${new Date().getFullYear().toString(16)[1]}${new Date().getFullYear().toString(16)[2]}`, `0x${new Date().getFullYear().toString(16)[0]}`, 0xFD])} //Time and date
    //     channel.send(timeDate)
    //     timeout = Date.now();
    // }

    // let timeDate = {id:0x2f8, data: new Buffer([`0x${new Date().getHours().toString(16)}`, `0x${new Date().getMinutes().toString(16)}`, `0x${new Date().getSeconds().toString(16)}`, `0x${new Date().getUTCDate().toString(16)}`, `0x${(new Date().getMonth()+1).toString(16)}F`, `0x${new Date().getFullYear().toString(16)[1]}${new Date().getFullYear().toString(16)[2]}`, `0x${new Date().getFullYear().toString(16)[0]}`, 0xFD])} //Time and date

        

    let busModule = IbusDevices.getDeviceName(data.src).substr(0,IbusDevices.getDeviceName(data.src).indexOf(' '));
    
    if(busModule.toLocaleLowerCase() == "instrumentclusterelectronics"){
        //     console.log('[IbusReader]', 'Id:      ', data.id);
        // console.log('[IbusReader]', 'From:    ', IbusDevices.getDeviceName(data.src));
        // console.log('[IbusReader]', 'To:      ', IbusDevices.getDeviceName(data.dst));
        // console.log('[IbusReader]', 'Message: ', data.msg.toString('ascii'), data.msg, '\n');
        // console.log(data.msg[2])

        //Car is in reverse
        if(data.msg[2]== 16){
            // console.log("REVERSE")
        }
    }
    nbtvolcount = setInterval(()=> {
        // clearInterval(volumeUpTimer);
        // channel.send(volumeCounter)
        // channel.send(ignitionOnMessage)
        // console.log("Second")
        // channel.send(EGS_park)
        // channel.send(EGS_reverse2)
        timeDate = {id:0x2f8, data: new Buffer([`0x${new Date().getHours().toString(16)}`, `0x${new Date().getMinutes().toString(16)}`, `0x${new Date().getSeconds().toString(16)}`, `0x${new Date().getDate().toString(16)}`, `0x${(new Date().getMonth()+1).toString(16)}F`, `0x${new Date().getFullYear().toString(16)[1]}${new Date().getFullYear().toString(16)[2]}`, `0x${new Date().getFullYear().toString(16)[0]}`, 0xFD])} //Time and date
        timeFormat = {id:0x291, data: new Buffer([0x00,0x07,0x00,0x00,0x00,0xF0])}
        channel.send(timeDate)
        // channel.send(timeFormat)
        
        
    }, 1000);
    fivesecCount = setInterval(()=> {
        // channel.send(obc)
        // channel.send(obc2)
        // channel.send(obc3)
        // channel.send(obc6)

        // channel.send(obc4)
        // channel.send(obc5)
    },5000);


    if(busModule.toLocaleLowerCase() == "multifunctionsteeringwheel"){
    //      console.log('[IbusReader]', 'Id:      ', data.id);
    // console.log('[IbusReader]', 'From:    ', IbusDevices.getDeviceName(data.src));
    // console.log('[IbusReader]', 'To:      ', IbusDevices.getDeviceName(data.dst));
    // console.log('[IbusReader]', 'Message: ', data.msg.toString('ascii'), data.msg, '\n');
        // console.log(data.msg[1])
        let buttonPress = data.msg[1];
        const VOL_DOWN = 16;
        const VOL_UP = 17;
        const SKIP_FORWARD = 33;
        const SKIP_BACKWARD = 40;
        const VOICE = 128;

        //Pause set to R/T button
        // if(IbusDevices.getDeviceName(data.dst) == "Telephone - c8" && data.msg[0] == 1){
        //     // console.log("pause")
        //     pauseCount +=1;
        //     if(pauseCount>3){
        //         channel.send(pauseButton)
        //         console.log("Pausing now")
        //     }
        //     // 
        //     // channel.send(pauseButton)
        // }
        if(data.msg[1]== 16){
            channel.send(volumeDown);
            // setInterval(()=> {
                
            //     console.log("Down");
            // }, 100);
        }
        if(data.msg[1]== 17){
            // volumeUpTimer= setInterval(()=> {
                channel.send(volumeUp)
            // }, 100);
        }
        if(data.msg[1]==33){

            channel.send(rightSteeringButton)
        }
        if(data.msg[1]==8){

            channel.send(leftSteeringButton)
        }
        if(data.msg[1]==160){
            channel.send(voiceButton)
        }
    }
    if(busModule.toLocaleLowerCase() == "immobiliser"){
        // console.log(data.msg)
        if(data.msg[1]== 4 && data.msg[2]== 5){
            console.log("Key inserted, ignition off")
            // if (Date.now() - timeout > 100 ){
                // clearInterval(hundredMilliCount);
                clearInterval(nbtvolcount);
                clearInterval(fivesecCount);
                clearInterval(t);
                channel.send(nbtOff);
                channel.send(nbtOff);
                channel.send(nbtOff);
                channel.send(nbtOff);
                channel.send(nbtOff);

                if (canGoSleep){
                    shutDownPi()
                }
                //Shutdown PI
                // shutDownPi();
                //DO NOT ENABLE CRASHES NBT
                channel.send({id: 0x202, data: new Buffer([0xfe, 0xFF])})
                // t= setInterval(()=> {
                //     channel.send({id: 0x202, data: new Buffer([0x254, 0xFF])})
                    // channel.send(avg)
                // console.log("ONNN")
            // }, 100);

                // channel.send(lowercase);        
                
                // timeout = Date.now();
                execSync('sudo /sbin/ip link set can1 down');
            // }
        }
        if(data.msg[1]== 5 && data.msg[2]== 5){

                console.log("Ignition On")
                execSync('sudo /sbin/ip link set can1 up type can bitrate 500000');

                clearInterval(t);
                t= setInterval(()=> {
                    channel.send(nbtOn);
                    //DO NOT ENABLE CRASHES NBT
                    channel.send({id: 0x202, data: new Buffer([0x254, 0xFF])})
                    // channel.send({id:0x6f1, data: new Buffer([[ 0x63, 0x10, 0x0B, 0x31, 0x01, 0xA0, 0x1C, 0x00 ]])})
                    // channel.send(avg)
                // console.log("ONNN")
            }, 100);
            canGoSleep = true;
        }
        
        // CONVERT TO HEX?????
        // 
    }//LightControlModule
    
}

// main start
ibusInterface.startup();
