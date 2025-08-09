import s from "./CardList.module.css";
import Card from "./Card.jsx";

const CardList = () => {
  return (
    <div className={s.cardListContainer}>
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
    </div>
  );
};

export default CardList;
