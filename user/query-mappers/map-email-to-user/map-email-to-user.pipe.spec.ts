import { MapEmailToUserPipe } from './map-email-to-user.pipe';

describe('MapEmailToUserPipe', () => {
  let pipe: MapEmailToUserPipe;

  beforeEach(() => {
    pipe = new MapEmailToUserPipe({} as any);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });
});
