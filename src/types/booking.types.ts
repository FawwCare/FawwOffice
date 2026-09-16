export type ServiceType = '근골격케어' | '요가/명상' | '멘탈코치';

export interface BookingFormData {
  name: string;
  phone: string;
  companyName: string;
  email?: string;
  serviceType: ServiceType;
  preferredDate: string;
  preferredTime: string;
  message?: string;
}

export interface BookingEmailPayload extends BookingFormData {
  submittedAt: string;
}
