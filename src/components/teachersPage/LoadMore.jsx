import s from "./LoadMore.module.css";

const LoadMore = ({ onClick, disabled = false, isLoading = false }) => {
  return (
    <div className={s.loadMoreContainer}>
      <button
        className={s.loadMoreButton}
        onClick={onClick}
        disabled={disabled || isLoading}
      >
        {isLoading ? "Loading..." : "Load more"}
      </button>
    </div>
  );
};

export default LoadMore;
