import jwt from 'jsonwebtoken';
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const verifAuth = async (req, res, next) => {
  const { blog__token } = req.cookies;
  if (!blog__token) {
    return res.status(401).json({ error: "No token. Authorization denied" });
  };

  try {
    jwt.verify(blog__token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ errors: [{ msg: "User unauthenticated." }] });
      } else {
        req.user = decoded.user;
        next();
      };
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(`Sever Error. ${err.message}`);
  }
};

const authRole = (req, res, next) => {
  const { role } = req.user;
  if (req.user && role === 'user') {
    next();
  } else {
    return res.status(401).json({ errors: [{ msg: "Authorization denied" }] });
  };
};
module.exports = {verifAuth, authRole};