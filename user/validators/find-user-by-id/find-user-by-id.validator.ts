import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserRepoService } from '../../services/user-repo/user-repo.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true, name: 'findUserById' })
@Injectable()
export class FindUserByIdValidator implements ValidatorConstraintInterface {
  constructor(private userRepo: UserRepoService) {}
  validate(id: number): Promise<boolean> | boolean {
    if (id == null) {
      return true;
    }
    return this.userRepo.findOrFail(id).then((result) => !!result);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `User with id ${validationArguments.value} not exist`;
  }
}

export function findUserById(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      propertyName,
      target: object.constructor,
      constraints: [],
      options: validationOptions,
      validator: FindUserByIdValidator,
    });
  };
}
