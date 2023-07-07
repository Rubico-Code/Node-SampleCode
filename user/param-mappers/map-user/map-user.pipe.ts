import { Injectable, PipeTransform } from '@nestjs/common';
import { UserRepoService } from '../../services/user-repo/user-repo.service';

@Injectable()
export class MapUserPipe implements PipeTransform {
  constructor(private userRepoService: UserRepoService) {}

  /**
   * It will validate user correspond to user id
   * @param userId
   */
  transform(userId: number) {
    return this.userRepoService.findOrFail(userId);
  }
}
