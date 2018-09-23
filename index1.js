var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
var express = require('express');
var bodyParser = require('body-parser');
var app     = express();
var compiler = require('compilex');
var ObjectId = require('mongodb').ObjectID;
app.set('view engine', 'ejs');
//Note that in version 4 of express, express.bodyParser() was
//deprecated in favor of a separate 'body-parser' module.
app.use(bodyParser.urlencoded({ extended: true })); 
var option = {stats : true};
compiler.init(option);


// -----------------------------------Html Files---------------------------------------
//   app.get('/',function(req,res)
//    {
//     res.sendFile(__dirname+'/practice_O.html');        
//     });

app.get('/admin1',function(req,res)
{
res.sendfile(__dirname+'/creating_challenge.html');
});

app.get('/Home' , function (req , res ) {

	res.sendfile( __dirname + "/index_O.html");

});


// // -------------------------Home window---------------------------
app.get('/',function(req,res)
{
  res.sendfile( __dirname + "/home.html");
}
);
// // -------------------------Login window---------------------------
app.get('/login',function(req,res)
{
  res.sendfile( __dirname + "/indexaws.html");

}
);

// // --------------------------Render admin2---------------------------------
app.post('/admin2',function(req,res)
{
    MongoClient.connect(url, function(err, db) 
    {
     if (err) throw err;
    dbo = db.db("mydb");
    t_id="t_"+req.body.qname;
    q_name=req.body.qname;
    q_const=req.body.qconst;
    q_desc=req.body.qdesc;
    sam_inp=req.body.qinp;
    sam_oup=req.body.qoup;
    var myobj1={'q_name':q_name,'q_desc':q_desc,'q_const':q_const,'q_inp':sam_inp,'q_oup':sam_oup,'test_id':t_id};
    dbo.collection("question").insertOne(myobj1, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");     
        db.close();
    });
    q_inp=req.body.inp;
    q_oup=req.body.oup;
    console.log(q_inp.length);
    console.log(q_inp[1]);
    console.log(q_inp[0]);
    var j=1;
  for(var i=q_inp.length-2;i>=0;i--)
  {
    var myobj = {'test_id':t_id,'testcase_no':j,'q_inp':q_inp[i],'q_oup':q_oup[i]};
    dbo.collection("test_cases").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");     
     });
     j=j+1;
    }
    db.close();
    res.send("fine");
    });
});


//-----------------------Register Details-----------------------------
app.get('/reg',function(req,res)
{
    MongoClient.connect(url, function(err, db) 
    {
     if (err) throw err;
    dbo = db.db("mydb");
    name=req.query['name'];
    email=req.query['email'];
    phone=req.query['phone'];
  //  console.log(attr[0]);
    var myobj = {'name':name,'email':email,'phoneno':phone};
    dbo.collection("users").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    
     db.close();
     });    
    });
});


// // -----------------------------Render question_tab----------------------------------

app.get('/ques_tab',function(req,res)
{
    MongoClient.connect(url, function(err, db) 
    {
     if (err) throw err;
    dbo = db.db("mydb");
    name=req.query['name'];
    email=req.query['email'];
    dbo.collection("question").find({},{q_desc:0}).toArray(function(err, result) {
        if (err) throw err;
        // console.log("Successful");
        // console.log(result[1].q_name);
         db.close();
        res.render('pages/question_tabs', {
          result: result,
          name:name,
          email:email
      });
});
});
});


// // -----------------------------Render index_O----------------------------------

app.get('/Index_O',function(req,res)
{
    
MongoClient.connect(url, function(err, db) 
{
     if (err) throw err;
    dbo = db.db("mydb");
    ques_id=ObjectId(req.query['q_id']);
    name=req.query['name'];
    email=req.query['email'];
    t_id=req.query["test_id"];
    console.log(ques_id);
    console.log('visited');
    dbo.collection("question").findOne({_id:ques_id}, function(err, result) {
        if (err) throw err;
       // console.log(result);
        db.close();
      
    
    res.render('pages/index_O', {
        result:result,
          t_id:t_id,
          name:name,
          email:email,
          quest_id:ques_id
    });
});
});
});

// // -----------------------------Render pgms----------------------------------

app.get('/pgms',function(req,res)
{
    
MongoClient.connect(url, function(err, db) 
{
     if (err) throw err;
     obj=req.query['c_name'];
     name=req.query['name'];
    email=req.query['email'];
     //console.log(obj);
     dbo = db.db("mydb");
     dbo.collection(obj).find({}).toArray(function(err, resultx) {
        if (err) throw err;
       // console.log(resultx);
        db.close();
    
     res.render('pages/pgms', {
         resultz:resultx,
         c_name:obj,
         name:name,
         email:email
           
     });
  

});
});
});
// // -----------------------------Render practice----------------------------------

app.get('/practice',function(req,res)
{
    
MongoClient.connect(url, function(err, db) 
{
     if (err) throw err;
    dbo = db.db("mydb");
    obj=req.query['c_name'];
    name=req.query['name'];
    email=req.query['email'];
    ques_id=ObjectId(req.query['q_id']);
    console.log(ques_id);
    console.log('visited');
    dbo.collection(obj).findOne({_id:ques_id}, function(err, result) {
        if (err) throw err;
       // console.log(result);
        db.close();
        res.render("pages/practice_O",
        {
            result:result,
            name:name,
            email:email
        });
    });
});
});

//
app.get('/feedback',function(req,res)
{
MongoClient.connect(url, function(err, db) 
{
     if (err) throw err;
    name=req.query['name'];
    email=req.query['email'];
    feed=req.query['feed'];
    console.log(name+" "+email+" "+feed);
     dbo = db.db("mydb");
    myobj={name:name,email:email,feed_msg:feed}
    dbo.collection("feedback").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted"); 
        db.close();
    });
    res.send('success');  

});
});

// //-------------------------------------css files------------------------------------

app.get('/ques_tab_css',function(req,res)
{
    res.sendFile(__dirname+'/ques_tab_css/style.css');
});

app.get('/admin_view_css',function(req,res)
{
    res.sendFile(__dirname +'/adminview/admin_view.css')
});
app.get('/Indexcss',function(req,res)
{
  res.sendfile( __dirname + "/Index/index.css");

});
app.get('/IndexO_css',function(req,res)
{
  res.sendfile( __dirname + "/Index_O/index_o.css");
});

app.get("/css1",function(req,res)
{
    res.sendFile(__dirname + "/css1/style.css");
});

app.get("/success_css",function(req,res)
{
    res.sendFile(__dirname + "/success_css/style.css");
});


app.get("/feedback_css",function(req,res)
{
    res.sendFile(__dirname + "/feedback_css/style.css");
});
// //-------------------------------------Js files------------------------------------
app.get('/ace' ,function(req,res)
{
    res.sendfile(__dirname+'/src-noconflict/ace.js');
});

app.get('/amazon1' ,function(req,res)
{
  
    res.sendfile(__dirname+'/amazon-cognito/amazon-cognito-userpool_org.js');
});
app.get('/amazon2' ,function(req,res)
{
  
    res.sendfile(__dirname+'/amazon-cognito/amazon-cognito-identity.js');
});
app.get('/amazon3' ,function(req,res)
{
  
    res.sendfile(__dirname+'/amazon-cognito/jquery.min.js');
});
app.get('/amazon4' ,function(req,res)
{
  
    res.sendfile(__dirname+'/amazon-cognito/amazon-session-validity.js');
});

app.get("/js1",function(req,res)
{
    res.sendFile(__dirname + "/js1/index.js");
});
app.get("/feedback_js",function(req,res)
{
    res.sendFile(__dirname + "/feedback_js/index.js");
});
app.get("/success_js",function(req,res)
{
    res.sendFile(__dirname + "/success_js/index.js");
});


// // -----------------------------------Image Files--------------------------------------

app.get('/out',function(req,res)
{
    res.sendfile( __dirname + "/Images/output1.jpg");
});

app.get('/image',function(req,res)
{
    res.sendfile( __dirname + "/Images/img1.jpg");
});

app.get('/challenge_img',function(req,res)
{
    res.sendfile( __dirname + "/Images/challenge.jpg");
});

app.get('/imageq',function(req,res)
{
    res.sendfile( __dirname + "/Images/ques_Tabs1.jpg");
});

/*----------------------------Compilex Started Here---------------------------------------------------*/
app.post('/compil' , function (req , res ) {
    var results=[];
    var resultk={};
MongoClient.connect(url, function(err, db) 
    {
    if (err) throw err;
    dbo = db.db("mydb");
    var code = req.body.code;	
	var input = req.body.input;
    var lang = req.body.lang;
    var ques_id=req.body.ques_id;
    var q_mark=req.body.marks;
    var sam_oup=req.body.op;
    var t_id1=req.body.t_id;
  //  var t_id="t_Sum Of Two Numbers"
    console.log(t_id1);
    var query={"test_id":t_id1};

    dbo.collection("test_cases").find(query).toArray(function(err, test) {
        if (err) throw err;
         console.log("Founded"+test[0].test_id);
             db.close();
          
             for(var i=0;i<test.length;i++)
             {
                input=test[i].q_inp;
                sam_oup=test[i].q_oup;
                test_case_no=test[i].testcase_no;
                
     if((lang === "C") || (lang === "C++"))
      {
                 
            var envData = { OS : "windows" , cmd : "g++"};	   
            compiler.compileCPPWithInput(envData , code ,input ,sam_oup,test_case_no, function (data) {
               
        		if(data.error)
        		{   
                    resultk = {
                        result1:data.error,
                        result:data.oup,
                        test_case:data.t_no,
                        input:data.inp
                        }
                        results.push(resultk);
                        
        		}
        		else
        		{
                    console.log(data.oup+" "+data.output);
                    var data1=data.output;
                    data1=data1.trim();
                    resultk = {
                        result1:data1,
                        result:data.oup,
                        test_case:data.t_no,
                        input:data.inp
                            }
                    results.push(resultk);
                    console.log(results);
                }
           if(results.length==test.length)
           {
            res.render("pages/success_complete",
                    {
                        out:results
                    })
           }
    
                })
    }
    if(lang === "Java")
    {
            var envData = { OS : "windows" };     
            console.log(code);
            compiler.compileJavaWithInput( envData , code ,input,sam_oup,test_case_no, function(data){
                if(data.error)
                {
            var resultk = {
                    result1:data.error,
                    result:data.oup,
                    test_case:data.t_no,
                    input:data.inp
                    }
                    results.push(resultk);
                }        
            else
                {
                    var data1=data.output;
                    data1=data1.trim();
            
                   var resultk = {
                    result1:data1,
                    result:data.oup,
                    test_case:data.t_no,
                    input:data.inp
                    }
                    results.push(resultk);
                
                }
                if(results.length==test.length)
                {
                 res.render("pages/success_complete",
                         {
                             out:results
                         })
                }
                
            });
      
    }
    if( lang === "Python")
    {
            var envData = { OS : "windows"};
            compiler.compilePythonWithInput(envData , code , input ,sam_oup,test_case_no, function(data){
                if(data.error)
                {
                resultk = {
                    result1:data.error,
                                 result:data.oup,
                                 test_case:data.t_no,
                                 input:data.inp
                    }
                    results.push(resultk);
                }
                else
                {
                    var data1=data.output;
                    data1=data1.trim();
                var resultk = {
                    result1:data1,
                    result:data.oup,
                    test_case:data.t_no,
                    input:data.inp
                    }
                    results.push(resultk);
                   
                }
                if(results.length==test.length)
                {
                 res.render("pages/success_complete",
                         {
                             out:results
                         })
                }
            });            
        }         
    }
});
});
});

/*----------------------------Compilex Started Here---------------------------------------------------*/

app.post('/compilecode' , function (req , res ) {
    
    var code = req.body.code;	
	var input = req.body.input;
    var inputRadio = req.body.inputRadio;
    var lang = req.body.lang;
    var sam_oup=req.body.op;
    var test_case_no=1;
    if((lang === "C") || (lang === "C++"))
    {        
        if(inputRadio === "true")
        {    
        	var envData = { OS : "windows" , cmd : "g++"};	   	
        	compiler.compileCPPWithInput(envData , code ,input ,sam_oup,test_case_no, function (data) {
        		if(data.error)
        		{
        			res.render("pages/success_index",
                    {
                     result1:data.error,
                     result:sam_oup,
                     });
        		}
        		else
        		{
                    var data1=data.output;
                    data1=data1.trim();
        			res.render("pages/success_index",
                    {
                     result1:data1,
                     result:sam_oup,
                     
                     });
        		}
        	});
	   }
	   else
	   {
	   	
	   	var envData = { OS : "windows" , cmd : "g++"};	   
        	compiler.compileCPP(envData , code ,sam_oup, function (data) {
        	if(data.error)
        	{
        		res.render("pages/success_index",
                    {
                     result1:data.error,
                     result:sam_oup
                     });
        	}    	
        	else
        	{
                var data1=data.output;
                data1=data1.trim();
        		res.render("pages/success_index",
                    {
                     result1:data1,
                     result:sam_oup
                    });
        	}
    
            });
	   }
    }
    if(lang === "Java")
    {
        if(inputRadio === "true")
        {
            var envData = { OS : "windows" };     
            console.log(code);
            compiler.compileJavaWithInput( envData , code ,input,sam_oup,test_case_no, function(data){
                if(data.error)
                {
                res.render("pages/success_index",
                {
                 result1:data.error,
                 result:sam_oup

                });
                }
                else
                {
                    var data1=data.output;
                    data1=data1.trim();
                  //  var data2=sam_oup+'\n';
                    //console.log(data2);
                    console.log(data1);
                    
                    //console.log(data1[data1.length-1].charCodeAt(0)+"hai ");
                    // if(data1[data1.length-1].charCodeAt(0)==10)
                    // {
                    //     data1=data1.substring(0, data1.length - 1);
                    // }
                    // console.log(sam_oup+" "+typeof sam_oup);
                    // console.log(data1);
                    // console.log(data1[data1.length-1].charCodeAt(0)+"hai ");
                res.render("pages/success_index",
                {
                 result1:data1,
                 result:sam_oup,
                // resultx:data2
                });
                }


            });
        }
        else
        {
            var envData = { OS : "windows" };     
            console.log(code);
            compiler.compileJava( envData , code , sam_oup,  function(data){
                if(data.error)
                {
                res.render("pages/success_index",
                {
                 result1:data.error,
                 result:sam_oup
                });
                }
                else
                {
                    var data1=data.output;
                    data1=data1.trim();
                res.render("pages/success_index",
                {
                 result1:data1,
                 result:sam_oup
                });
                }
            });

        }

    }
    if( lang === "Python")
    {
        if(inputRadio === "true")
        {
            var envData = { OS : "windows"};
            compiler.compilePythonWithInput(envData , code , input,sam_oup,test_case_no, function(data){
                if(data.error)
                {
                res.render("pages/success_index",
                {
                 result1:data.error,
                 result:sam_oup
                });
                }
                else
                {
                var data1=data.output;
                data1=data1.trim();
                res.render("pages/success_index",
                {
                 result1:data1,
                 result:sam_oup
                });
                }
            });            
        }
        else
        {
            var envData = { OS : "windows"};
            compiler.compilePython(envData , code ,sam_oup, function(data){
                if(data.error)
                {
                res.render("pages/success_index",
                {
                 result1:data.error,
                 result:sam_oup
                });
                }
                else
                {
                    var data1=data.output;
                    data1=data1.trim();
                res.render("pages/success_index",
                {
                 result1:data1,
                 result:sam_oup
                });
                }
            });
        }
    }
    // if( lang === "CS")
    // {
    //     if(inputRadio === "true")
    //     {
    //         var envData = { OS : "windows"};
    //         compiler.compileCSWithInput(envData , code , input,sam_oup,test_case_no, function(data){
    //             if(data.error)
    //             {
    //             res.render("pages/success_index",
    //             {
    //              result1:data.error,
    //              result:sam_oup
    //             });
    //             }
    //             else
    //             {
    //             res.render("pages/success_index",
    //             {
    //              result1:data.output,
    //              result:sam_oup
    //             });
    //             }
    //         });            
    //     }
    //     else
    //     {
    //         var envData = { OS : "windows"};
    //         compiler.compileCS(envData , code ,sam_oup,test_case_no, function(data){
    //             if(data.error)
    //             {
    //             res.render("pages/success_index",
    //             {
    //              result1:data.error,
    //              result:sam_oup
    //             });
    //             }
    //             else
    //             {
    //             res.render("pages/success_index",
    //             {
    //              result1:data.output,
    //              result:sam_oup
    //             });
    //             }
    //         });
    //     }

    // }
    // if( lang === "VB")
    // {
    //     if(inputRadio === "true")
    //     {
    //         var envData = { OS : "windows"};
    //         compiler.compileVBWithInput(envData , code ,input,sam_oup,test_case_no, function(data){
    //             if(data.error)
    //             {
    //             res.render("pages/success_index",
    //             {
    //              result1:data.error,
    //              result:sam_oup
    //             });
    //             }
    //             else
    //             {
    //             res.render("pages/success_index",
    //             {
    //              result1:data.output,
    //              result:sam_oup
    //             });
    //             }
    //         });            
    //     }
    //     else
    //     {
    //         var envData = { OS : "windows"};
    //         compiler.compileVB(envData , code , function(data){
    //             if(data.error)
    //             {
    //             res.render("pages/success_index",
    //             {
    //              result1:data.error,
    //              result:sam_oup
    //             });
    //             }
    //             else
    //             {
    //             res.render("pages/success_index",
    //             {
    //              result1:data.output,
    //              result:sam_oup
    //             });
    //             }
    //         });
    //     }

    // }
});


app.get('/fullStat' , function(req , res ){
    compiler.fullStat(function(data){
        res.send(data);
    });
});

/*----------------------------------------------------------------------------------------*/


app.listen('8000');
app.listen(8080, function() {
  console.log('Server running at http://127.0.0.1:8080/');
});

MongoClient.connect(url, function(err, db) 
 {
      if (err) throw err;
app.get('/serv',function(req,res)
{
  var q_name=req.body.qname;
  var q_desc=req.body.desc ;
  var q_const=req.body.qconst;
  var q_inp=req.body.qinp;
  var q_oup=req.body.qoup;
  dbo = db.db("mydb");

});

});
