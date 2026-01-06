export interface Contactor {
  id: number;
  name: string;
  entity_type: string;
  email?: string;
  phone?: string;
  inn?: string;
  kpp?: string;
  legal_address?: string;
  contact_person?: string;
  bank_name?: string;
  bik?: string;
  checking_account?: string;
  correspondent_account?: string;
  service_profile?: string;
  active: boolean;
  comment?: string;
}
