import { useState, useEffect } from 'react';
import { 
  siteContentStore, 
  SiteContentState, 
  StaffUserProfile, 
  RoleDefinition, 
  StaffUserAccount 
} from '../services/siteContentStore';

export function useSiteContent() {
  const [content, setContent] = useState<SiteContentState>(() => siteContentStore.getState());
  const [currentRole, setCurrentRole] = useState<string>(() => siteContentStore.getRole());
  const [userProfile, setUserProfile] = useState<StaffUserProfile>(() => siteContentStore.getProfile());
  const [activeUser, setActiveUser] = useState<StaffUserAccount>(() => siteContentStore.getActiveUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => siteContentStore.isAuthenticated());

  useEffect(() => {
    const unsubscribe = siteContentStore.subscribe(() => {
      setContent({ ...siteContentStore.getState() });
      setCurrentRole(siteContentStore.getRole());
      setUserProfile(siteContentStore.getProfile());
      setActiveUser({ ...siteContentStore.getActiveUser() });
      setIsAuthenticated(siteContentStore.isAuthenticated());
    });
    return unsubscribe;
  }, []);

  return {
    content,
    roles: content.roles || [],
    users: content.users || [],
    activeUser,
    isAuthenticated,
    currentRole,
    userProfile,
    store: siteContentStore
  };
}
