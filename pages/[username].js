import Link from 'next/link';
import api from '@/utils/api';
import db from "@/utils/database";
import User from "@/models/User";

export const Username = () => {
  return (
    <section>
      <div>
        <p>
          Go to <Link href="/"><a>Home</a></Link>
        </p>
      </div>
    </section>
  )
}
export default Username;
export const getServerSideProps = async (context) => {
  try {
    let token = context.req.cookies.blog__token;
    if (token) {
      let username = context.params.username;
      const rgx = (pattern) => new RegExp(`.*${pattern}.*`);

      let usernameTrim = username.trim();
      let usernameFilter = usernameTrim && usernameTrim !== 'null' ? {username: usernameTrim} : {};
      await db.connectToDB();
      let user = await User.findOne(
        usernameFilter
      ).select("_id username");
      await db.disconnect();

      if (user && user._id) {
        return {
          redirect: {
            destination: `/profile/${user._id.toString()}`,
            permanent: false,
          },
          props: {},
        };
      }
    }

    return {
      redirect: {
        destination: `/404`,
        permanent: false,
      },
      props: {},
    };
  } catch (err) {
    console.error(err);
    return {
      redirect: {
        destination: `/404`,
        permanent: false,
      },
      props: {},
    };
  }
};