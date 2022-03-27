const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/signup.html");
});



app.post("/", (req,res)=>{

	const firstName = req.body.fName;
	const surname = req.body.sName;
	const email = req.body.email;


	const data={
		members: [
			{
				email_address: email,
				status: "subscribed",
				merge_fields:{
					FNAME: firstName,
					LNAME: surname
				}
			}
		]
	}
	const jsonData= JSON.stringify(data);

	const url = "https://us14.api.mailchimp.com/3.0/lists/eaff0af505";
	const options={
		method: "POST",
		auth: "sude1:912501480956ef48384516d82606d287-us14"
	}

	const request= https.request(url, options,(response)=>{
		if(response.statusCode===200){
			res.sendFile(__dirname + "/success.html");
		}
		else{
			res.sendFile(__dirname + "/failure.html");
		}
		response.on("data", (data)=>{
			console.log(JSON.parse(data));
		})

	})
	request.write(jsonData);
	request.end();

})


app.post("/failure.html",(req,res)=>{
	res.redirect("/")
})

app.listen(process.env.PORT || 3000, () => {
	console.log("Server is running on port 3000.");
})
