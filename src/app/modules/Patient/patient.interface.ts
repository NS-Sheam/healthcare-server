export type IPatientFilterRequest = {
  name?: string | undefined;
  email?: string | undefined;
  contactNumber?: string | undefined;
  searchTerm?: string | undefined;
  specialties?: string | undefined;
  gender?: string | undefined;
  appointmentFee?: number | undefined;
};
