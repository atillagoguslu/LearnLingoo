import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registrationSchema } from "../../utilities/validations";
import s from "./registration.module.css";
import { signUp } from "../../db/auth";

const RegistrationModal = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registrationSchema),
    mode: "onBlur",
  });

  const [formError, setFormError] = useState("");

  const onSubmit = async (data) => {
    setFormError("");
    try {
      await signUp(data.name, data.email, data.password);
      onClose?.();
    } catch (e) {
      const message = e?.message || "Failed to sign up. Please try again.";
      setFormError(message);
    }
  };

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleBackdropMouseDown = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div className={s.modalOverlay} onMouseDown={handleBackdropMouseDown}>
      <div className={s.modalDialog} role="dialog" aria-modal="true">
        <button
          type="button"
          className={s.modalClose}
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>
        <div className={s.registrationContainer}>
          <div className={s.registrationContent}>
            <div className={s.registrationHeader}>
              <h1 className={s.registrationTitle}>Registration</h1>
              <p className={s.registrationDescription}>
                Thank you for your interest in our platform! In order to
                register, we need some information. Please provide us with the
                following information
              </p>
            </div>

            <div className={s.registrationFormContainer}>
              <form
                className={s.form}
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                {formError && <p className={s.errorText}>{formError}</p>}
                <div className={s.formGroup}>
                  <input
                    id="name"
                    type="text"
                    className={s.input}
                    placeholder="Name"
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
                    placeholder="E-Mail"
                    autoComplete="email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className={s.errorText}>{errors.email.message}</p>
                  )}
                </div>

                <div className={s.formGroup}>
                  <input
                    id="password"
                    type="password"
                    className={s.input}
                    placeholder="Password"
                    autoComplete="new-password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className={s.errorText}>{errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className={s.registrationButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing up..." : "Sign Up"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
