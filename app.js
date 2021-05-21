const express = require("express");
const bodyParser = require('body-parser');
const coffees = require('./datastore/coffees.js');
const beans = require("./datastore/beans.js");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home", {});
});

app.get("/:page", (req, res) => {

  if (req.params.page === "coffee-logged-in") {
    res.render("coffee-logged-in", {coffees: coffees.getCoffees()});
  } else if (req.params.page === "beans-logged-in") {
    res.render("beans-logged-in", {beans: beans.getBeans()});
  } else {
    res.render(req.params.page);
  }

});

// let people = [];
// let dealership = [];
// let bulkOrdering = [];
// let cart = [];
let orders = [];

// app.post("/login", (req, res) => {
//   people.push({
//     name: req.body.name,
//     contact: req.body.contact,
//     address: req.body.address,
//     email: req.body.email,
//     password: req.body.password
//   });
//
//   console.log(people);
// });

// app.post("/dealership", (req, res) => {
//   dealership.push({
//     name: req.body.name,
//     email: req.body.email,
//     location: req.body.location,
//     scope: req.body.scope
//   });
//
//   console.log(dealership);
// });

// app.post("/bulk-ordering", (req, res) => {
//   bulkOrdering.push({
//       name: req.body.name,
//       email: req.body.email,
//       location: req.body.location,
//       qty: req.body.qty
//     });
//
//     console.log(bulkOrdering);
// });

// app.post("/coffee", (req, res) => {
//   cart.push({
//     coffeeVariety: req.body.coffeeVariety,
//     qty: req.body.qty,
//     pricePerKG: req.body.pricePerKG
//   });
//
//   console.log(cart);
// });

// app.post("/beans", (req, res) => {
//   cart.push({
//     beansVariety: req.body.beansVariety,
//     qty: req.body.qty,
//     pricePerKG: req.body.pricePerKG
//   });
//
//   console.log(cart);
// });

app.post("/cart", (req, res) => {

  orders.push({
    orderID: req.body.orderID,
    date: req.body.date,
    imgSrc: req.body.imgSrc,
    name: req.body.name,
    price: req.body.price,
    qty: req.body.qty,
    totalPrice: req.body.totalPrice
  });

  console.log(orders);

});

app.listen(3000, () => {
  console.log("Server initiated on port 3000");
});
