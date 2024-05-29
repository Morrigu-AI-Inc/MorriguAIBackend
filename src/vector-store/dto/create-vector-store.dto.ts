export class CreateVectorStoreDto {
  readonly name: string;

  readonly file_ids: string[];

  readonly status: 'processing' | 'completed';

  readonly expires_after?: Date;

  readonly attached_assistants?: string[];

  readonly attached_threads?: string[];
}
