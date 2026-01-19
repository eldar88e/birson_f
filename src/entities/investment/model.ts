export interface Investment {
  id: number;
  comment: string;
  amount: number;
  invested_at: string;
  user_id?: number;
  user?: string;
  created_at: string;
}