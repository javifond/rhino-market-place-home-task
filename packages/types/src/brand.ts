export type BrandId = 'brand-a' | 'brand-b';

export type NavPosition = 'top' | 'side';

export interface NavConfig {
  position: NavPosition;
  brandId: BrandId;
}

export interface BrandConfig {
  id: BrandId;
  name: string;
  navPosition: NavPosition;
}
