export interface AddCompSchema {
    client_name: string
    status: string
    budget: number
    spend: number
}

export interface Company {
    id: number
    client_name: string
    status: string
    budget: number
    spend: number
}

export interface CompanyApiResponse {
  message: string;
  status: string;
}

export type CompanyFormMode = 'add' | 'edit';
