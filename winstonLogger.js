const {createLogger, format, transports} = require("winston")
const { combine, timestamp, label, printf } = format

const jsonFormat = printf( info => {
  let dataObj = {
    firstName : info.first_name,
    lastName : info.last_name,
    phone_number : info.phone_number,
    email : info.email,
    time: info.timestamp,
  }
  return `{ "time": "${info.timestamp}", "app": "${info.label}", "data": {"firstName": "${info.first_name}","lastName": "${info.last_name}","phone_number": "${info.phone_number}","email": "${info.email}"}},`
})

const csvFormat = printf( info => {
  return `${info.message},${info.timestamp}`
})

const logger = createLogger({
  level:'info',
  format: combine(
    label({label:"ReportMilla"}),
    timestamp(),
    jsonFormat
  ),

transports: [
  new transports.Console(),
  new transports.File({
    filename: "./prospect.log",
    level: "info"
  }),
  new transports.File({
    filename: "./prospect.json",
    level: "info"
  }),
]
});

const csvLogger = createLogger({
  level: "info",
  format: combine(
    timestamp(),
    csvFormat
  ),
  transports: [new transports.File({
    filename: "./prospect.csv",
    level: "info"
  })]
})


function log(data){
  logger.info("", data)
  csvLogger.info(makeCSVFromData(data))
}

function makeCSVFromData(data){
  return `${data.first_name},${data.last_name},${data.email},${data.phone_number}`
}


module.exports = log