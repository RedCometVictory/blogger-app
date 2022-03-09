import React from "react";
import ReactTooltip from "react-tooltip";

const myThemes = [
  {
    id: "light",
    name: "Light",
    type: "light",
    unlocked: true,
  },
  {
    id: "dark",
    name: "Dark",
    type: "dark",
    unlocked: true
  },
  {
    id: "bee-light",
    name: "Bee",
    type: "light",
    unlocked: true
  },
  {
    id: "bee",
    name: "Bee",
    type: "light",
    unlocked: true
  },
  {
    id: "redcomet",
    name: "RedComet",
    type: "dark",
    unlocked: true
  },
  {
    id: "purple-prime",
    name: "Purple Prime",
    type: "dark",
    unlocked: true
  },
  {
    id: "blueberry",
    name: "Blueberry",
    type: "dark",
    unlocked: true
  },
  {
    id: "blue-dark",
    name: "Blue Dark",
    type: "dark",
    unlocked: true
  },
  {
    id: "purple-max",
    name: "Purple Max",
    type: "dark",
    unlocked: true
  },
]
 
            // {/* const nextTheme = myThemes.length -1 === index ? myThemes[0].id : myThemes[index+1].id; */}
            // {/* return item.id === theme ? ( */}
          // {/* item.id === theme ? ( */}fds
          // {/* ) */}
const ThemePicker = ({ theme, setTheme }) => {
  return (
  <div className="palette__theme-container">
    {myThemes.map((item, index) => (
      <div key={item.id} className={`palette__item theme-${item.id}`}>
        <div
          className={`palette__circle ${item.id}`}
          aria-label={`Theme ${item.name}`}
          // onClick={() => setTheme(nextTheme)}
          onClick={() => setTheme(`theme-${item.id}`)}
        >
          
        </div>
      </div>
    ))}
  </div>
  );
}
export default ThemePicker;
// +++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++
/*
const ThemePicker = ({ theme, setTheme }) => {
  return (
  <div className="palette">
    {myThemes.map((item, index) => (
      <div key={item.id} className={`palette__item theme-${item.id}`}>
        <button
          className="palette__button"
          aria-label={`Theme ${item.name}`}
          // onClick={() => setTheme(nextTheme)}
          onClick={() => setTheme(`theme-${item.id}`)}
        >
          {item.name}
        </button>
      </div>
    ))}
  </div>
  );
}
*/
// +++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++
/*
const ThemePicker = ({ theme, setTheme, small }) => {
  return (
    <div className="flex m-auto md:m-0">
      <ReactTooltip />
      {myThemes.map((item, index) => {
        if (item.unlocked) {
          return (
            <div key={item.id} className={`theme-${item.id}`}>
              <button
                aria-label={`Theme ${item.name}`}
                className={`h-10 w-8 my-1 ${
                  index !== myThemes.length ? "mr-4" : ""
                } transition duration-500  ease-in-out transform  ${
                  theme === `theme-${item.id}` ? "" : "hover:scale-110"
                }`}
                onClick={() => setTheme(`theme-${item.id}`)}
              >
                <div
                  data-tip={`${item.name}`}
                  className={`h-8 w-8 bg-primary  rounded-full my-2 md:my-0 flex items-center justify-center  ${
                    theme === `theme-${item.id}`
                      ? " border-4 border-accent"
                      : ""
                  }`}
                >
                  {item.type === "light" && (
                      <div className="text-white text-primary opacity-75">
                        <ion-icon style={{display:'block'}} name="sunny-outline" />
                      </div>
                  )}
                  {item.type === "dark" && (
                    <div
                      className="text-white text-primary opacity-75">
                        <ion-icon style={{display:'block'}} name="moon-outline" />
                    </div>
                  )}
                  {item.type === "unlockable" && (
                    <div className="text-white text-primary opacity-75">
                        <ion-icon style={{display:'block'}} name="gift-outline"/>
                    </div>
                  )}
                </div>
              </button>
            </div>
          );
        } else {
          return (
            <div className={``}>
              <button
                disabled={true}
                aria-label={`Theme Locked`}
                className={`h-10 w-8 my-1 ${
                  index !== myThemes.length ? "mr-4" : ""
                } transition duration-500  ease-in-out transform opacity-75`}
              >
                <div
                  data-tip={`Find this theme by exploring the site.`}
                  className={`h-8 w-8 bg-grey rounded-full my-2 md:my-0 flex items-center justify-center`}
                >
                  <ion-icon name="lock-closed-outline" />
                </div>
              </button>
            </div>
          );
        }
      })}
    </div>
  );
};
export default ThemePicker;
*//*
const ThemePicker = ({ theme, setTheme }) => {
  if (theme) {
    return (
      <div>
        {myThemes.map((item, index) => {
          {/* const nextTheme = myThemes.length -1 === index ? myThemes[0].id : myThemes[index+1].id; *\/}
          {/* return item.id === theme ? ( /}
          item.id === theme ? (
            <div key={item.id} className={`theme-${item.id}`}>
              <button
                aria-label={`Theme ${item.name}`}
                // onClick={() => setTheme(nextTheme)}
                onClick={() => setTheme(`theme-${item.id}`)}
              >
                {item.name}
              </button>
            </div>
          ) : null;
        })}
      </div>
    );
  }
  return null;
};
*/