
export type EyeDetails = {
  sphere: string;
  cylinder: string;
  axis: string;
  add: string;
};

export type Patient = {
  id: string;
  date: string;
  name: string;
  mobile: string;
  rightEye: EyeDetails;
  leftEye: EyeDetails;
  framePrice: string;
  glassPrice: string;
  remarks: string;
};
