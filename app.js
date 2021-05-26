const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.connect("mongodb://localhost:27017/wchDB", {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

// -----------------------------------------DATABASE SCHEMAS---------------------------------------------------
const cartSchema = new mongoose.Schema({
  imgSrc: String,
  product: String,
  price: String,
  qty: String
});

const ordersSchema = new mongoose.Schema({
  date: String,
  order: cartSchema
});

const personSchema = new mongoose.Schema({
  name: String,
  contact: Number,
  address: String,
  email: String,
  password: String,
  cart: cartSchema,
  orders: ordersSchema
});

const dealershipSchema = new mongoose.Schema({
  name: String,
  email: String,
  location: String,
  scope: String
});

const bulkOrderSchema = new mongoose.Schema({
  name: String,
  email: String,
  location: String,
  qty: String
});

const coffeeSchema = new mongoose.Schema({
  imgSrc: String,
  name: String,
  price: String
});

const beanSchema = new mongoose.Schema({
  imgSrc: String,
  name: String,
  price: String
});

// -----------------------------------------DATABASE COLLECTIONS---------------------------------------------------
const Person = mongoose.model("Person", personSchema);

const Coffee = mongoose.model("Coffee", coffeeSchema);

const Bean = mongoose.model("Bean", beanSchema);

const Dealership = mongoose.model("Dealership", dealershipSchema);

const BulkOrder = mongoose.model("BulkOrder", bulkOrderSchema);

// -----------------------------------------MAIN CODE---------------------------------------------------
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/logout", (req, res) => {
  res.redirect("/");
;})

app.get("/:page", (req, res) => {

  if (req.params.page === "coffee" || req.params.page === "coffee-logged-in") {
    Coffee.find((err, coffees) => {
      if (err) {
        console.log(err);
      } else {
        res.render(req.params.page, {coffees: coffees});
      }
    });

  } else if (req.params.page === "beans" || req.params.page === "beans-logged-in") {
    Bean.find((err, beans) => {
      if (err) {
        console.log(err);
      } else {
        res.render(req.params.page, {beans: beans});
      }
    });

  } else if (req.params.page === "login") {
    res.render("login", {name: "", contact: "", address: "", email: "", password: "", errMsg: "", loginEmail: "", loginPassword: "", loginErrMsg: ""});

  } else if (req.params.page === "db") {
    res.redirect("/admin");

  }
  else {
    res.render(req.params.page);
  }

});

app.post("/signup", (req, res) => {

  Person.find({email: req.body.email}, (err, foundEmail) => {
    if (err) {
      console.log(err);
    } else {
      if (foundEmail.length === 1) {
        res.render("login", {name: req.body.name, contact: req.body.contact, address: req.body.address, email: req.body.email, password: req.body.password, errMsg: "Email already exists", loginEmail: "", loginPassword: "", loginErrMsg: ""});
        console.log("Account already exists.");
      } else {
        const newPerson = new Person({
          name: req.body.name,
          contact: req.body.contact,
          address: req.body.address,
          email: req.body.email,
          password: req.body.password,
          cart: {
            imgSrc: req.body.imgSrc,
            product: req.body.product,
            price: req.body.price,
            qty: req.body.qty
          },
          orders: {
            date: req.body.date,
            order: {
              imgSrc: req.body.imgSrc,
              product: req.body.product,
              price: req.body.price,
              qty: req.body.qty
            }
          }
        });
        newPerson.save();
        console.log("New signup confirmed (" + req.body.name + ")");
        res.redirect("/home-logged-in");
      }
    }
  });

});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  Person.find({email: email}, (err, foundEmail) => {
    if (err) {
      console.log(err);
    } else {
      if (foundEmail.length != 0) {
        if (foundEmail[0].password === password) {
          res.redirect("/home-logged-in");
          console.log("Successfully logged in " + email);
        } else{
          res.render("login", {name: "", contact: "", address: "", email: "", password: "", errMsg: "", loginEmail: req.body.email, loginPassword: req.body.password, loginErrMsg: "Invalid credentials"});
          console.log("Wrong password " + password);
        }
      } else {
        res.render("login", {name: "", contact: "", address: "", email: "", password: "", errMsg: "", loginEmail: req.body.email, loginPassword: req.body.password, loginErrMsg: "Invalid credentials"});
        console.log("Account doesn't exist");
      }
    }
  });
});

app.post("/admin", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email === "admin@wch.com" && password === "wch123") {
    res.render("db", {coffeeToUpdate: "", cimgSrc: "", cname: "", cprice: "", bimgSrc: "", bname: "", bprice: "", beansToUpdate: ""});
  } else {
    res.redirect("/admin");
  }
});

app.post("/coffeesDB", (req, res) => {
  console.log("Operation: " + req.body.operation);
  if (req.body.operation === "addCoffee") {
    const newCoffee = new Coffee ({
      imgSrc: req.body.cimgSrc,
      name: req.body.cname,
      price: req.body.cprice
    });

    newCoffee.save();
    console.log("New coffee inserted (" + req.body.cname + ")");
    res.render("db", {coffeeToUpdate: "", cimgSrc: "", cname: "", cprice: "", bimgSrc: "", bname: "", bprice: "", beansToUpdate: ""});
  }
  else if (req.body.operation === "updateCoffee") {
    if (req.body.cimgSrc === "" && req.body.cname === "" && req.body.cprice === "") {
      Coffee.findOne({name: req.body.coffeeToUpdate}, (err, foundCoffee) => {
        if (err) {
          console.log(err);
        } else if (foundCoffee) {
          res.render("db", {
            coffeeToUpdate: foundCoffee.name,
            cimgSrc: foundCoffee.imgSrc,
            cname: foundCoffee.name,
            cprice: foundCoffee.price,
            beansToUpdate: "",
            bimgSrc: "",
            bname: "",
            bprice: ""
          });
          console.log("Data rendered succesfully.");
        }
      });
    } else {
      Coffee.updateOne({name: req.body.coffeeToUpdate}, {
        imgSrc: req.body.cimgSrc,
        name: req.body.cname,
        price: req.body.cprice
      }, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated successfully (" + req.body.coffeeToUpdate + ")");
          res.render("db", {coffeeToUpdate: "", cimgSrc: "", cname: "", cprice: "", bimgSrc: "", bname: "", bprice: "", beansToUpdate: ""});
        }
      });
    }
  }
  else if (req.body.operation === "deleteCoffee") {
    Coffee.deleteMany({name: req.body.cname}, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted coffee (" + req.body.cname + ")");
        res.render("db", {coffeeToUpdate: "", cimgSrc: "", cname: "", cprice: "", bimgSrc: "", bname: "", bprice: "", beansToUpdate: ""});
      }
    });
  }
});

app.post("/beansDB", (req, res) => {
  console.log(req.body.operation);
  if (req.body.operation === "addBeans") {
    const newBeans = new Bean ({
      imgSrc: req.body.bimgSrc,
      name: req.body.bname,
      price: req.body.bprice
    });

    newBeans.save();
    console.log("New beans inserted (" + req.body.bname + ")");
    res.render("db", {coffeeToUpdate: "", cimgSrc: "", cname: "", cprice: "", bimgSrc: "", bname: "", bprice: "", beansToUpdate: ""});
  }
  else if (req.body.operation === "updateBeans") {
    if (req.body.bimgSrc === "" && req.body.bname === "" && req.body.bprice === "") {
      Bean.findOne({name: req.body.beansToUpdate}, (err, foundBeans) => {
        if (err) {
          console.log(err);
        } else if (foundBeans) {
          res.render("db", {
            beansToUpdate: foundBeans.name,
            bimgSrc: foundBeans.imgSrc,
            bname: foundBeans.name,
            bprice: foundBeans.price,
            coffeeToUpdate: "",
            cimgSrc: "",
            cname: "",
            cprice: "",
          });
          console.log("Data rendered succesfully.");
        }
      });
    } else {
      Bean.updateOne({name: req.body.beansToUpdate}, {
        imgSrc: req.body.bimgSrc,
        name: req.body.bname,
        price: req.body.bprice
      }, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated successfully (" + req.body.beansToUpdate + ")");
          res.render("db", {coffeeToUpdate: "", cimgSrc: "", cname: "", cprice: "", bimgSrc: "", bname: "", bprice: "", beansToUpdate: ""});
        }
      });
    }
  }
  else if (req.body.operation === "deleteBeans") {
    Bean.deleteMany({name: req.body.bname}, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted beans (" + req.body.bname + ")");
        res.render("db", {coffeeToUpdate: "", cimgSrc: "", cname: "", cprice: "", bimgSrc: "", bname: "", bprice: "", beansToUpdate: ""});
      }
    });
  }
});

app.post("/dealership", (req, res) => {
  const newDeal = new Dealership({
    name: req.body.name,
    email: req.body.email,
    location: req.body.location,
    scope: req.body.scope
  });

  newDeal.save();
  console.log("New dealership request submitted.");
  res.render("contact-confirmation");
});

app.post("/bulk-ordering", (req, res) => {
  const newBulkOrder = new BulkOrder ({
    name: req.body.name,
    email: req.body.email,
    location: req.body.location,
    qty: req.body.qty
  });

  newBulkOrder.save();
  console.log("New bulk order request submitted.");
  res.render("contact-confirmation");
});

app.listen(3000, () => {
  console.log("Server initiated on port 3000");
});
