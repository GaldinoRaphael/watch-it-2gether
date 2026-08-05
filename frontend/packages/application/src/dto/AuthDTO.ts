export interface AuthDTO {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
