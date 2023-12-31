import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {
  AUTH_USER_EXISTS,
  AUTH_USER_PASSWORD_WRONG,
  SIGN_IN_USER_ERROR,
} from './auth-user.constant';
import { PublicUserEntity } from '../public-user/public-user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AddonRepositoryInterface } from '@project/shared/core';
import { PublicUserRepositoryToken } from '../public-user/public-user.token';

@Injectable()
export class AuthUserService {
  constructor(
    @Inject(PublicUserRepositoryToken)
    private readonly publicUserRepository: AddonRepositoryInterface<PublicUserEntity>
  ) {}

  /**
   * Проверяет, существует ли пользователь перед его регистрацией
   * В случае успеха возвращает сущность "Пользователь"
   */
  public async register(dto: CreateUserDto) {
    const { email, name, password } = dto;

    const publicUser = { email, name, avatar: '', passwordHash: '' };

    const existUser = await this.publicUserRepository.findByEmail(email);

    if (existUser) {
      throw new ConflictException(AUTH_USER_EXISTS);
    }

    const userEntity = await new PublicUserEntity(publicUser).setPassword(
      password
    );

    return this.publicUserRepository.save(userEntity);
  }

  /**
   * Проверяет существование пользователя по логину и паролю
   * В случае успеха возвращает информацию о пользователе
   */
  public async verifyUser(dto: LoginUserDto) {
    const { email, password } = dto;

    const existUser = await this.publicUserRepository.findByEmail(email);

    if (!existUser || !(await existUser.comparePassword(password))) {
      throw new UnauthorizedException(SIGN_IN_USER_ERROR);
    }

    return existUser.toPOJO();
  }

  /**
   * Возвращает информацию о пользователю по ID
   */
  public async getUser(id: string) {
    const existUser = await this.publicUserRepository.findById(id);

    if (!existUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return existUser;
  }

  /**
   * Возвращает сущность "User" при успешной смене пароля пользователя
   */
  public async changePassword(id: string, dto: ChangePasswordDto) {
    const { oldPassword, newPassword } = dto;
    const existUser = await this.publicUserRepository.findById(id);

    if (!(await existUser.comparePassword(oldPassword))) {
      throw new ConflictException(AUTH_USER_PASSWORD_WRONG);
    }

    const userEntity = await new PublicUserEntity(existUser).setPassword(
      newPassword
    );

    return this.publicUserRepository.update(id, userEntity);
  }
}
