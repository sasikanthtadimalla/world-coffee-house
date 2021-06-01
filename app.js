require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require("lodash");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27017/wchDB", {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// -----------------------------------------DATABASE SCHEMAS---------------------------------------------------
const cartSchema = new mongoose.Schema({
  imgSrc: String,
  product: String,
  price: String,
  qty: String,
  type: String,
  total: String,
  totalQty: String,
  totalPrice: String,
  username: String
});

const orderSchema = new mongoose.Schema({
  username: String,
  date: String,
  totalQty: String,
  totalPrices: String,
  order: {
    imgSrc: [String],
    product: [String],
    price: [String],
    qty: [String],
    totalPrice: [String]
  }
});

const personSchema = new mongoose.Schema({
  name: String,
  contact: Number,
  address: String,
  username: String,
  password: String
});

personSchema.plugin(passportLocalMongoose);

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
  price: String,
  stock: Number
});

const beanSchema = new mongoose.Schema({
  imgSrc: String,
  name: String,
  price: String,
  stock: Number
});

// -----------------------------------------DATABASE COLLECTIONS---------------------------------------------------
const Person = mongoose.model("Person", personSchema);

passport.use(Person.createStrategy());
passport.serializeUser(Person.serializeUser());
passport.deserializeUser(Person.deserializeUser());

const Coffee = mongoose.model("Coffee", coffeeSchema);

const Bean = mongoose.model("Bean", beanSchema);

const Cart = mongoose.model("Cart", cartSchema);

const Order = mongoose.model("Order", orderSchema);

const Dealership = mongoose.model("Dealership", dealershipSchema);

const BulkOrder = mongoose.model("BulkOrder", bulkOrderSchema);

// -----------------------------------------MAIN CODE---------------------------------------------------
// -------------NON USER------------
app.get("/admin", (req, res) => {
  res.render("admin");
});

app.get("/db", (req, res) => {
  res.render("/admin");
});

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("home-logged-in", {customerName: req.user.name});
  } else {
    res.render("home");
  }
});

app.get("/home", (req, res) => {
  res.redirect("/");
});

app.get("/coffee", (req, res) => {
  Coffee.find((err, coffees) => {
    if (err) {
      console.log(err);
    } else {
      if (req.isAuthenticated()) {
        res.render("coffee-logged-in", {coffees: coffees});
      } else {
        res.render("coffee", {coffees: coffees});
      }
    }
  });
});

app.get("/beans", (req, res) => {
  Bean.find((err, beans) => {
    if (err) {
      console.log(err);
    } else {
      if (req.isAuthenticated()) {
        res.render("beans-logged-in", {beans: beans});
      } else {
        res.render("beans", {beans: beans});
      }
    }
  });
});

app.get("/about", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("about-logged-in");
  } else {
    res.render("about");
  }
});

app.get("/contact", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("contact-logged-in");
  } else {
    res.render("contact");
  }
});

app.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("home-logged-in", {customerName: req.user.name});
  } else {
    res.render("login", {name: "", contact: "", address: "", username: "", password: "", errMsg: "", loginEmail: "", loginPassword: "", loginErrMsg: ""});
  }
});

app.get("/dealership", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("dealership-logged-in");
  } else {
    res.render("dealership");
  }
});

app.get("/bulk-ordering", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("bulk-ordering-logged-in");
  } else {
    res.render("bulk-ordering");
  }
});

app.get("/contact-confirmation", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("contact-confirmation-logged-in");
  } else {
    res.render("contact-confirmation");
  }
});

// -------------USER------------
app.get("/:webpage", (req, res) => {
  if (req.isAuthenticated()) {
    if (req.params.webpage === "coffee-logged-in") {
      Coffee.find((err, coffees) => {
        if (err) {
          console.log(err);
        } else {
          let coffeesInStock = [];
          coffees.forEach((coffee) => {
            if (coffee.stock !== 0 && coffee.stock > 0) {
              coffeesInStock.push(coffee);
            }
          });
          res.render("coffee-logged-in", {coffees: coffeesInStock});
        }
      });
    } else if (req.params.webpage === "beans-logged-in") {
      Bean.find((err, beans) => {
        if (err) {
          console.log(err);
        } else {
          let beansInStock = [];
          beans.forEach((bean) => {
            if (bean.stock != 0) {
              beansInStock.push(bean);
            }
          });
          res.render("beans-logged-in", {beans: beansInStock});
        }
      });
    } else if (req.params.webpage === "contact-confirmation-logged-in") {
      res.render("dealership-logged-in");
    } else if (req.params.webpage === "cart") {
      Cart.find({username: req.user.username}, (err, items) => {
        if (err) {
          console.log(err);
        } else {
          Person.findOne({username: req.user.username}, (err, foundUser) => {
            res.render("cart", {items: items, user: foundUser});
          });
        }
      });
    } else if (req.params.webpage === "confirmation") {
      res.render("confirmation");
    } else if (req.params.webpage === "orders") {
      Order.find({username: req.user.username}, (err, foundOrders) => {
        console.log(foundOrders);
        res.render("orders", {orders: foundOrders});
      });
    } else if (req.params.webpage === "logout") {
      req.logout();
      res.redirect("/");
    } else if (req.params.webpage === "home-logged-in") {
      res.render("home-logged-in", {customerName: req.user.name});
    } else {
      res.render(req.params.webpage);
    }

  } else {
    res.render("login", {name: "", contact: "", address: "", username: "", password: "", errMsg: "", loginEmail: "", loginPassword: "", loginErrMsg: ""});
  }
});

// -----------------------------------------POST REQUESTS---------------------------------------------------
app.post("/signup", (req, res) => {

  Person.find({username: req.body.username}, (err, foundUsername) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUsername.length === 1) {
        res.render("login", {name: req.body.name, contact: req.body.contact, address: req.body.address, username: req.body.username, password: req.body.password, errMsg: "Email already exists", loginEmail: "", loginPassword: "", loginErrMsg: ""});
        console.log("Account already exists.");
      } else {

        Person.register({username: req.body.username}, req.body.password, (err, user) => {
          if (err) {
            console.log(err);
            res.redirect("/login");
          } else {
            passport.authenticate("local")(req, res, () => {
              Person.updateOne({username: req.body.username}, {
                name: req.body.name,
                contact: req.body.contact,
                address: req.body.address,
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
              }, (err) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("New person registered: (" + req.body.username + ")");
                }
              });
              res.redirect("/home-logged-in");
            });
          }
        });
      }
    }
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  Person.find({username: username}, (err, foundUsername) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUsername.length != 0) {
          const user = new Person({
            username: req.body.username,
            password: req.body.password
          });

          req.login(user, (err) => {
            if (err) {
              console.log(err);
            } else {
              passport.authenticate("local")(req, res, () => {
                res.redirect("/home-logged-in");
                console.log("Successfully logged in " + username);
              });
            }
          });
      } else {
        res.render("login", {name: "", contact: "", address: "", username: "", password: "", errMsg: "", loginEmail: req.body.username, loginPassword: req.body.password, loginErrMsg: "Invalid credentials"});
        console.log("Account doesn't exist");
      }
    }
  });
});

app.post("/admin", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email === "a@wch" && password === "123") {
    res.render("db", {coffeeToUpdate: "", cimgSrc: "", cname: "", cprice: "", cstock: "", bimgSrc: "", bname: "", bprice: "", bstock: "", beansToUpdate: ""});
  } else {
    res.redirect("/admin");
  }
});

app.post("/coffeesDB", (req, res) => {
  console.log("Operation: " + req.body.operation);
  if (req.body.operation === "addCoffee") {
    const newCoffee = new Coffee ({
      imgSrc: req.body.cimgSrc,
      name: _.startCase(req.body.cname),
      price: req.body.cprice,
      stock: req.body.cstock
    });

    newCoffee.save();
    console.log("New coffee inserted (" + _.startCase(req.body.cname) + ")");
    res.render("db", {coffeeToUpdate: "", cimgSrc: "", cname: "", cprice: "", cstock: "", bimgSrc: "", bname: "", bprice: "", bstock: "", beansToUpdate: ""});
  }
  else if (req.body.operation === "updateCoffee") {
    if (req.body.cimgSrc === "" && req.body.cname === "" && req.body.cprice === "" && req.body.cstock === "") {
      Coffee.findOne({name: _.startCase(req.body.coffeeToUpdate)}, (err, foundCoffee) => {
        if (err) {
          console.log(err);
        } else if (foundCoffee) {
          res.render("db", {
            coffeeToUpdate: foundCoffee.name,
            cimgSrc: foundCoffee.imgSrc,
            cname: foundCoffee.name,
            cprice: foundCoffee.price,
            cstock: foundCoffee.stock,
            beansToUpdate: "",
            bimgSrc: "",
            bname: "",
            bprice: "",
            bstock: ""
          });
          console.log("Data rendered succesfully.");
        }
      });
    } else {
      Coffee.updateOne({name: _.startCase(req.body.coffeeToUpdate)}, {
        imgSrc: req.body.cimgSrc,
        name: _.startCase(req.body.cname),
        price: req.body.cprice,
        stock: req.body.cstock,
      }, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated successfully (" + _.startCase(req.body.coffeeToUpdate) + ")");
          res.render("db", {coffeeToUpdate: "", cimgSrc: "", cname: "", cprice: "", cstock: "", bimgSrc: "", bname: "", bprice: "", bstock: "", beansToUpdate: ""});
        }
      });
    }
  }
  else if (req.body.operation === "deleteCoffee") {
    Coffee.deleteMany({name: _.startCase(req.body.cname)}, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted coffee (" + _.startCase(req.body.cname) + ")");
        res.render("db", {coffeeToUpdate: "", cimgSrc: "", cname: "", cprice: "", cstock: "", bimgSrc: "", bname: "", bprice: "", bstock: "", beansToUpdate: ""});
      }
    });
  }
});

app.post("/beansDB", (req, res) => {
  console.log(req.body.operation);
  if (req.body.operation === "addBeans") {
    const newBeans = new Bean ({
      imgSrc: req.body.bimgSrc,
      name: _.startCase(req.body.bname),
      price: req.body.bprice,
      stock: req.body.bstock
    });

    newBeans.save();
    console.log("New beans inserted (" + _.startCase(req.body.bname) + ")");
    res.render("db", {coffeeToUpdate: "", cimgSrc: "", cname: "", cprice: "", cstock: "", bimgSrc: "", bname: "", bprice: "", bstock: "", beansToUpdate: ""});
  }
  else if (req.body.operation === "updateBeans") {
    if (req.body.bimgSrc === "" && req.body.bname === "" && req.body.bprice === "" && req.body.bstock === "") {
      Bean.findOne({name: _.startCase(req.body.beansToUpdate)}, (err, foundBeans) => {
        if (err) {
          console.log(err);
        } else if (foundBeans) {
          res.render("db", {
            beansToUpdate: foundBeans.name,
            bimgSrc: foundBeans.imgSrc,
            bname: foundBeans.name,
            bprice: foundBeans.price,
            bstock: foundBeans.stock,
            coffeeToUpdate: "",
            cimgSrc: "",
            cname: "",
            cprice: "",
            cstock: ""
          });
          console.log("Data rendered succesfully.");
        }
      });
    } else {
      Bean.updateOne({name: _.startCase(req.body.beansToUpdate)}, {
        imgSrc: req.body.bimgSrc,
        name: _.startCase(req.body.bname),
        price: req.body.bprice,
        stock: req.body.bstock
      }, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated successfully (" + _.startCase(req.body.beansToUpdate) + ")");
          res.render("db", {coffeeToUpdate: "", cimgSrc: "", cname: "", cprice: "", cstock: "", bimgSrc: "", bname: "", bprice: "", bstock: "", beansToUpdate: ""});
        }
      });
    }
  }
  else if (req.body.operation === "deleteBeans") {
    Bean.deleteMany({name: _.startCase(req.body.bname)}, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted beans (" + _.startCase(req.body.bname) + ")");
        res.render("db", {coffeeToUpdate: "", cimgSrc: "", cname: "", cprice: "", cstock: "", bimgSrc: "", bname: "", bprice: "", bstock: "", beansToUpdate: ""});
      }
    });
  }
});

app.post("/coffee", (req, res) => {
  console.log(req.body);
  Cart.findOne({username: req.user.username, type: "coffee", product: req.body.product}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      let price = parseInt(req.body.price);
      let qty = parseInt(req.body.qty.slice(0, 1));
      let totalPrice = price * qty;

      if (result === null) {
        const newCart = new Cart({
          imgSrc: req.body.imgSrc,
          product: req.body.product,
          price: req.body.price,
          qty: req.body.qty,
          type: req.body.type,
          total: totalPrice,
          username: req.user.username
        });

        newCart.save((err) => {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/coffee-logged-in");
            console.log("Cart updated: (" + req.user.username + ")");
          }
        });
      } else {
        Cart.updateOne({_id: result._id}, {
          imgSrc: req.body.imgSrc,
          product: req.body.product,
          price: req.body.price,
          qty: req.body.qty,
          type: req.body.type,
          total: totalPrice,
          username: req.user.username
        },
        (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Product updated");
            res.redirect("/coffee-logged-in");
          }
        });
      }
    }
  });
});

app.post("/beans", (req, res) => {

  Cart.findOne({username: req.user.username, type: "beans", product: req.body.product}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      let price = parseInt(req.body.price);
      let qty = parseInt(req.body.qty.slice(0, 1));
      let totalPrice = price * qty;

      if (result === null) {
        const newCart = new Cart({
          imgSrc: req.body.imgSrc,
          product: req.body.product,
          price: req.body.price,
          qty: req.body.qty,
          type: req.body.type,
          total: totalPrice,
          username: req.user.username
        });

        newCart.save((err) => {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/beans-logged-in");
            console.log("Cart updated: (" + req.user.username + ")");
          }
        });
      } else {
        Cart.updateOne({_id: result._id}, {
          imgSrc: req.body.imgSrc,
          product: req.body.product,
          price: req.body.price,
          qty: req.body.qty,
          type: req.body.type,
          total: totalPrice,
          username: req.user.username
        },
        (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Product updated");
            res.redirect("/beans-logged-in");
          }
        }
      );
      }
    }
  });

});

app.post("/cart", (req, res) => {
  console.log(req.body);
  if (req.body.deleteOne) {
    Cart.findByIdAndDelete({
      _id: req.body.deleteOne
    },
    {
      useFindAndModify: false
    },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted product (" + req.body.deleteOne + ")");
        res.redirect("/cart");
      }
    });
  } else if (req.body.deleteAll) {
    Cart.deleteMany({username: req.user.username}, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted all products in cart (" + req.user.username + ")");
        res.redirect("/cart");
      }
    });
  } else if (req.body.confirm == "true") {
    const newOrder = new Order({
      username: req.user.username,
      date: req.body.date,
      totalQty: req.body.totalQty,
      totalPrices: req.body.totalPrices,
      order: {
        imgSrc: req.body.imgSrc,
        product: req.body.product,
        price: req.body.price,
        qty: req.body.qty,
        totalPrice: req.body.totalPrice
      }
    });

    newOrder.save((err) => {
      if (err) {
        console.log(err);
      } else {

        if (Array.isArray(req.body.product)) {
          for (let i = 0; i < req.body.product.length; i++) {
            let product = req.body.product[i];
            let qty = parseInt(req.body.qty[i].slice(0,1));
            let type = req.body.type[i];

            if (type === "coffee") {
              let newStock = 0;
              Coffee.findOne({name: product}, (err, foundCoffee) => {
                newStock = foundCoffee.stock - qty;
                Coffee.updateOne({name: product}, {
                  stock: newStock
                },
                (err) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("Stock updated - coffee");
                  }
                });
              });
            }

            if (type === "beans") {
              let newStock = 0;
              Bean.findOne({name: product}, (err, foundBean) => {
                newStock = foundBean.stock - qty;
                Bean.updateOne({name: product}, {
                  stock: newStock
                },
                (err) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("Stock updated - bean");
                  }
                });
              })
            }
          }
        } else {
          let type = req.body.type;
          let product = req.body.product;
          let qty = parseInt(req.body.qty.slice(0,1));

          if (type === "coffee") {
            let newStock = 0;
            Coffee.findOne({name: product}, (err, foundCoffee) => {
              newStock = foundCoffee.stock - qty;
              Coffee.updateOne({name: product}, {
                stock: newStock
              },
              (err) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Stock updated - coffee");
                }
              });
            });
          }

          if (type === "beans") {
            let newStock = 0;
            Bean.findOne({name: product}, (err, foundBean) => {
              newStock = foundBean.stock - qty;
              Bean.updateOne({name: product}, {
                stock: newStock
              },
              (err) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Stock updated - bean");
                }
              });
            });
          }
        }

        Cart.deleteMany({username: req.user.username}, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("New order by (" + req.user.username + ")");
            res.redirect("/confirmation");
          }
        });

      }
    });
  }
});

app.post("/orders/:orderID", (req, res) => {

  Order.findOne({_id: req.params.orderID}, (err, foundOrder) => {
    if (err) {
      console.log(err);
    } else {
      if (foundOrder) {
        res.render("order", {order: foundOrder});
      }
    }
  });
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
  res.redirect("/contact-confirmation");
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
  res.redirect("/contact-confirmation");
});

app.listen(3000, () => {
  console.log("Server initiated on port 3000");
});
