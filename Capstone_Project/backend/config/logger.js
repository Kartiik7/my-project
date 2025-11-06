const winston = require('winston');

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3, // For HTTP requests
  debug: 4,
};

// Set level based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'warn';
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};
winston.addColors(colors);

// Define the format for console logging (pretty, colorized)
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}`
  )
);

// Define transports (where logs go)
const transports = [
  // Always log to the console
  new winston.transports.Console({
    format: consoleFormat,
  }),
  // In production, also log errors to a file
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: winston.format.json(),
  }),
  // In production, log all http requests to a file
  new winston.transports.File({
    filename: 'logs/all.log',
    level: 'http',
    format: winston.format.json(),
  }),
];

const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
});

module.exports = logger;
