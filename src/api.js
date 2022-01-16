const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");
const moment = require("moment");
const prettyjson = require('prettyjson');

dotenv.config({ path: path.join(__dirname, "../config/config.env") });

exports.getAccessToken = async () => {
  const blobText = process.env.CONSUMER_KEY + ":" + process.env.CONSUMER_SECRET;
  const auth = new Buffer.from(blobText).toString("base64");

  console.log(auth);

  try {
    const res = await axios.get(process.env.TOKEN_URL, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    return res.data.access_token;
  } catch (err) {
    console.log(err.response.data);
  }
};

exports.lipaOnline = async (authToken) => {
  const timestamp = moment().format("YYYYMMDDHHmmss");
  console.log(process.env.shortcode);
  const blobText = new Buffer.from(
    process.env.shortcode + process.env.passkey + timestamp
  );
  const Password = blobText.toString("base64");
  console.log(Password);

  try {
    const res = await axios.post(
      process.env.ONLINE_PROCESS_URL,
      {
        BusinessShortCode: process.env.shortcode,
        Password: Password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: 1,
        PartyA: 254746613059,
        PhoneNumber: 254746613059,
        PartyB: 174379,
        PhoneNumber: 254746613059,
        // CallBackURL: "https://usawagenda.herokuapp.com/callback",
        // CallBackURL: "https://okoa-net.herokuapp.com/callback",
        CallBackURL: "https://freedomapk.herokuapp.com/callback",
        AccountReference: "Freecom Wifi",
        TransactionDesc: "service payment",
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    console.log(res.data);
  } catch (err) {
    console.log(err.response.data);
  }
};

exports.callback =  (req, res) => {
  console.log('-----------Received M-Pesa webhook-----------');
 
  console.log(prettyjson.render(req.body));
  console.log('-----------------------');

  let message = {
	  "ResponseCode": "00000000",
	  "ResponseDesc": "success"
  };
  
  res.status(200).json(message)

}

exports.customerToBs = async (authToken) => {
  try {
    const res = await axios.post(
      process.env.REGISTER_URL,
      {
        ValidationURL: "https://usawagenda.herokuapp.com/validation",
        ConfirmationURL: "https://usawagenda.herokuapp.com/confirmation",
        ResponseType: "Cancelled",
        ShortCode: process.env.reg_shortcode,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    console.log(res.data);
  } catch (err) {
    console.log(err.response.data);
  }
};

exports.simulateC2B = async (authToken) => {
  try {
    const res = await axios.post(
      process.env.C2B_URL,
      {
        CommandID: "CustomerBuyGoodsOnline",
        Amount: 1,
        Msisdn: 254746613059,
        ShortCode: process.env.reg_shortcode,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    console.log(res.data);
  } catch (err) {
    console.log('Failure happend!')

    console.log(err.response.data);
  }
};
