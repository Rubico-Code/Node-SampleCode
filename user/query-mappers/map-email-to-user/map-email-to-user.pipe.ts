import { Injectable, PipeTransform } from '@nestjs/common';
import { UserModel } from '../../../databases/models/user.model';
import { UserRepoService } from '../../services/user-repo/user-repo.service';

@Injectable()
export class MapEmailToUserPipe implements PipeTransform {
  constructor(private userRepo: UserRepoService) {}

  /**
   * Returns user mapped to email else fails
   * @param email
   */
  public async transform(email: string): Promise<UserModel> {
    return await this.userRepo.findByEmailOrFail(email);
  }
}
