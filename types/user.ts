export type UserType = {
  id: number;
  uuid: string;
  name: string;
  email: string;
  profileImage: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  version: number;
  kakaoId?: string;
  googleId?: string;
  appleId?: string;
  mobile?: string;
};

export type UserResponseType = {
  user: UserType;
};

export type AuthState = {
  isAuthenticated: boolean;
  user: UserType | null;
  isLoading: boolean;
};
