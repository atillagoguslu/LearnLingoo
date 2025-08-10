import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { bookTrialLessonSchema } from "../../utilities/validations";
import s from "./BookTrialLesson.module.css";

const REASONS = [
  { value: "career", label: "Career and business" },
  { value: "kids", label: "Lesson for kids" },
  { value: "abroad", label: "Living abroad" },
  { value: "exams", label: "Exams and coursework" },
  { value: "culture", label: "Culture, travel or hobby" },
];

const BookTrialLesson = ({ teacher, onClose }) => {
  const fullName = useMemo(() => {
    if (!teacher) return "";
    const first = teacher.name || "";
    const last = teacher.surname || "";
    return `${first} ${last}`.trim();
  }, [teacher]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(bookTrialLessonSchema),
    mode: "onBlur",
    defaultValues: {
      reason: "career",
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      teacherId: teacher?.id ?? null,
    };
    // TODO: send booking request to backend/Firebase
    // eslint-disable-next-line no-console
    console.log("Book trial lesson:", payload);
    onClose?.();
  };

  return (
    <div className={s.bookTrialLessonContainer}>
      <div className={s.bookTrialLessonContent}>
        <div className={s.headerSection}>
          <h1 className={s.title}>Book trial lesson</h1>
          <p className={s.description}>
            Our experienced tutor will assess your current language level,
            discuss your learning goals, and tailor the lesson to your specific
            needs.
          </p>
          {teacher && (
            <div className={s.teacherRow}>
              <img
                className={s.teacherAvatar}
                src={teacher.avatarUrl}
                alt={`${fullName} avatar`}
              />
              <div className={s.teacherMeta}>
                <span className={s.teacherMetaLabel}>Your teacher</span>
                <span className={s.teacherName}>{fullName}</span>
              </div>
            </div>
          )}
        </div>

        <form className={s.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <fieldset className={s.fieldset}>
            <legend className={s.legend}>
              What is your main reason for learning English?
            </legend>
            <div className={s.radioGroup}>
              {REASONS.map((item) => (
                <label key={item.value} className={s.radioOption}>
                  <input
                    type="radio"
                    value={item.value}
                    className={s.radioInput}
                    {...register("reason")}
                  />
                  <span className={s.radioLabel}>{item.label}</span>
                </label>
              ))}
            </div>
            {errors.reason && (
              <p className={s.errorText}>{errors.reason.message}</p>
            )}
          </fieldset>

          <div className={s.formGroup}>
            <input
              id="fullName"
              type="text"
              className={s.input}
              placeholder="Full Name"
              autoComplete="name"
              {...register("name")}
            />
            {errors.name && (
              <p className={s.errorText}>{errors.name.message}</p>
            )}
          </div>

          <div className={s.formGroup}>
            <input
              id="email"
              type="email"
              className={s.input}
              placeholder="Email"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className={s.errorText}>{errors.email.message}</p>
            )}
          </div>

          <div className={s.formGroup}>
            <input
              id="phone"
              type="tel"
              className={s.input}
              placeholder="Phone number"
              autoComplete="tel"
              {...register("phone")}
            />
            {errors.phone && (
              <p className={s.errorText}>{errors.phone.message}</p>
            )}
          </div>

          <button
            type="submit"
            className={s.bookButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Booking..." : "Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookTrialLesson;
