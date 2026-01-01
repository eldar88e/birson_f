export interface User {
  id: number;
  email: string;
  full_name: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  additional_phone: string;
  company_name: string;
  inn: string;
  kpp: string;
  ogrn: string;
  legal_address: string;
  actual_address: string;
  contact_person: string;
  contact_phone: string;
  bank_name: string;
  bik: string;
  checking_account: string;
  correspondent_account: string;
  source: string;
  comment: string | null;
  active: boolean;
  role: string;
  created_at: string;
}
