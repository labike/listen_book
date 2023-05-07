import React, {FC} from 'react';
import {View} from 'react-native';

export type IAuthorityType =
  | undefined
  | string
  | string[]
  | Promise<boolean>
  | ((currentAuthority: string | string[]) => IAuthorityType);

export interface IProps {
  authority: boolean;
  noMatch?: () => JSX.Element;
}

const Authorized: FC<IProps> = ({children, authority, noMatch = null}) => {
  if (authority) {
    return children;
  }
  return <View>{noMatch && noMatch()}</View>;
};

export default Authorized;
