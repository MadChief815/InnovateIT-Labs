import { create } from 'zustand';

// Represents a basic loan structure associated with a customer
interface Loan {
  loan_id: number;
  loan_type: string;
  loan_amount: number;
  pending_loan: number;
  loan_status: string;
}

// Represents details for a single repayment made towards a loan
interface Repayment {
  repayment_amount: string;
  interest_amount: string;
  repayment_type: string;
  repayment_date: string;
  comments: string;
}

// Represents detailed information about a specific loan including repayment history
interface LoanInfoProps {
  loan_id: number;
  loan_amount: number;
  loan_type: string;
  repayment_amount: number;
  repayment_frequency: number;
  number_of_installments: number;
  lending_date: string;
  no_of_repayments_paid: number;
  total_amount_paid: number;
  total_principle_paid: number;
  pre_charges: number;
  rate_of_interest: number;
  repayments: Repayment[];
}

// Represents a customer data and their associated loans
interface Customer {
  customer_id: number;
  customer_name: string;
  customer_mobile_number: string;
  alternate_mobile_number: string;
  aadhar_number: string;
  pan_number: string;
  address: string;
  is_missing_customer: boolean;
  loans: Loan[];
}

// Zustand store
interface Store {
  customer: Customer | null; // customer data
  setCustomer: (customerData: Customer) => void;
  dataChanged: boolean; // Flag to determine if customer data has changed
  setDataChanged: (value: boolean) => void;
  firstView: boolean; // Flag to detect first time viewing the screen
  setFirstView: (value: boolean) => void;
  loanDetails: LoanInfoProps | null; // Detailed loan info for a selected loan
  setLoanDetails: (loan: LoanInfoProps) => void;
  LoanInfoView: boolean; // Flag to indicate if the Loan Info screen is being viewed for the first time
  setLoanInfoView: (value: boolean) => void;
}

// Zustand global store configuration
const useStore = create<Store>((set) => ({
  customer: null,
  setCustomer: (customerData) => set({ customer: customerData }),
  dataChanged: false,
  setDataChanged: (value) => set({ dataChanged: value }),
  firstView: true,
  setFirstView: (value) => set({ firstView: value }),
  LoanInfoView: true,
  setLoanInfoView: (value) => set({ LoanInfoView: value }),
  loanDetails: null,
  setLoanDetails: (loan) => set({ loanDetails: loan }),
}));

export default useStore;