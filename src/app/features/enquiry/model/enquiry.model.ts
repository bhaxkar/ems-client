export interface Enquiry {
  id: number;
  title: string;
  message: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;

  isConverted: boolean;
  feedback?: string;
  enquiryDate: string;
  followUpDate?: string;

  createdAt: string;
  updatedAt: string;

  user: {
    id: number;
    name: string;
    email: string;
  };

  category: {
    id: number;
    name: string;
  };

  status: {
    id: number;
    name: string;
  };
}
