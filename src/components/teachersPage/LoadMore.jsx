import s from "./LoadMore.module.css";

const LoadMore = ({ onClick, disabled = false, isLoading = false }) => {
  return (
    <div className={s.container}>
      <button
        className={s.button}
        onClick={onClick}
        disabled={disabled || isLoading}
      >
        {isLoading ? "Loading..." : "Load more"}
      </button>
    </div>
  );
};

export default LoadMore;
