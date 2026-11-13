import { z } from 'zod';

const passwordSchema = z
  .string({ required_error: 'password wajib diisi', invalid_type_error: 'password harus berupa teks' })
  .min(8, 'password minimal 8 karakter')
  .max(72, 'password maksimal 72 karakter');

const emailSchema = z
  .string({ required_error: 'email wajib diisi', invalid_type_error: 'email harus berupa teks' })
  .trim()
  .toLowerCase()
  .email('format email tidak valid')
  .max(150, 'email maksimal 150 karakter');

export const registerSchema = z
  .object({
    name: z
      .string({ required_error: 'name wajib diisi', invalid_type_error: 'name harus berupa teks' })
      .trim()
      .min(3, 'name minimal 3 karakter')
      .max(100, 'name maksimal 100 karakter'),
    email: emailSchema,
    password: passwordSchema,
    role: z
      .enum(['admin', 'owner', 'customer'], {
        invalid_type_error: 'role harus bernilai admin, owner, atau customer',
      })
      .optional()
      .default('customer'),
  })
  .strict({ message: 'body hanya boleh berisi name, email, password, dan role' });

export const loginSchema = z
  .object({
    email: emailSchema,
    password: z
      .string({ required_error: 'password wajib diisi', invalid_type_error: 'password harus berupa teks' })
      .min(1, 'password wajib diisi'),
  })
  .strict({ message: 'body hanya boleh berisi email dan password' });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;