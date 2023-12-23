
interface Friend {
    id: string;
    name: string;
    profilePicture: string;
    status: string;
  }
  

interface Organization {
    id: string;
    name: string;
    profilePicture: string;
    friendList: Friend[];
  }