import { useState, useRef } from "react"
import {BsSearch} from "react-icons/bs";
import {BsPlusCircle} from "react-icons/bs";
import { useRouter } from "next/router";

const SearchBar = () => {
  let router = useRouter();
  let [textValue, updateTextValue] = useState("");
  const inputSearch = useRef(null);

  const updateText = (e) => {
    updateTextValue(e.target.value); 
  }

  const resetInput = (e) => {
    e.preventDefault();
    updateTextValue(textValue = "");
  };

  const searchBarHandler = async (e) => {
    try {
      if (e.key === "Enter") {
        if (textValue.length > 0) {
          textValue = textValue;
          router.push(`/?keyword=${textValue}`);
          resetInput(e);
        } else {
          router.push(`/`)
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return(
    <div className={`searchBar`}>
      <div className={`searchBar__search`}>
        <BsSearch id="searchBarMagnifier" className="searchBar__icon" size={"15"}/>
      </div>
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
    </div>
  )
}
export default SearchBar;