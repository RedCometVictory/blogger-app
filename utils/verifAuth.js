import jwt from 'jsonwebtoken';
import Cookies from "js-cookie";
import cookie from "cookie";
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const verifAuth = async (req, res, next) => {
  console.log("VEERIFYING ROUTE")
  const { blog__token } = req.cookies;
  console.log("ALL COOKIES")
  console.log(req.cookies)
  console.log("verifying user authentication");
  console.log("token");
  console.log(blog__token);
  if (!blog__token) {
    console.log("token is expired")
    return res.status(401).json({ error: "No token. Authorization denied" });
  };

  try {
    console.log("decoded")
    // const decoded = jwt.verify(token, JWT_SECRET, (err, decoded) => {
    jwt.verify(blog__token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ errors: [{ msg: "User unauthenticated." }] });
      } else {
        console.log(decoded)
        req.user = decoded.user;
        next();
      };
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(`Sever Error. ${err.message}`);
  }
};

const authRole = (req, res, next) => {
  const { role } = req.user;
  console.log("validating user role")
  console.log(role);
  // if (req.user && role === 'admin') {
  if (req.user && role === 'user') {
    next();
  } else {
    return res.status(401).json({ errors: [{ msg: "Authorization denied" }] });
  };
};

module.exports = {verifAuth, authRole};