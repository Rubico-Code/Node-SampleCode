import { Injectable } from '@nestjs/common';
import { UserModel } from '../../../databases/models/user.model';
import { EmptyResultError, Transaction } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { HashEncryptService } from '../../../auth/services/hash-encrypt/hash-encrypt.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UserRepoService {
  constructor(
    @InjectModel(UserModel) public userModel: typeof UserModel,
    private hashService: HashEncryptService,
    private eventEmitter: EventEmitter2,
  ) {
    this.userModel.eventEmitter = eventEmitter;
  }

  /**
   * Find by email or returns null when not not found
   * @param email
   * @param transaction
   */
  public findByEmail(
    email: string,
    transaction?: Transaction,
  ): Promise<UserModel | null> {
    return this.userModel
      .findOne({ where: { email }, transaction })
      .then((result) => (!!result ? result : null));
  }

  /**
   * Find user by email or fail
   * @param email
   * @param transaction
   */
  public findByEmailOrFail(
    email: string,
    transaction?: Transaction,
  ): Promise<UserModel> {
    return this.findByEmail(email, transaction).then((result) => {
      if (!result) {
        throw new EmptyResultError();
      }
      return result;
    });
  }

  /**
   * Finds the user or fails
   * @param id
   * @param transaction
   */
  public findOrFail(id: number, transaction?: Transaction): Promise<UserModel> {
    return this.userModel.findByPk(id, { transaction, rejectOnEmpty: true });
  }

  /**
   * Creates a new user
   * @param data
   * @param transaction
   */
  public async create(
    data: Pick<UserModel, 'email' | 'password' | 'name'>,
    transaction?: Transaction,
  ): Promise<UserModel> {
    return await this.userModel
      .build()
      .setAttributes(data)
      .setAttributes({
        password: await this.hashService.createHash(data.password),
      })
      .save({ transaction });
  }

  /**
   * Updates password
   * @param user
   * @param newPassword
   * @param transaction
   */
  public async changePassword(
    user: UserModel,
    newPassword: string,
    transaction?: Transaction,
  ): Promise<UserModel> {
    return user
      .setAttributes({
        password: await this.hashService.createHash(newPassword),
      })
      .save({ transaction });
  }

  /**
   * Marks the user as verified
   * @param user
   * @param transaction
   */
  public markVerified(
    user: UserModel,
    transaction?: Transaction,
  ): Promise<UserModel> {
    return user
      .setAttributes({
        verified_at: new Date(),
      })
      .save({ transaction });
  }
}
