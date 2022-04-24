import { useState, useRef } from "react"
import {BsSearch} from "react-icons/bs";
import {BsPlusCircle} from "react-icons/bs";
import { useRouter } from "next/router";
import api from "@/utils/api";
import { useAppContext } from "context/Store";

const SearchBar = () => {
  let router = useRouter();
  let { state, dispatch } = useAppContext();
  let { auth, post } = state;
  let [textValue, updateTextValue] = useState("");
  const inputSearch = useRef(null);

  // useEffect(() => {
  //   inputSearch.current.focus();
  //   if(inputSearch.current) inputSearch.current.focus(); 
  // }, [inputSearch]);

  const updateText = (e) => {
    updateTextValue(e.target.value); 
  }
  
  const searchBarHandler = async (e) => {
    try {
      if (e.key === "Enter") {
        if (textValue.length > 0) {
          textValue = textValue.trim();
          console.log("there is a value")
          console.log(textValue)
          
          router.push(`/?keyword=${textValue}`)
          // let res = await api.get(`/posts?keyword=${textValue}&tag=${textValue}`);
          // console.log("res")
          // console.log(res)
          // dispatch({type: "GET_ALL_POSTS", payload: {posts: res.data.data.posts, trends: post.posts.trends } });
          // let res = api.get(`/posts?keyword=${keyword}&category=${category ? category : ''}&tag=${keyword}&pageNumber=${currentPage}&offsetItems=${itemsPerPage}`);
          // router.push(`/?keyword=${textValue}`)
        } else {
          console.log("empty string; general search")
          router.push(`/`)
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  const resetInput = (e) => {
    e.preventDefault();
    // if (inputSearch.current) inputSearch.current.focus();
    updateTextValue(textValue = "");
  };

  return(
    <div className={`searchBar`}>
      <div className={`searchBar__search`}>
        <BsSearch id="searchBarMagnifier" className="searchBar__icon" size={"15"}/>
      </div>
      {/* <form className="searchBar__form" onSubmit={searchBarHandler}> */}
        <input
          className={`searchBar__text-input`}
          value={textValue} type="text"
          placeholder="What Are You Looking For?"
          name="searchBar"
          id="seachBarInput" ref={inputSearch}
          onChange={e => updateText(e)}
          onKeyPress={(e) => searchBarHandler(e)}
        />
        <div className={`searchBar__close`}>
          <BsPlusCircle id="searchBarClose" className="searchBar__icon focused" size={"15"}
          onMouseDown={(e) => resetInput(e)}
        />
        </div>
      {/* </form> */}
    </div>
  )
}
export default SearchBar;


/*ORIGINAL
    <div className={`searchBar`}>
      <div className={`searchBar__search`}>
        <BsSearch id="searchBarMagnifier" className="searchBar__icon" size={"15"}/>
      </div>
      <input onChange={event => updateText(event)} className={`searchBar__text-input`} value={textValue} type="text" placeholder="What Are You Looking For?" name="searchBar" id="seachBarInput" ref={inputSearch} />
      <div className={`searchBar__close`}>
        <BsPlusCircle id="searchBarClose" className="searchBar__icon focused" size={"15"}
        onMouseDown={(e) => resetInput(e)}
      />
      </div>
    </div>
 */