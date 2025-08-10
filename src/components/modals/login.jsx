import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../utilities/validations";
import s from "./login.module.css";
import { signIn } from "../../db/auth";

const LoginModal = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
  });

  const [formError, setFormError] = useState("");

  const onSubmit = async (data) => {
    setFormError("");
    try {
      await signIn(data.email, data.password);
      onClose?.();
    } catch (e) {
      const message = e?.message || "Failed to log in. Please try again.";
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
        <div className={s.loginContainer}>
          <div className={s.loginContent}>
            <div className={s.loginHeader}>
              <h1 className={s.loginTitle}>Log In</h1>
              <p className={s.loginDescription}>
                Welcome back! Please enter your credentials to access your
                account and continue your search for an teacher.
              </p>
            </div>
            <div className={s.loginFormContainer}>
              <form
                className={s.form}
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                {formError && <p className={s.errorText}>{formError}</p>}
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
                    autoComplete="current-password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className={s.errorText}>{errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className={s.loginButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Log In"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
