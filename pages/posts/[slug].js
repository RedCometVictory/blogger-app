import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import dynamic from 'next/dynamic';
// import Output from "editorjs-react-renderer";
const Output = dynamic(() => import("editorjs-react-renderer"), { ssr: false });
import Blocks from "editorjs-blocks-react-renderer";
import { useRouter } from "next/router";
import { useAppContext } from 'context/Store';
import axios from 'axios';
import api from "../../utils/api";
import { FaUpload } from 'react-icons/fa';
import { toast } from "react-toastify";
/*
postData: {
    _id: '61998119ba44de7f62ede84e',
    user: '61994fe0ba44de7f62ede832',
    username: 'wolftwengu1',
    avatarImage: 'https://res.cloudinary.com/dhvryypso/image/upload/v1637437410/
blog/wfwtclu5bom2i6mqahe1.gif',
    coverImage: '',
    coverImageFilename: '',
    title: 'Title of example post 03',
    text: 'Text of example post 03',
    category: 'art',
    tags: [ 'digital paint, scrap booking, watercolour' ],
    likes: [],
    comments: [],
    createdAt: '2021-11-20T23:13:29.361Z',
    updatedAt: '2021-11-20T23:13:29.361Z',
    __v: 0
  }

*/
const Blog = ({ blogData }) => {
  console.log("blogData")
  console.log(blogData)
  const { state, dispatch } = useAppContext();
  const { auth, post } = state;
  const router = useRouter();
  let [parsedBlocks, setParsedBlocks] = useState(JSON.parse(blogData.text));

  useEffect(() => {
    if (!auth.isAuthenticated && auth.user.role !== 'user') return router.push("/");
  }, []);

  console.log("typeof(blogData.text)")
  console.log(typeof(blogData.text))
  let parser = JSON.parse(blogData.text)
  console.log("typeof(parser)")
  console.log(typeof(parser))
  console.log("parsedBlocks")
  console.log(typeof(parsedBlocks))
  console.log(parsedBlocks)
  
  let renderedContent = parsedBlocks.blocks
  console.log("rendered blocks")
  console.log(renderedContent)

  // parent class is blog__text
  const blocksConfig={
    code: {
      className: "code-block"
    },
    delimiter: {
      className: "delimiter"
    },
    embed: {
      className: "border-0"
    },
    header: {
      className: "header"
    },
    image: {
      className: "w-full max-w-screen-md",
      actionsClassNames: {
        stretched: "w-full h-80 object-cover",
        withBorder: "border border-2",
        withBackground: "p-2",
      }
    },
    list: {
      className: "list"
    },
    paragraph: {
      className: "text-base",
      actionsClassNames: {
        alignment: "text-{alignment}", // This is a substitution placeholder: left or center.
      }
    },
    quote: {
      className: "py-3 px-5 italic font-serif"
    },
    table: {
      className: "table-auto"
    }
  };

  return (<>
    <div className="blog">
      <section className="blog__page">
        {blogData && blogData.coverImage && (
          <div className="blog__image">
            <Image
              className={"blog__img"}
              src={blogData.coverImage}
              fill="layout"
              alt="user avatar"
              // width={500}
              // height={250}
              layout="fill"
            />
          </div>
        )}
        <div className="blog__container">
          <div className="blog__header">
            <h2>{blogData.title}</h2>
            <div className="blog__user-info">
              {blogData.avatarImage && (
                <div className="blog__image-avatar">
                  <Image
                    className={"blog__img"}
                    src={blogData.avatarImage}
                    fill="layout"
                    alt="user avatar"
                    // width={500}
                    // height={250}
                    layout="fill"
                    // image is stretched, apply custom css to fix
                  />
                </div>
              )}
              <div className="blog__author">
                {/* <span><em>Written By: {`${auth.user.firstName} ${auth.user.lastName}`}</em></span> */}
                <span><em>Written By: {`${blogData.username}`}</em></span>
              </div>
            </div>
            <div className="blog__options">
              {auth.isAuthenticated && auth.user._id === blogData?.user && (
                <Link
                  passHref
                  // href={`/posts/update/${post?._id}`}
                  href={`/posts/f/update/${blogData._id}`}
                >
                  <button className="btn btn-secondary">Edit</button>
                </Link>
              )}
            </div>
            <p>Category: {blogData.category}</p>
            <div className="blog__tags">
              {blogData?.tags.map((tag, index) => (
                <div className="blog__tag-item" key={index}>
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </div>
              ))}
            </div>
          </div>
          <div className="blog__content">
            <div className="blog__text">
              <Blocks
                data={parsedBlocks}
                config={blocksConfig}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  </>);
};
export default Blog;
export const getServerSideProps = async (context) => {
  console.log("context.params")
  console.log(context.params)
  console.log("+++++++++++++++++++++++++")
  try {
    let post_id = context.query.slug;
    let initPostInfo = '';
    // let token = context.req.cookies.blog__token;
    // console.log("token")
    // console.log(token)
    if (context.query.slug !== 'create') {
      // retreive post data
      initPostInfo = await axios({
        method: 'get',
        url: `http://localhost:3000/api/post/${post_id}`,
        headers: context.req ? { cookie: context.req.headers.cookie } : undefined
      });
    }

    console.log("+++++++++++++++++++++++++")
    console.log("+++++++++++++++++++++++++")
    
    console.log("initPostInfo.data.data")
    console.log(initPostInfo.data.data)
    console.log("+++++++++++++++++++++++++")
    console.log("+++++++++++++++++++++++++")
    console.log("+++++++++++++++++++++++++")
    let initBlog = initPostInfo.data.data;

    console.log(initBlog)

    return {
      props: { blogData: initBlog ? initBlog.postData : '' }
    }
  } catch (err) {
    return {
      props: {
        blogData: ''
      }
    }
  }
};


/*
context
{
  req: IncomingMessage {
    _readableState: ReadableState {
      objectMode: false,
      highWaterMark: 16384,
      buffer: BufferList { head: null, tail: null, length: 0 },
      length: 0,
      pipes: [],
      flowing: null,
      ended: true,
      endEmitted: false,
      reading: false,
      sync: true,
      needReadable: false,
      emittedReadable: false,
      readableListening: false,
      resumeScheduled: false,
      errorEmitted: false,
      emitClose: true,
      autoDestroy: false,
      destroyed: false,
      errored: null,
      closed: false,
      closeEmitted: false,
      defaultEncoding: 'utf8',
      awaitDrainWriters: null,
      multiAwaitDrain: false,
      readingMore: true,
      decoder: null,
      encoding: null,
      [Symbol(kPaused)]: null
    },
    _events: [Object: null prototype] { end: [Function: clearRequestTimeout] },
    _eventsCount: 1,
    _maxListeners: undefined,
    socket: Socket {
      connecting: false,
      _hadError: false,
      _parent: null,
      _host: null,
      _readableState: [ReadableState],
      _events: [Object: null prototype],
      _eventsCount: 8,
      _maxListeners: undefined,
      _writableState: [WritableState],
      allowHalfOpen: true,
      _sockname: null,
      _pendingData: null,
      _pendingEncoding: '',
      server: [Server],
      _server: [Server],
      parser: [HTTPParser],
      on: [Function: socketListenerWrap],
      addListener: [Function: socketListenerWrap],
      prependListener: [Function: socketListenerWrap],
      _paused: false,
      _httpMessage: [ServerResponse],
      timeout: 0,
      [Symbol(async_id_symbol)]: 3281,
      [Symbol(kHandle)]: [TCP],
      [Symbol(kSetNoDelay)]: false,
      [Symbol(lastWriteQueueSize)]: 0,
      [Symbol(timeout)]: Timeout {
        _idleTimeout: -1,
        _idlePrev: null,
        _idleNext: null,
        _idleStart: 35081,
        _onTimeout: null,
        _timerArgs: undefined,
        _repeat: null,
        _destroyed: true,
        [Symbol(refed)]: false,
        [Symbol(kHasPrimitive)]: false,
        [Symbol(asyncId)]: 3313,
        [Symbol(triggerId)]: 3309
      },
      [Symbol(kBuffer)]: null,
      [Symbol(kBufferCb)]: null,
      [Symbol(kBufferGen)]: null,
      [Symbol(kCapture)]: false,
      [Symbol(kBytesRead)]: 0,
      [Symbol(kBytesWritten)]: 0,
      [Symbol(RequestTimeout)]: undefined
    },
    httpVersionMajor: 1,
    httpVersionMinor: 1,
    httpVersion: '1.1',
    complete: true,
    headers: {
      host: 'localhost:3000',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20
100101 Firefox/91.0 Waterfox/91.6.0',
      accept: '/',
      'accept-language': 'en-US,en;q=0.5',
      'accept-encoding': 'gzip, deflate',
      referer: 'http://localhost:3000/posts/create',
      connection: 'keep-alive',
      cookie: '__stripe_mid=deb3bf0d-e876-4f27-ac63-c7f1381674f94d187b; blog__us
erInfo={%22_id%22:%22620fd9908f14a9af7c1eb7ca%22%2C%22firstName%22:%22Reimu2%22%
2C%22lastName%22:%22Hakurei2%22%2C%22username%22:%22red112%22%2C%22email%22:%22r
edbow11@mail.com%22%2C%22avatarImage%22:%22https://res.cloudinary.com/dhvryypso/
image/upload/v1636353979/blog/Default-welcomer_fhdikf.png%22%2C%22role%22:%22use
r%22}; blog__token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjIw
ZmQ5OTA4ZjE0YTlhZjdjMWViN2NhIiwicm9sZSI6InVzZXIifSwiaWF0IjoxNjQ2MDkxNjE2LCJleHAi
OjE2NDY2OTY0MTZ9.2365TOcpLVj2veZbE6TmqJzQiBJesNhF6zLmO2iZ-8o; io=RfEqq9tEcqgnaZH
5AAAH',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'sec-gpc': '1'
    },
    rawHeaders: [
      'Host',
      'localhost:3000',
      'User-Agent',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox
/91.0 Waterfox/91.6.0',
      'Accept',
      '/',
      'Accept-Language',
      'en-US,en;q=0.5',
      'Accept-Encoding',
      'gzip, deflate',
      'Referer',
      'http://localhost:3000/posts/create',
      'Connection',
      'keep-alive',
      'Cookie',
      '__stripe_mid=deb3bf0d-e876-4f27-ac63-c7f1381674f94d187b; blog__userInfo={
%22_id%22:%22620fd9908f14a9af7c1eb7ca%22%2C%22firstName%22:%22Reimu2%22%2C%22las
tName%22:%22Hakurei2%22%2C%22username%22:%22red112%22%2C%22email%22:%22redbow11@
mail.com%22%2C%22avatarImage%22:%22https://res.cloudinary.com/dhvryypso/image/up
load/v1636353979/blog/Default-welcomer_fhdikf.png%22%2C%22role%22:%22user%22}; b
log__token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjIwZmQ5OTA4
ZjE0YTlhZjdjMWViN2NhIiwicm9sZSI6InVzZXIifSwiaWF0IjoxNjQ2MDkxNjE2LCJleHAiOjE2NDY2
OTY0MTZ9.2365TOcpLVj2veZbE6TmqJzQiBJesNhF6zLmO2iZ-8o; io=RfEqq9tEcqgnaZH5AAAH',
      'Sec-Fetch-Dest',
      'empty',
      'Sec-Fetch-Mode',
      'cors',
      'Sec-Fetch-Site',
      'same-origin',
      'Sec-GPC',
      '1'
    ],
    trailers: {},
    rawTrailers: [],
    aborted: false,
    upgrade: false,
    url: '/posts/create',
    method: 'GET',
    statusCode: null,
    statusMessage: null,
    client: Socket {
      connecting: false,
      _hadError: false,
      _parent: null,
      _host: null,
      _readableState: [ReadableState],
      _events: [Object: null prototype],
      _eventsCount: 8,
      _maxListeners: undefined,
      _writableState: [WritableState],
      allowHalfOpen: true,
      _sockname: null,
      _pendingData: null,
      _pendingEncoding: '',
      server: [Server],
      _server: [Server],
      parser: [HTTPParser],
      on: [Function: socketListenerWrap],
      addListener: [Function: socketListenerWrap],
      prependListener: [Function: socketListenerWrap],
      _paused: false,
      _httpMessage: [ServerResponse],
      timeout: 0,
      [Symbol(async_id_symbol)]: 3281,
      [Symbol(kHandle)]: [TCP],
      [Symbol(kSetNoDelay)]: false,
      [Symbol(lastWriteQueueSize)]: 0,
      [Symbol(timeout)]: Timeout {
        _idleTimeout: -1,
        _idlePrev: null,
        _idleNext: null,
        _idleStart: 35081,
        _onTimeout: null,
        _timerArgs: undefined,
        _repeat: null,
        _destroyed: true,
        [Symbol(refed)]: false,
        [Symbol(kHasPrimitive)]: false,
        [Symbol(asyncId)]: 3313,
        [Symbol(triggerId)]: 3309
      },
      [Symbol(kBuffer)]: null,
      [Symbol(kBufferCb)]: null,
      [Symbol(kBufferGen)]: null,
      [Symbol(kCapture)]: false,
      [Symbol(kBytesRead)]: 0,
      [Symbol(kBytesWritten)]: 0,
      [Symbol(RequestTimeout)]: undefined
    },
    _consuming: false,
    _dumped: false,
    cookies: {
      __stripe_mid: 'deb3bf0d-e876-4f27-ac63-c7f1381674f94d187b',
      blog__userInfo: '{"_id":"620fd9908f14a9af7c1eb7ca","firstName":"Reimu2","l
astName":"Hakurei2","username":"red112","email":"redbow11@mail.com","avatarImage
":"https://res.cloudinary.com/dhvryypso/image/upload/v1636353979/blog/Default-we
lcomer_fhdikf.png","role":"user"}',
      blog__token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI
wZmQ5OTA4ZjE0YTlhZjdjMWViN2NhIiwicm9sZSI6InVzZXIifSwiaWF0IjoxNjQ2MDkxNjE2LCJleHA
iOjE2NDY2OTY0MTZ9.2365TOcpLVj2veZbE6TmqJzQiBJesNhF6zLmO2iZ-8o',
      io: 'RfEqq9tEcqgnaZH5AAAH'
    },
    [Symbol(kCapture)]: false,
    [Symbol(RequestTimeout)]: undefined,
    [Symbol(NextRequestMeta)]: {
      __NEXT_INIT_URL: 'http://localhost:3000/posts/create',
      __NEXT_INIT_QUERY: {},
      __nextHadTrailingSlash: undefined
    }
  },
  res: <ref *1> ServerResponse {
    _events: [Object: null prototype] { finish: [Function: bound resOnFinish] },
    _eventsCount: 1,
    _maxListeners: undefined,
    outputData: [],
    outputSize: 0,
    writable: true,
    destroyed: false,
    _last: false,
    chunkedEncoding: false,
    shouldKeepAlive: true,
    _defaultKeepAlive: true,
    useChunkedEncodingByDefault: true,
    sendDate: true,
    _removedConnection: false,
    _removedContLen: false,
    _removedTE: false,
    _contentLength: null,
    _hasBody: true,
    _trailer: '',
    finished: false,
    _headerSent: false,
    socket: Socket {
      connecting: false,
      _hadError: false,
      _parent: null,
      _host: null,
      _readableState: [ReadableState],
      _events: [Object: null prototype],
      _eventsCount: 8,
      _maxListeners: undefined,
      _writableState: [WritableState],
      allowHalfOpen: true,
      _sockname: null,
      _pendingData: null,
      _pendingEncoding: '',
      server: [Server],
      _server: [Server],
      parser: [HTTPParser],
      on: [Function: socketListenerWrap],
      addListener: [Function: socketListenerWrap],
      prependListener: [Function: socketListenerWrap],
      _paused: false,
      _httpMessage: [Circular *1],
      timeout: 0,
      [Symbol(async_id_symbol)]: 3281,
      [Symbol(kHandle)]: [TCP],
      [Symbol(kSetNoDelay)]: false,
      [Symbol(lastWriteQueueSize)]: 0,
      [Symbol(timeout)]: Timeout {
        _idleTimeout: -1,
        _idlePrev: null,
        _idleNext: null,
        _idleStart: 35081,
        _onTimeout: null,
        _timerArgs: undefined,
        _repeat: null,
        _destroyed: true,
        [Symbol(refed)]: false,
        [Symbol(kHasPrimitive)]: false,
        [Symbol(asyncId)]: 3313,
        [Symbol(triggerId)]: 3309
      },
      [Symbol(kBuffer)]: null,
      [Symbol(kBufferCb)]: null,
      [Symbol(kBufferGen)]: null,
      [Symbol(kCapture)]: false,
      [Symbol(kBytesRead)]: 0,
      [Symbol(kBytesWritten)]: 0,
      [Symbol(RequestTimeout)]: undefined
    },
    _header: null,
    _keepAliveTimeout: 5000,
    _onPendingData: [Function: bound updateOutgoingData],
    _sent100: false,
    _expect_continue: false,
    statusCode: 200,
    flush: [Function: flush],
    write: [Function: write],
    end: [Function: end],
    on: [Function: on],
    writeHead: [Function: writeHead],
    [Symbol(kCapture)]: false,
    [Symbol(kNeedDrain)]: false,
    [Symbol(corked)]: 0,
    [Symbol(kOutHeaders)]: null
  },
  query: { slug: 'create' },
  resolvedUrl: '/posts/create',
  params: { slug: 'create' },
  locales: undefined,
  locale: undefined,
  defaultLocale: undefined
}

*/