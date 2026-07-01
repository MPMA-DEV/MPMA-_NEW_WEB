import { useState, useCallback } from "react";
import { z } from "zod";

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => void | Promise<void>;
  mode?: "onChange" | "onBlur" | "onSubmit"; // Add validation mode
  reValidateMode?: "onChange" | "onBlur"; // Re-validation mode after first error
}

export function useFormValidation<T>({
  schema,
  onSubmit,
  mode = "onSubmit",
  reValidateMode = "onChange",
}: UseFormValidationOptions<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const validateField = useCallback(
    (fieldName: string, _value: unknown, fullData: unknown) => {
      try {
        // Validate the entire form data
        schema.parse(fullData);
        // Clear error for this field if validation passes
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.issues.find((err: z.ZodIssue) =>
            err.path.join(".") === fieldName
          );
          if (fieldError) {
            setErrors((prev) => ({
              ...prev,
              [fieldName]: fieldError.message,
            }));
            return false;
          } else {
            // Clear error if no error found for this field
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors[fieldName];
              return newErrors;
            });
            return true;
          }
        }
        return false;
      }
    },
    [schema]
  );

  const validateForm = useCallback(
    (data: unknown): data is T => {
      try {
        schema.parse(data);
        setErrors({});
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: Record<string, string> = {};
          error.issues.forEach((err: z.ZodIssue) => {
            const path = err.path.join(".");
            newErrors[path] = err.message;
          });
          setErrors(newErrors);
        }
        return false;
      }
    },
    [schema]
  );

  const handleFieldChange = useCallback(
    (fieldName: string, value: unknown, fullData: unknown) => {
      const shouldValidate =
        mode === "onChange" ||
        (touchedFields.has(fieldName) && reValidateMode === "onChange");

      if (shouldValidate) {
        validateField(fieldName, value, fullData);
      }
    },
    [mode, reValidateMode, touchedFields, validateField]
  );

  const handleFieldBlur = useCallback(
    (fieldName: string, value: unknown, fullData: unknown) => {
      setTouchedFields((prev) => new Set(prev).add(fieldName));

      const shouldValidate =
        mode === "onBlur" ||
        mode === "onChange" ||
        (touchedFields.has(fieldName) && reValidateMode === "onBlur");

      if (shouldValidate) {
        validateField(fieldName, value, fullData);
      }
    },
    [mode, reValidateMode, touchedFields, validateField]
  );

  const handleSubmit = async (data: unknown) => {
    if (!validateForm(data)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(data as T);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return errors[fieldName];
  };

  const clearErrors = () => {
    setErrors({});
    setTouchedFields(new Set());
  };

  const setFieldError = (fieldName: string, message: string) => {
    setErrors((prev) => ({ ...prev, [fieldName]: message }));
  };

  const clearFieldError = (fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  return {
    errors,
    isSubmitting,
    validate: validateForm,
    validateField,
    handleSubmit,
    handleFieldChange,
    handleFieldBlur,
    getFieldError,
    clearErrors,
    clearFieldError,
    setFieldError,
    touchedFields: Array.from(touchedFields),
  };
}
