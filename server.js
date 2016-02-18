var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var http = require('http');
var server = http.createServer(app);

//注册ejs模板为html页。简单的讲，就是原来以.ejs为后缀的模板页，现在的后缀名可以//是.html了
app.engine('.html', require('ejs').__express);

//设置视图模板的默认后缀名为.html,避免了每次res.Render("xx.html")的尴尬
app.set('view engine', 'html');

//设置模板文件文件夹,__dirname为全局变量,表示网站根目录
app.set('views', __dirname + '/views');

app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/public'));
app.use(require('cookie-parser')('session_secret'));

app.post('/urlencoded', function (req, res) {
  console.log(req.body);
  //res.send(req.body);
  res.render('login', {
    name: req.body.name,
    password: req.body.password
  })
});

app.get('/', function(req, res){
    res.render('login', {
        name: "emac",
        password: "654321"
    });
});

var cookies;
app.post('/login', function (req1, res1) {
    var argus = req1.body;
    //console.log(argus);
    //发送post请求获取进行登陆
    var opt = {
         host:'bi.aihaisi.com',
         port:'80',
         method:'POST',
         path:'/vizportal/api/web/v1/login',
         headers:{
            'Content-Type': 'application/json'
         }
    }

    //var cookies;
    var req = http.request(opt, function(res) {
        res.on('data',function(d){

        }).on('end', function(){
            cookies = res.headers['set-cookie'];
            res1.send('ok');
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    })
    req.write(JSON.stringify(argus));
    req.end();

    //console.log(cookies[0]);
    //console.log(cookies[1]);
});

app.get('/set_cookie', function(req, res) {
    var workgroup_session_id = cookies[0].split(';')[0].split('=')[1];
    var XSRF_TOKEN = cookies[1].split(';')[0].split('=')[1];
    console.log(workgroup_session_id);
    console.log(XSRF_TOKEN);
    res.cookie('workgroup_session_id', workgroup_session_id, {httpOnly:true, path:'/'});
    res.cookie('XSRF-TOKEN', workgroup_session_id, {path:'/'});
    res.cookie('islogin', 'true', {path:'/'});
    res.render('set_cookie');
})

var PORT = 8000;
server.listen(PORT);
