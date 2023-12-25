// CustomHeader.js
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';


const CustomHeader = ({  }) => {
    const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
      <Entypo name="menu" size={100} color="#fff" />
    </TouchableOpacity>
  );
};

export default CustomHeader;