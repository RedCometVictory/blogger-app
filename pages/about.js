const creators = [
  {
    id: "1",
    name: "Jor-EL Sanchez",
    link: "https://github.com/RedCometVictory",
    title: "Project Lead / Lead Back-End & Front-End Developer",
    text: "Solo developed the back-end API for the Zuit blog. Created most of the logic used client-side, including the authorization and authentication implemented by the site. I had a hand in the creation of the UI - creating themes and worked to make all pages fully responsive. I also had a hand in creating pages. I would say my favorite part of developing the front-end was implementing the editor used to build blog posts."
  },
  {
    id: "2",
    name: "Tony (aka techtony92)",
    link: "https://github.com/techtony92",
    title: "Front End Developer",
    text: "Converted the base HTML and CSS template files into base React and SASS files. Helped create UI."
  },
  {
    id: "3",
    name: "Tavon G",
    link: "https://github.com/iamyourdeveloper",
    title: "Front End Developer",
    text: "Created the base CSS template for the Zuit blog. Picked base colors."
  },
  {
    id: "4",
    name: "Siyabonga Shabangu",
    link: "https://github.com/brotherSI",
    title: "Front End Developer",
    text: "Created the HTML templates to be used in the creation of Zuit blog."
  },
];
const About = () => {
  return (
    <section className="about">
      <h2 className="about__intro">About the Creators</h2>
      <div className="about__container">
        {creators.map((creator, index) => (
          <div className="about__card" key={index}>
            <div className="about__header">
              <h2 className="about__name">
                <a href={creator.link} target="_blank" rel="noopener noreferrer">
                  {creator.name}
                </a>
              </h2>
              <h4 className="about__title">
                {creator.title}
              </h4>
            </div>
            <div className="about__content">
              <div className="about__text">
                {creator.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default About;