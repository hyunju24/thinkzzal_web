var express = require('express');
var app = express();
var client_id = 'R7kRP4j3oUeBNn3gLIQl';
var client_secret = 'JmcJMfp7mJ';
var fs = require('fs');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/face', function (req, res) {
   var request = require('request');
   //var api_url = 'https://openapi.naver.com/v1/vision/celebrity'; // 유명인 인식
   var api_url = 'https://openapi.naver.com/v1/vision/face'; // 얼굴 감지

   var _formData = {
     image:'image',
     image: fs.createReadStream(__dirname + "/goja.jfif") // FILE 이름
   };
   //var writeStream = fs.createWriteStream('./naver.json');
    var _req = request.post({url:api_url, formData:_formData,
      headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}},
      function optionalCallback(err, httpResponse, body) {
          if (httpResponse.statusCode == 200) {
              var dataStr = JSON.parse(body);
              if(dataStr.info.faceCount == 0) {
                  emo = null;
                  confidence = null;
              } else {
                  //emo : 표정값, confidence : 퍼센트로 변경.
                  emo = dataStr.faces[0].emotion.value;
                  confidence = 100*Number(dataStr.faces[0].emotion.confidence);

              }
              // result.ejs(view를 위한 부분)에 feel, confidence 변수로 전달.
              res.render('./result', { feel : emo, confidence: confidence });
          }
      });
 });

 app.listen(3000, function () {
   console.log('http://127.0.0.1:3000/face app listening on port 3000!');
 });