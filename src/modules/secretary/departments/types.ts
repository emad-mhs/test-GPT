export enum departmentsMain {
  SECRETARY = '816d428b-deeb-4740-b0f9-12b4d1efcb1b',
  MINISTER = '21955e00-4961-40dc-ad2c-efbaf962eddd',
  // VICE_MINISTER = 'النائب',
  // DEPUTY_MINISTER_1 = 'وكيل قطاع التجارة الخارجية وتنمية الصادرات',
  // DEPUTY_MINISTER_2 = 'وكيل فطاع التجارة الداخلية',
  // DEPUTY_MINISTER_3 = 'وكيل قطاع الصناعة',
  // DEPUTY_MINISTER_4 = 'وكيل قطاع خدمات الأعمال',
}

export interface Department {
  id: string;
  rank: string;
  name: string;
  manager: string | null;
  email: string | null;
  phone: string | null;
}

export interface DepartmentOption {
  value: string;
  label: string;
}
