import React, {useState} from "react";
export const ControlGroup = ({type, placeholder, id, className, name, labelActive, onChange, value, required}) => {
  return(
    <div className="control-group">
      <input type={type} name={name} value={value} onChange={event => onChange(event)} className={`login-field ${className !== undefined ? className :""}`} placeholder={placeholder} id={id} required={required}/>
      <label htmlFor={id} className={`login-field-icon ${labelActive === undefined ? {display:"none"}: className}`}></label>
    </div>
  )
}
export const ControlGroupTextField = ({type, placeholder, id, className, name, labelActive, onChange, value, required}) => {
  return(
    <div className="control-group">
      <textarea
        className={`login-field ${className !== undefined ? className :""}`}
        placeholder={placeholder} id={id}
        type={type}
        name={name}
        value={value}
        onChange={event => onChange(event)}
        cols="30"
        rows="10"
        required={required}
      >
      </textarea>
    </div>
  )
}

export const ControlGroupFileUpload = ({action,icon}) =>{
  return(<>
    <label className="control-group-upload signin__label" htmlFor="image_url"><span>Image: </span>
      <input
        type="file"
        accept=".jpeg, .jpg, .png, .gif"
        placeholder=".jpeg, .jpg, .png, .gif formats only"
        name="image_url"
        onChange={action}
      />
    </label>
  </>)
}

export const ControlGroupGender = () => {
  const [gender, setGender] = useState("");
  return(
    <div className="control-group-gender">
      <label htmlFor="male">Male</label>
      <input onClick={()=> setGender("male")} checked={gender ==="male"} className="genderInput" value="Male" name="gender" type="radio" id="male"/>
      <label htmlFor="female">Female</label>
      <input onClick={()=> setGender("female")} checked={gender === "female"} className="genderInput" value="Female" name="gender" type="radio" id="female"/>
      <label htmlFor="other">Other</label>
      <input onClick={()=> setGender("other")} checked={gender === "other" } className="genderInput" value="Other" name="gender" type="radio" id="other"/>
    </div>
  )
}