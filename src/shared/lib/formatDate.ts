export const formatDate = (dateString: string) => {
  if (!dateString) return "—";

  return new Date(dateString).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
