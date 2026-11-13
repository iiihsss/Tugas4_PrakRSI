export interface CreateAuditInput {
  userId: number;
  action: string;
  targetTable: string;
  targetId: number;
  metadata?: string | null; // Bisa berupa JSON string
}

export interface AuditResponseDto {
  id: number;
  userId: number;
  action: string;
  targetTable: string;
  targetId: number;
  metadata: any | null; // Objek hasil parse JSON string
  createdAt: Date;
}