export interface Event {
  id: number;
  title: string;
  starts_at: string;
  ends_at: string | null;
  eventable_type: string;
  eventable_id: number;
  kind: "primary" | "success" | "warning" | "danger";
  created_at?: string;
  updated_at?: string;
}
