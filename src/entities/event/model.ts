export interface Event {
  id: number;
  title: string;
  start_at: string;
  end_at: string;
  eventable_type: string;
  eventable_id: number;
  kind: "primary" | "success" | "warning" | "danger";
  created_at?: string;
  updated_at?: string;
}
