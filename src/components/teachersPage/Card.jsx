import { useEffect, useMemo, useState, useCallback } from "react";
import s from "./Card.module.css";
import BookTrialLesson from "./BookTrialLesson";
import modalStyles from "./BookTrialLesson.module.css";
import {
  fav as favIcon,
  notFav as notFavIcon,
  online as onlineIcon,
  star as starIcon,
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
    <>
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
                      <li>Lessons done: {lessonsDone}</li>
                      <li>
                        <img src={starIcon} alt="star" />
                        Rating: {rating}
                      </li>
                      <li>
                        Price / 1 hour: <span className={s.price}>{price}</span>
                      </li>
                    </ul>
                  </div>
                  <div className={s.favButton} onClick={toggleFavorite}>
                    <img
                      src={isFavorite ? favIcon : notFavIcon}
                      alt="favorite"
                    />
                  </div>
                </div>
              </div>
              <div className={s.attributes}>
                <p>
                  <span className={s.attributesTitle}>Speaks:</span>{" "}
                  <span className={s.languages}>{languages}</span>
                </p>
                <p>
                  <span className={s.attributesTitle}>Lesson Info:</span>{" "}
                  {lessonInfo}
                </p>
                <p>
                  <span className={s.attributesTitle}>Conditions:</span>{" "}
                  {conditions}
                </p>
              </div>
            </div>
            {!isExpanded && (
              <div className={s.bottomRowLevels}>
                {levels.map((level) => (
                  <div className={s.level} key={level}>
                    <p>{level}</p>
                  </div>
                ))}
              </div>
            )}
            {!isExpanded && (
              <div className={s.readMore} onClick={() => setIsExpanded(true)}>
                <p>Read more</p>
              </div>
            )}
          </div>
          {isExpanded && (
            <div className={s.expanded}>
              {experience && <p className={s.experience}>{experience}</p>}
              <div className={s.reviewsContainer}>
                {Array.isArray(reviews) && reviews.length > 0 && (
                  <div className={s.reviews}>
                    {reviews.map((review, index) => {
                      const reviewerName = review.reviewer_name;
                      const reviewerAvatar = review.reviewer_name.charAt(0);
                      const reviewerRating = review.reviewer_rating;
                      const comment = review.comment;
                      return (
                        <div key={index} className={s.reviewItem}>
                          <div className={s.reviewHeader}>
                            <div className={s.reviewAvatar}>
                              {reviewerAvatar}
                            </div>
                            <div className={s.reviewMeta}>
                              <span className={s.reviewName}>
                                {reviewerName}
                              </span>
                              {Number.isFinite(Number(reviewerRating)) && (
                                <div className={s.reviewRating}>
                                  <img
                                    src={starIcon}
                                    alt="star"
                                    className={s.reviewStar}
                                  />
                                  <span className={s.reviewRatingValue}>
                                    {reviewerRating.toFixed(1)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          {comment && (
                            <p className={s.reviewComment}>{comment}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className={s.bottomRowLevels}>
                {levels.map((level) => (
                  <div className={s.level} key={level}>
                    <p>{level}</p>
                  </div>
                ))}
              </div>
              <div>
                <button
                  type="button"
                  className={s.bookButton}
                  onClick={() => setIsModalOpen(true)}
                >
                  Book trial lesson
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsModalOpen(false)}
          className={modalStyles.modalOverlay}
        >
          <div
            className={modalStyles.modalDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close"
              className={modalStyles.modalClose}
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <BookTrialLesson />
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
