import { UserRepository, type CreateUserInput } from '../repositories/userRepository.ts';
import type { UserResponseDto } from '../dtos/userDto.ts';

type UserRow = NonNullable<Awaited<ReturnType<UserRepository['findById']>>>;

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  private toDto(row: UserRow): UserResponseDto {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      createdAt: row.createdAt!,
    };
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const rows = await this.userRepository.findAll();
    return rows.map((row) => this.toDto(row));
  }

  async createUser(input: CreateUserInput): Promise<UserResponseDto> {
    const row = await this.userRepository.create(input);
    if (!row) throw new Error('USER_CREATION_FAILED');
    return this.toDto(row);
  }
}