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
    id: "leaf",
    name: "Leaf",
    type: "dark",
    unlocked: true
  },
  {
    id: "bee",
    name: "Bee",
    type: "dark",
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