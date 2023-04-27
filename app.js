const express = require('express');
const bodyParser = require('body-parser');
const path=require('path');
const authroute=require('./router/authrouter');
const propertyroute=require('./router/propertyrout');


const app = express();
const port=process.env.Port ||3000;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// app.use(authroute);


app.set('view engine','ejs');
app.use(express.json());

app.use(authroute);
app.use(propertyroute);
//app.use(bodyParser)



const static_path=path.join(__dirname,"../","public");
app.use(express.static(static_path));

app.all('/*', function (req, res) {
  res.send('no route found');
});




app.listen(port, () => {
  //console.log(process.env);
  console.log(`Server listening on port ${port}`);
});