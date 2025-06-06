export interface BimFile {
  /**
   * EN: Unique identifier for the BIM file
   * PT: Identificador único para o arquivo BIM
   */
  id: string;
  
  /**
   * EN: Original filename as uploaded by the user
   * PT: Nome original do arquivo conforme enviado pelo usuário
   */
  originalFilename: string;
  
  /**
   * EN: File extension (e.g., dwg, rvt, ifc)
   * PT: Extensão do arquivo (ex: dwg, rvt, ifc)
   */
  fileExtension: string;
  
  /**
   * EN: Size of the file in bytes
   * PT: Tamanho do arquivo em bytes
   */
  fileSize: number;
  
  /**
   * EN: MIME content type
   * PT: Tipo de conteúdo MIME
   */
  contentType: string;
  
  /**
   * EN: Processing status of the file
   * PT: Status de processamento do arquivo
   */
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'UNSUPPORTED_FORMAT';
  
  /**
   * EN: Error message if processing failed
   * PT: Mensagem de erro se o processamento falhou
   */
  errorMessage?: string;
  
  /**
   * EN: Software that created the BIM file (if detected)
   * PT: Software que criou o arquivo BIM (se detectado)
   */
  sourceSoftware?: string;
  
  /**
   * EN: Project ID this file belongs to
   * PT: ID do projeto ao qual este arquivo pertence
   */
  projectId: string;
  
  /**
   * EN: Date when the file was uploaded
   * PT: Data em que o arquivo foi enviado
   */
  uploadedAt: string;
  
  /**
   * EN: Date when the file was processed
   * PT: Data em que o arquivo foi processado
   */
  processedAt?: string;
}

export interface BimProcessingStats {
  /**
   * EN: Total number of BIM files
   * PT: Número total de arquivos BIM
   */
  total: number;
  
  /**
   * EN: Number of pending files
   * PT: Número de arquivos pendentes
   */
  pending: number;
  
  /**
   * EN: Number of files currently being processed
   * PT: Número de arquivos sendo processados atualmente
   */
  processing: number;
  
  /**
   * EN: Number of successfully processed files
   * PT: Número de arquivos processados com sucesso
   */
  completed: number;
  
  /**
   * EN: Number of files that failed processing
   * PT: Número de arquivos que falharam no processamento
   */
  failed: number;
  
  /**
   * EN: Number of files with unsupported formats
   * PT: Número de arquivos com formatos não suportados
   */
  unsupported: number;
}

export interface BimErrorDetail {
  /**
   * EN: File ID of the failed file
   * PT: ID do arquivo que falhou
   */
  id: string;
  
  /**
   * EN: Original filename
   * PT: Nome original do arquivo
   */
  originalFilename: string;
  
  /**
   * EN: File extension
   * PT: Extensão do arquivo
   */
  fileExtension: string;
  
  /**
   * EN: Error message
   * PT: Mensagem de erro
   */
  errorMessage: string;
  
  /**
   * EN: Date when the error occurred
   * PT: Data em que o erro ocorreu
   */
  errorDate: string;
}
