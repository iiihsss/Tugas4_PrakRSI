export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'owner' | 'customer';
}

export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}