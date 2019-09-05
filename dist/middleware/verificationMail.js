'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendVerificationMail = undefined;

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _ENV = require('./ENV.json');

var _ENV2 = _interopRequireDefault(_ENV);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sendVerificationMail = exports.sendVerificationMail = function sendVerificationMail(userEmail) {

  var transporter = _nodemailer2.default.createTransport({
    service: _ENV2.default.emailServiceProvider,
    auth: {
      user: _ENV2.default.emailUserName,
      pass: _ENV2.default.emailUserPassword
    }
  });

  var mailOptions = {
    from: _ENV2.default.emailUserName,
    to: userEmail,
    subject: 'Voters Registration Successful',
    text: 'Please visit an the nearest INEC office in 2 weeks time to pick up your card'
  };

  transporter.sendMail(mailOptions, function (e, info) {
    if (e) {
      // return(e);
      console.log(e);
    } else {
      return 'Email sent: ' + info.response;
      // return true;
    }
  });
};
//# sourceMappingURL=verificationMail.js.map