interface Friend {
    id: string;
    name: string;
  }
  
  interface Organization {
    id: string;
    name: string;
    profilePicture: string;
    description: string; 
    friendList: Friend[];
  }
  
  export { Friend, Organization };