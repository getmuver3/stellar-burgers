export type TAppHeaderUIProps = {
  userName: string | undefined;
  handleConstructorClick?: () => void;
  handleClickFeed?: () => void;
  handleClickProfile?: () => void;
  isFeedPage?: boolean;
  isProfilePage?: boolean;
  isConstructorPage?: boolean;
};
