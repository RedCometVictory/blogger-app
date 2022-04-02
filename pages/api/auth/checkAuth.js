import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import jwt from 'jsonwebtoken';
import cookie from "cookie";

const JWT_SECRET = process.env.JWT_SECRET;
// TODO: this is the api point used to validate JWT cookie to access protected routes client side. It is not tested.
const handler = nc({onError, onNoMatch});
handler.get(async (req, res) => {
  console.log("|c|o|o|k|i|e|s| |")
  console.log("cookies ")
  console.log("req.cookie")
  console.log(req.headers.cookie);
  // console.log("res.cookie")
  // console.log(res.cookie);
  // let { token } = req.cookie;
  let token;
  if (req.headers.cookie) {
    let { blog__token } = cookie.parse(req.headers.cookie);
    // let { blog__token } = req.headers.cookie;
    token = blog__token
    // let { blog__token } = req.headers.cookie;
  };

  // const { token } = cookie.parse(req.headers.cookie)
  // const parsedToken = cookie.parse(req.headers.cookie.blog__token)
  console.log("8888888888888888888888888")
  // console.log("parsedToken")
  // console.log(parsedToken)
  console.log("========+++++=======")
  console.log("*** BACKEND- CHEKC AAUTH ***")

  console.log("toekn")
  console.log(token)
  if (!token) {
    console.log("no toekn")
    return res.status(401).json({ errors: [{ msg: "User unauthenticated."}] });
  };
  try {
    jwt.verify(token, JWT_SECRET, (err, isValid) => {
      if (err) {
        return res.status(401).json({ errors: [{ msg: "User unauthenticated."}] });
      } else {
        // return isValid;
        return res.status(200).json(isValid);
      };
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(`Sever Error. ${err.message}`);
  }
});
export default handler;

/*
import cookie from 'cookie'
import { API_URL } from '@/config/index'

export default async (req, res) => {
  if (req.method === 'GET') {
    if (!req.headers.cookie) {
      res.status(403).json({ message: 'Not Authorized' })
      return
    }

    const { token } = cookie.parse(req.headers.cookie)

    const strapiRes = await fetch(`${API_URL}/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const user = await strapiRes.json()

    if (strapiRes.ok) {
      res.status(200).json({ user })
    } else {
      res.status(403).json({ message: 'User forbidden' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ message: `Method ${req.method} not allowed` })
  }
}
*/