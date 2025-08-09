import s from "./Card.module.css";

const Card = () => {
  return (
    <div className={s.cardContainer}>
      <div className={s.cardImageContainer}>
        {/* <img src={} alt="card" /> */}
      </div>
      <div className={s.cardInfoContainer}>
        <h1>Card</h1>
      </div>
    </div>
  );
};

export default Card;
