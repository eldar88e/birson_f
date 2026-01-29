const LOCALE = "ru-RU";
const FALLBACK = "—";

/**
 * Проверяет, что строка — валидная дата.
 */
function parseDate(value: string): Date | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value.trim());
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Склонение для русских существительных (1 минуту, 2 минуты, 5 минут).
 */
function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

/**
 * Форматирует дату для отображения (например: «29 января 2026 г.»).
 * @param dateString — ISO-строка или валидная дата
 * @param locale — локаль (по умолчанию ru-RU)
 * @returns Отформатированная строка или «—» при невалидной дате
 */
export function formatDate(
  dateString: string,
  locale: string = LOCALE
): string {
  const date = parseDate(dateString);
  if (!date) return FALLBACK;

  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Форматирует дату и время (например: «29 января 2026 г., 08:15»).
 */
export function formatDateTime(
  dateString: string,
  locale: string = LOCALE
): string {
  const date = parseDate(dateString);
  if (!date) return FALLBACK;

  return date.toLocaleString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Относительное время («только что», «5 мин назад», «2 часа назад», «3 дня назад»).
 * Для будущих дат возвращает «только что».
 */
export function timeAgo(dateString: string): string {
  const date = parseDate(dateString);
  if (!date) return "";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 1000 / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 0) return "только что";
  if (diffMinutes === 0) return "только что";
  if (diffMinutes < 60) {
    const word = plural(diffMinutes, "минуту", "минуты", "минут");
    return `${diffMinutes} ${word} назад`;
  }
  if (diffHours < 24) {
    const word = plural(diffHours, "час", "часа", "часов");
    return `${diffHours} ${word} назад`;
  }
  if (diffDays < 7) {
    const word = plural(diffDays, "день", "дня", "дней");
    return `${diffDays} ${word} назад`;
  }

  return formatDate(dateString);
}

/**
 * Проверяет, что активность была недавно (в пределах N минут).
 * Используется для индикатора «онлайн» в чатах.
 */
export function isRecentlyActive(
  dateString: string,
  withinMinutes: number = 5
): boolean {
  const date = parseDate(dateString);
  if (!date) return false;
  const diffMs = Date.now() - date.getTime();
  return diffMs >= 0 && diffMs <= withinMinutes * 60 * 1000;
}

/**
 * @deprecated Используйте {@link timeAgo}. Оставлено для обратной совместимости.
 */
export function minutesAgo(dateString: string): string {
  return timeAgo(dateString);
}
