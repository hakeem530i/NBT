var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var lcmRouter = require('./routes/lcm');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/lcm', lcmRouter);

// Require the packages you want to use.

var IbusInterface = require('ibus').IbusInterface;
var IbusDevices = require('ibus').IbusDevices;
// Configure your device location

// config
var device = '/dev/ttyUSB0';

// setup interface
var ibusInterface = new IbusInterface(device);

function init() {
    ibusInterface.startup();
}

// main start
init();
// Add an event listener on the ibus interface output stream.

// events
ibusInterface.on('data', onIbusData);

function onIbusData(data) {
    //Get name of module
    let busModule = IbusDevices.getDeviceName(data.src).substr(0,IbusDevices.getDeviceName(data.src).indexOf(' '));
    // console.log('[IbusReader]', 'Id: 	  ', data.id);
    // console.log('[IbusReader]', 'From: 	  ', IbusDevices.getDeviceName(data.src));
    // console.log('[IbusReader]', 'To: 	  ', IbusDevices.getDeviceName(data.dst));
    // console.log('[IbusReader]', 'Message: ', data.msg, '\n');
    // console.log("SENT FROM: ", busModule);
    if(busModule.toLocaleLowerCase() == "immobiliser"){
        // console.log(data.msg)
        // if(data.msg[1]== 4 && data.msg[2]== 5){
        //     console.log("Key inserted, ignition off")
        // }
        // if(data.msg[1]== 5 && data.msg[2]== 5){
        //     console.log("Ignition On")
        // }
        //CONVERT TO HEX?????
        // if(data.msg[1]== 0 && data.msg[2]== ff){
        //     console.log("Key removed")
        // }
    }//LightControlModule
    if(busModule.toLocaleLowerCase() == "lightcontrolmodule"){
        console.log(data.msg)
    }
}
// ON
//<Buffer 5b 01 00 00 00 00>
//<Buffer 5c ee 00>

//Off
//<Buffer 5b 00 00 00 00 00>
{/* <Buffer 5c ff 00> */}
for (var i = 0; i < 2; i++) {
    ibusInterface.sendMessage({
        src: 0x3f,
        dst: 0xbf,
        // msg: Buffer.concat([new Buffer([0x5b, 0x01, 0x00, 0x00, 0x00, 0x00])])
        msg: Buffer.concat([new Buffer([0x5b, 0x01, 0x00, 0x00, 0x00, 0x00])])
    });
    ibusInterface.sendMessage({
        src: 0x3f,
        dst: 0xbf,
        msg: Buffer.concat([new Buffer([0x5c, 0xee, 0x00])])
    });
}

// Cleanup and close the device when exiting.

// implementation
process.on('SIGINT', onSignalInt);

function onSignalInt() {
    ibusInterface.shutdown(function() {
        process.exit();
    });
}



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
