// apps/backend/lib/logger.js
var winston = require("winston");
var expressWinston = require("express-winston");

/*
 *  Setup logging for the application
 *  returns a logging instance
 */

var transport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
});

var api = (module.exports = function init(app) {
  if (app) {
    app.use(
      expressWinston.errorLogger({
        transports: [transport],
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.json()
        ),
      })
    );

    app.use(
      expressWinston.logger({
        transports: [transport],
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
        meta: false,
        msg: "HTTP {{req.method}} {{req.url}}",
        expressFormat: true,
        colorize: true,
      })
    );
  }

  var logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
    transports: [transport],
  });

  return logger;
});
