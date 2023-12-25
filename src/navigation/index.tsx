import React from 'react';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import UserStack from './userStack';
import AuthStack from './authStack';
import WelcomeScreen from './pages/Welcome';

export default function RootNavigation() {
  const { user } = useAuthentication();
  return <AuthStack />;
}