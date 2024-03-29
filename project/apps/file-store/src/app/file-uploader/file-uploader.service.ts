import { FileStoreConfig } from '@project/shared/config/file-store';
import 'multer';
import { ConfigType } from '@nestjs/config';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ensureDir } from 'fs-extra';

import { join } from 'node:path';
import { writeFile } from 'node:fs/promises';
import dayjs from 'dayjs';
import { randomUUID } from 'node:crypto';
import { extension } from 'mime-types';
import { FileRepository } from './file.repository';
import { FileEntity } from './file.entity';
import { StoredFile } from '../../../../../libs/shared/app/types/src/lib/stored-file.interface';

@Injectable()
export class FileUploaderService {
  private readonly logger = new Logger(FileUploaderService.name);
  private readonly DATE_FORMAT = 'YYYY MM';

  constructor(
    @Inject(FileStoreConfig.KEY)
    private readonly config: ConfigType<typeof FileStoreConfig>,
    private readonly fileRepository: FileRepository
  ) {}

  private getUploadDirectoryPath(): string {
    return this.config.uploadDirectory;
  }

  private getDestinationFilePath(filename: string): string {
    return join(
      this.getUploadDirectoryPath(),
      this.getSubUploadDirectoryPath(),
      filename
    );
  }

  private getSubUploadDirectoryPath(): string {
    const [year, month] = dayjs().format(this.DATE_FORMAT).split(' ');
    return join(year, month);
  }

  public async writeFile(
    file: Express.Multer.File,
    type: string
  ): Promise<StoredFile> {
    try {
      const uploadDirectoryPath = this.getUploadDirectoryPath();
      const subDirectory = this.getSubUploadDirectoryPath();
      const fileExtension = extension(file.mimetype);

      const filename = `${randomUUID()}.${fileExtension}`;
      const path = this.getDestinationFilePath(`${type}/${filename}`);

      await ensureDir(join(uploadDirectoryPath, subDirectory, type));
      await writeFile(path, file.buffer);

      return {
        fileExtension,
        filename,
        path,
        subDirectory,
      };
    } catch (error) {
      this.logger.error(`Error while saving file: ${error.message}`);
      throw new Error(`Can't save file`);
    }
  }

  public async saveFile(
    file: Express.Multer.File,
    type: string
  ): Promise<FileEntity> {
    const storedFile = await this.writeFile(file, type);
    const fileEntity = FileEntity.fromObject({
      hashName: storedFile.filename,
      mimetype: file.mimetype,
      originalName: file.originalname,
      path: storedFile.path,
      size: file.size,
      subDirectory: storedFile.subDirectory,
    });

    return this.fileRepository.save(fileEntity);
  }

  public async getFile(fileId: string): Promise<FileEntity> {
    const existFile = await this.fileRepository.findById(fileId);

    if (!existFile) {
      throw new NotFoundException(`File with ${fileId} not found`);
    }
    return existFile;
  }
}
