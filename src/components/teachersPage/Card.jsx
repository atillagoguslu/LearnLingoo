import { useEffect, useMemo, useState, useCallback } from "react";
import s from "./Card.module.css";
import BookTrialLesson from "./BookTrialLesson";
import {
  fav as favIcon,
  notFav as notFavIcon,
  online as onlineIcon,
  star as starIcon,
  avatar as defaultAvatar,
  book as bookIcon,
} from "../../constants/ImportedImages";
import {
  loadJson,
  saveJson,
  loadAuthSession,
} from "../../utilities/localStorage";

const FAVORITES_KEY = "learnlingo.favorites.v1";

function joinWithComma(values) {
  if (!values) return "";
  if (Array.isArray(values)) return values.filter(Boolean).join(", ");
  if (typeof values === "object")
    return Object.values(values).filter(Boolean).join(", ");
  return String(values);
}

function getPrice(teacher) {
  const value = teacher.price_per_hour ?? teacher.pricePerHour ?? teacher.price;
  const number = Number(value);
  return Number.isFinite(number) ? `${number}$` : String(value ?? "");
}

function getLanguages(teacher) {
  return joinWithComma(teacher.languages ?? teacher.language ?? []);
}

function getLevels(teacher) {
  const list = teacher.levels ?? teacher.level ?? [];
  if (Array.isArray(list)) return list;
  if (typeof list === "object" && list) return Object.values(list);
  if (typeof list === "string") return [list];
  return [];
}

function loadFavorites() {
  const set = new Set(loadJson(FAVORITES_KEY, []));
  return set;
}

function saveFavorites(set) {
  saveJson(FAVORITES_KEY, Array.from(set));
}

const Card = (props) => {
  const {
    id,
    avatar_url: avatarUrl,
    name = "",
    surname = "",
    lessons_done: lessonsDone,
    rating,
    lesson_info: lessonInfo,
    conditions = [],
    experience = "",
    reviews = [],
  } = props;

  const fullName = useMemo(() => `${name} ${surname}`.trim(), [name, surname]);
  const languages = useMemo(() => getLanguages(props), [props]);
  const levels = useMemo(() => getLevels(props), [props]);
  const price = useMemo(() => getPrice(props), [props]);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize favorite state from localStorage
  useEffect(() => {
    const favorites = loadFavorites();
    setIsFavorite(favorites.has(String(id)) || favorites.has(Number(id)));
  }, [id]);

  const toggleFavorite = useCallback(() => {
    const session = loadAuthSession();
    if (!session) {
      // No auth: notify
      window.alert("Only authorized users can add to favorites.");
      return;
    }
    const favorites = loadFavorites();
    const key = String(id);
    if (favorites.has(key)) {
      favorites.delete(key);
      setIsFavorite(false);
    } else {
      favorites.add(key);
      setIsFavorite(true);
    }
    saveFavorites(favorites);
  }, [id]);

  // Modal ESC close
  useEffect(() => {
    if (!isModalOpen) return undefined;
    const handleKey = (e) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isModalOpen]);

  return (
    <div className={s.cardContainer}>
      <div className={s.avatarColumn}>
        <div className={s.avatarBox}>
          <img
            className={s.avatarImg}
            src={avatarUrl || defaultAvatar}
            alt={`${fullName} avatar`}
            loading="lazy"
          />
          <img className={s.onlineDot} src={onlineIcon} alt="online" />
        </div>
      </div>

      <div className={s.contentColumn}>
        <div className={s.topRow}>
          <div className={s.topRowTop}>
            <div className={s.nameAndStatus}>
              <div className={s.name}>
                <p>Languages</p>
                <p>{fullName}</p>
              </div>
              <div className={s.status}>
                <div className={s.infos}>
                  <ul>
                    <li>
                      <img src={bookIcon} alt="book" />
                      <p>Lessons online</p>
                    </li>
                    <li>
                      Lessons done: {lessonsDone}
                    </li>
                    <li>
                      <img src={starIcon} alt="star" />
                      Rating: {rating}
                    </li>
                    <li>Price / 1 hour: <span className={s.price}>{price}</span></li>
                  </ul>
                </div>
                <div className={s.favButton}>
                  <img src={isFavorite ? favIcon : notFavIcon} alt="favorite" />
                </div>
              </div>
            </div>
            <div className={s.attributes}>
              <p>
                <span className={s.attributesTitle}>Speaks:</span> <span className={s.languages}>{languages}</span>
              </p>
              <p>
                <span className={s.attributesTitle}>Lesson Info:</span> {lessonInfo}
              </p>
              <p>
                <span className={s.attributesTitle}>Conditions:</span> {conditions}
              </p>
            </div>
          </div>
          <div className={s.readMore}>
            <p>Read more</p>
          </div>
        </div>
        <div className={s.bottomRowLevels}>
          {levels.map((level) => (
            <div className={s.level} key={level}>
              <p>{level}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
