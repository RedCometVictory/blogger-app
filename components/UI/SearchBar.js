import { useState, useRef } from "react"
import {BsSearch} from "react-icons/bs";
import {BsPlusCircle} from "react-icons/bs";

const SearchBar = () => {
  let [textValue, updateTextValue] = useState("");
  const inputSearch = useRef(null);

  // useEffect(() => {
  //   inputSearch.current.focus();
  //   if(inputSearch.current) inputSearch.current.focus(); 
  // }, [inputSearch]);

  const updateText = (event) => {
    updateTextValue(event.target.value); 
  }
  
  // const searchBarHandler = (value) => {
  //   inputSearch.current.focus();
  // };
  
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
      <input onChange={event => updateText(event)} className={`searchBar__text-input`} value={textValue} type="text" placeholder="What Are You Looking For?" name="searchBar" id="seachBarInput" ref={inputSearch} />
      <div className={`searchBar__close`}>
        <BsPlusCircle id="searchBarClose" className="searchBar__icon focused" size={"15"}
        onMouseDown={(e) => resetInput(e)}
      />
      </div>
    </div>
  )
}
export default SearchBar;