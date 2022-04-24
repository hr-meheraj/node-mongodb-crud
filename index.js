const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ObjectId,ServerApiVersion } = require('mongodb');
const port = 3000;
const uri = "mongodb+srv://hrmeheraj:hrmeheraj2007@cluster0.cv5my.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// middleware 
app.use(express.json());
app.use(cors());


// mongodb 
const run = async () => {
	try{
		await client.connect();
		const noteCollections = client.db("data").collection("notes");
		// get all data from db
		app.get('/notes', async (req,res) => {
			const query = req.query
			if(req.query.userName){
					req.query.userName = req.query.userName.toLowerCase();
			}
			const allNotes = await noteCollections.find(query).toArray();
			res.send(allNotes);
		});

		// Posting userName with Notes
		app.post('/note', async (req,res) => {
			const body = req.body;
			body.userName = body.userName.toLowerCase();
			if(req.body){
			const pushingNote = await noteCollections.insertOne(body);
			res.send(pushingNote);
			}
		});


		// put or Updating a document, if doesn't have any note 			then it will adding to the database. or if you have any 			note then update it. 
		app.put('/notes/:id', async (req,res) => {
			const id = req.params.id;
			const query = { _id : new ObjectId(id)};
			const options = { upsert: true };
			const updateNote = {
				$set : {
					...req.body
				}
			}
			const result = await noteCollections.updateOne(query, updateNote, options);
			res.send(result);
			console.log('Successfully Note Updated ');
		})


		
		// Deleting Notes with using id 
		app.delete('/notes/:id', async (req,res) => {
			const id = req.params.id;
			const query = { _id : new ObjectId(id) }
			const result = await noteCollections.deleteOne(query);
			if(result.deletedCount == 1){
				console.log('successfull One note Deleted ', id);
			}else{
				console.log('There are not matced note id ', id);
			}
			res.send(result);
		});
		
	}finally{
		
	}
}

run().catch(console.dir)


app.get('/', (req,res) => {
	res.send("Hello There");
})

app.listen(port, () => console.log('server listening on the port 3000'))


// Alhamdulillah Cruid is complete... 