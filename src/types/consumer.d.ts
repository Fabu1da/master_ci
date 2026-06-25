export interface PostCreatedEvent {
  id: string | number;
  title: string;
  createdBy: string | number;
  createdAt?: string;
}