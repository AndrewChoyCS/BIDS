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

  interface Event {
    img: string;
    location: string;
    eventName: string;
    ratings: number;
    theme: string;
    date: string;
    entryFee: boolean;
    description: string;
  }

  interface User {
    uid: string;
    username: string;
    email: string;
    friendList: string[]; // Array of friend UIDs
  }
  
  // Define an interface for a friend request
  interface FriendRequest {
    from: string; // Sender's UID
    to: string;   // Receiver's UID
  }
  
  export { Friend, Organization, Event};