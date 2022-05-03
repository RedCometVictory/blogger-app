import nc from "next-connect";
import cookie from 'cookie';
import { onError, onNoMatch } from '@/utils/ncOptions';

const handler = nc({onError, onNoMatch});
// *** Insomnia tested - passed
handler.post(async (req, res) => {
  // res.setHeader(
  //   "Set-Cookie",
  //   cookie.serialize("blog__userInfo", '', { expires: new Date(1), maxAge: -1, path: '/' })
  // );
  res.setHeader(
    "Set-Cookie",
    // cookie.serialize("blog__token", null, { expires: new Date(1), maxAge: 0, path: '/', httpOnly: false })
    cookie.serialize("blog__token", '', {
      sameSite: "strict",
      secure: process.env.NODE_ENV !== 'development',
      maxAge: -1,
      path: '/',
      httpOnly: true,
      expires: new Date(0)
    })
  );
  /*
   const serialised = serialize("OursiteJWT", null, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: -1,
      path: "/",
    });
  */
  res.send({ success: "Logged out successfully!" });
  /*
  res.setHeader('Allow', ['POST'])
    res.status(405).json({ message: `Method ${req.method} not allowed` })
  */
});
export default handler;