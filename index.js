const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4200;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());

const { DB_USER, DB_PASS, DB_NAME } = process.env;

const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.iohsv.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send("Backend Server is Running!!");
});

client.connect((err) => {
  const serviceCollection = client.db("goClean").collection("services");
  const testimonialCollection = client.db("goClean").collection("testimonials");
  const orderCollection = client.db("goClean").collection("orders");
  const adminCollection = client.db("goClean").collection("admin");

  app.post("/addService", (req, res) => {
    const reqBody = req.body;
    console.log(reqBody);
    serviceCollection.insertOne(reqBody).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addTestimonial", (req, res) => {
    const reqBody = req.body;
    console.log(reqBody);
    testimonialCollection.insertOne(reqBody).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addOrder", (req, res) => {
    const reqBody = req.body;
    console.log(reqBody);
    orderCollection.insertOne(reqBody).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addAdmin", (req, res) => {
    const reqBody = req.body;
    console.log(reqBody);
    adminCollection.insertOne(reqBody).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/allService", (req, res) => {
    serviceCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });

    app.get("/orders", (req, res) => {
      adminCollection.find({email: req.query.email})
      .toArray((err, admin) => {
        if(admin.length === 0){
          orderCollection.find({email: req.query.email})
          .toArray((err, documents) => {
          res.send(documents);
          });
        }else{
          orderCollection.find({})
          .toArray((err, documents) => {
            res.send(documents);
          })
        }
      })  
    });

    app.get("/allTestimonial", (req, res) => {
      testimonialCollection.find({}).toArray((err, documents) => {
        res.send(documents);
      });
    });

    app.get("/adminCheck", (req, res) => {
      adminCollection.find({email: req.query.email})
      .toArray((err, documents) => {
        res.send(documents);
      });
    });

    app.delete('/deleteService/:id', (req,res) => {
      serviceCollection.findOneAndDelete({_id: ObjectId(req.params.id)})
      .then(result => {
        res.send(!!result.ok > 0 );
      })
    });

    console.log("Database Connected:", client.isConnected());
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
