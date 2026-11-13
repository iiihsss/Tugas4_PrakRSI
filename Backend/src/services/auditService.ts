import { AuditRepository, type CreateAuditInput } from '../repositories/auditRepository.ts';
import type { AuditResponseDto } from '../dtos/auditDto.ts';

type AuditRow = NonNullable<Awaited<ReturnType<AuditRepository['findById']>>>;

export class AuditService {
  private auditRepository: AuditRepository;

  constructor(auditRepository: AuditRepository = new AuditRepository()) {
    this.auditRepository = auditRepository;
  }

  private toDto(row: AuditRow): AuditResponseDto {
    return {
      id: row.id,
      userId: row.userId,
      action: row.action,
      targetTable: row.targetTable,
      targetId: row.targetId,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.createdAt!,
    };
  }

  async getAllAuditLogs(): Promise<AuditResponseDto[]> {
    const rows = await this.auditRepository.findAll();
    return rows.map((row) => this.toDto(row));
  }

  async createAuditLog(input: CreateAuditInput): Promise<AuditResponseDto> {
    const row = await this.auditRepository.create(input);
    if (!row) throw new Error('AUDIT_CREATION_FAILED');
    return this.toDto(row);
  }
}