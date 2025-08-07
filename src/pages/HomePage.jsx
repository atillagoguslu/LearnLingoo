import s from "./HomePage.module.css";
import HeroPart from "../components/homePage/heroPart";
import ImagePart from "../components/homePage/imagePart";
import StatsPart from "../components/homePage/statsPart";

const HomePage = () => {
  return (
    <div className={s.container}>
      <div className={s.heroPart}>
        <HeroPart />
        <ImagePart />
      </div>
      <StatsPart />
    </div>
  );
};

export default HomePage;
