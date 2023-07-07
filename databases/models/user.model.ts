import { AfterCreate, Column, Table, Unique } from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { ApiProperty } from '@nestjs/swagger';
import {
  ModelCreatedEvent,
  SystemEvents,
} from '../../system-events/system-events';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateOptions } from 'sequelize';

@Table({ tableName: 'users' })
export class UserModel
  extends BaseModel<UserModel>
  implements ModelCreatedEvent<UserModel>
{
  /**
   * @inheritDoc
   * @protected
   */
  protected convertToInt = true;

  public static eventEmitter: EventEmitter2 | null = null;

  @ApiProperty()
  @Unique
  @Column
  public email: string;

  @ApiProperty()
  @Column
  public name: string;

  @ApiProperty()
  @Column
  public verified_at: Date | null;

  @Column
  public password: string | null;

  /**
   * Triggers model created event.
   * If within transaction then triggers after transaction is committed else immediately
   * @param user
   * @param options
   */
  @AfterCreate
  static triggerModelCreatedEvent(
    user: UserModel,
    options: CreateOptions,
  ): void {
    console.log('ye ia m hitting');
    const [event, payload] = user.modelCreatedEvent();
    // checking if transaction, if so then triggering event after transaction is complete
    if (!!options.transaction) {
      options.transaction.afterCommit(() => {
        this.eventEmitter?.emit(event, payload);
      });
      return;
    }

    this.eventEmitter?.emit(event, payload);
  }

  public toJSON(): any {
    const content = super.toJSON() as Record<keyof UserModel, any>;
    delete content.password;
    return content;
  }

  /**
   * Triggers model created event
   */
  public modelCreatedEvent(): [SystemEvents, UserModel] {
    return [SystemEvents.UserModelCreated, this];
  }
}
