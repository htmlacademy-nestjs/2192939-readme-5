import { AuthUser } from '@project/shared/app/types';
import { SALT_ROUNDS } from './public-user.constant';
import { hash, genSalt, compare } from 'bcrypt';
import { Entity } from '@project/shared/core';

export class PublicUserEntity implements AuthUser, Entity<string> {
  public id?: string;
  public email!: string;
  public name!: string;
  public passwordHash!: string;

  constructor(user: AuthUser) {
    this.populate(user);
  }

  public toPOJO() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
    };
  }

  public populate(data: AuthUser): void {
    this.email = data.email;
    this.name = data.name;
  }

  public async setPassword(password: string): Promise<PublicUserEntity> {
    const salt = await genSalt(SALT_ROUNDS);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public async comparePassword(password: string): Promise<boolean> {
    return compare(password, this.passwordHash);
  }
}
