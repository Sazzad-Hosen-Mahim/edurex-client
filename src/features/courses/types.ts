export interface Course {
  _id: string;
  title: string;
  price: number;
  description: string;
  thumbnailUrl: string;
  moduleCount: number;
  lectureCount: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
