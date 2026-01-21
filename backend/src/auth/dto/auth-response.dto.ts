export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
  };
  testGroup?: {
    testId: string;
    testName: string;
    groupId: string;
    groupName: string;
    assignedAt: Date;
  };
}
