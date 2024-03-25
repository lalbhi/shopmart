const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
 
const app = express();
const port = 3000;



var admin = require("firebase-admin");

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore }  = require("firebase-admin/firestore");

var serviceAccount = require("./key.json");


initializeApp({
    credential: cert(serviceAccount)
  });



const db = getFirestore();

app.use(express.static(path.join(__dirname, 'public')));



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
  res.send('lalu')
});

app.get('/signin', (req, res) => {
    res.render('signin');
  });

  app.get('/about', (req, res) => {
    res.render('about');
  });

  app.get('/contact', (req, res) => {
    res.render('contact');
  });

  app.use(bodyParser.urlencoded({ extended: true }));

let cartItems = [];

// Route to render the home page
app.get('/item', (req, res) => {
    res.render('item', { items });
});

// Route to handle adding items to the cart
app.post('/addToCart', (req, res) => {
    const itemName = req.body.itemName;
    const itemPrice = parseFloat(req.body.itemPrice);
    cartItems.push({ name: itemName, price: itemPrice });
    res.redirect('/cart');
});

// Route to render the cart page
app.get('/cart', (req, res) => {
    const totalPrice = cartItems.reduce((acc, curr) => acc + curr.price, 0);
    res.render('cart', { cartItems, totalPrice });
});

// Sample items
const items = [
    { name: 'Designer blue saree', price: 2000, imageUrl:  '/images/img1.jpg'},
    { name: 'Red-gram', price: 100, imageUrl: '/images/img2.jpg'},
    { name: 'lip-gloss', price: 432, imageUrl:  '/images/img3.jpg'},
    { name: 'Retinol night-cream', price: 300, imageUrl:  '/images/img4.jpg'},
    { name: 'Blue-hoodie', price: 750, imageUrl:  '/images/img5.jpg'},
    { name: 'Intel(i5) laptop', price: 150000, imageUrl:  '/images/img6.jpg'},
    { name: 'Boat headphones', price: 800, imageUrl:  '/images/img7.jpg'},
    { name: 'Embroidery frock', price: 1000, imageUrl:  '/images/img8.jpg'},
    { name: 'WHEY protein', price: 3600, imageUrl:  '/images/img9.jpg'},
    { name: 'i phone(15)', price: 145000, imageUrl:  '/images/img10.jpg'},
    { name: 'long silk one piece', price: 10000, imageUrl:  '/images/img11.jpg'},
    { name: 'Ashirvad atta', price: 69, imageUrl:  '/images/img12.jpg'}





    
];
  
  
  

  app.get('/signinsubmit', (req, res) => {
    const email = req.query.email;
    console.log(email);
    const password = req.query.password;

    db.collection("users")
    .where("email", "==" , email)
    .where("password", "==" , password)
    .get()
    .then((docs)=>{
        if(docs.size>0){
            res.render('home');
        }
        else{
            res.send("login failed");
        }
       
        
    });
 });

app.get("/signupsubmit",(req,res)=>{
    const full_name= req.query.full_name;
    const last_name= req.query.last_name;
    const email= req.query.email;
    const password= req.query.password;

    db.collection("users")
    .add({
        name: full_name + last_name,
        email: email,
        password: password,
    })
    
    .then(()=>{
        res.render('home');
    });
    
   
    

});

  app.get('/signup', (req, res) => {
    res.render('signup');
  });

  
 


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

