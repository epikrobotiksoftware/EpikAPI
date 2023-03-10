const express = require('express');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const userRouter = require('./routers/userRoutes');
const globalErrorHandler = require('./controllers/errorControler');
const AppError = require('./utils/appError');
const app = express();
app.use(express.json({limit:'52428800'}));
const cors = require('cors');
var bodyParser = require('body-parser');
const rosRouter = require('./routers/rosRouter');
const imageRoute = require('./routers/imageRouter');
var ip = require('ip');
const ipAddress = ip.address();
const mapRouter = require('./routers/mapRouter');
//////////////////

app.get(helmet());
/* 
const localIp = ip.address();
const corsOptions = {
  origin: [
    new RegExp(`^http://${localIp}:\\d+$`)
  ],
  credentials: true,
  optionSuccessStatus: 200,
};
*/
// var jsonParser = bodyParser.json({
//   limit: 1024 * 1024 * 20,
//   type: 'application/json',
// });
// var urlencodedParser = bodyParser.urlencoded({
//   extended: true,
//   limit: 1024 * 1024 * 20,
//   type: 'application/x-www-form-urlencoded',
// });
// app.use(jsonParser);
// app.use(urlencodedParser);
app.use('/api',bodyParser.json({ limit: '20971520', type: 'application/json' }));
app.use('/api',
  bodyParser.urlencoded({
    limit: '20971520',
    extended: true,
    // parameterLimit: 500000000,
  })
);
// console.log('Limit file size: '+limit);

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    `http://${ipAddress}:3000`,
    `http://${ipAddress}:3001`,
    `http://${ipAddress}:3002`,
    `http://${ipAddress}:3003`,
    `http://${ipAddress}:3004`,
    `http://${ipAddress}:3005`,
  ],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// const limiter = rateLimit({
//   max: 100000,
//   windowsMS: 60* 60 * 1000,
//   message: 'request kotaniz acmistir'
// });
// app.use('/api', limiter);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/ros', rosRouter);
app.use('/api/v1/images', imageRoute);
app.use('/api/v1/map', mapRouter);
app.use(express.static('images'));

app.all('*', (req, res, next) => {
  next(new AppError(`${req.originalUrl} bulunmamaktadir`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
