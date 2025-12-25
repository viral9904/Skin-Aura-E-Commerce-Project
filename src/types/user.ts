
export type UserRole = 'user' | 'admin';

export type Address = {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  isDefault?: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  addresses?: Address[];
};

export type UserProfile = User & {
  phoneNumber?: string;
  defaultAddress?: Address;
};
