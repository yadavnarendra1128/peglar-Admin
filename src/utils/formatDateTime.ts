// utils/formatDate.ts
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "-";

  const dt = new Date(dateString);

  // Format MM-DD-YY
  const month = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  const year = String(dt.getFullYear()).slice(-2);

  // Format HH:MM AM/PM
  let hours = dt.getHours();
  const minutes = String(dt.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
}
