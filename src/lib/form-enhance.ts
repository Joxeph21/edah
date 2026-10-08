// Form enhancement utilities
export function enhance(form: HTMLFormElement) {
  // Add native validation styling
  form.addEventListener("invalid", (e) => {
    const target = e.target as HTMLInputElement;
    target.classList.add("input-error");
  }, true);
  
  // Clear errors on input
  form.addEventListener("input", (e) => {
    const target = e.target as HTMLInputElement;
    if (target.classList.contains("input-error")) {
      target.classList.remove("input-error");
      const errorMsg = target.parentNode?.querySelector(".error-message");
      errorMsg?.remove();
    }
  });
}