import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import jwt from 'jsonwebtoken';
import cookie from "cookie";

const JWT_SECRET = process.env.JWT_SECRET;
// validate JWT cookie, logout on invalid 
const handler = nc({onError, onNoMatch});
handler.get(async (req, res) => {
  let token;
  let isValid;
  if (req.headers.cookie) {
    let { blog__token } = cookie.parse(req.headers.cookie);
    token = blog__token;
  };

  if (!token) {
    return res.status(401).json(isValid = false);
  };
  try {
    jwt.verify(token, JWT_SECRET, (err, isValid) => {
      if (err) {
        return res.status(401).json({ errors: [{ msg: "User unauthenticated."}] });
      } else {
        return res.status(200).json(isValid);
      };
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(`Sever Error. ${err.message}`);
  }
});
export default handler;