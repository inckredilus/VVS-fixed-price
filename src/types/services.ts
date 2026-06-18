export type Pricing = {
  fullPrice: number;
  discountPrice: number;
};

export type Service = {
  serviceId: number;
  category: string;
  serviceName: string;
  equipment: string;
  work: string;
  pricing: Pricing;
};

export type NavigationLeaf = string;

export type NavigationLevel = {
  [key: string]: NavigationLevel | NavigationLeaf;
};

export type ServicesJson = {
  navigation: NavigationLevel;
  services: Record<string, Service>;
  navigationDescriptions: Record<string, string>;
};

export type CartItem = {
  service: Service;
  quantity: number;
  useRotDeduction: boolean;
};

export type CustomerDetails = {
  firstName: string;
  lastName: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  comment: string;
};