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
  
  export { Friend, Organization, Event};