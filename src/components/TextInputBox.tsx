import { View, TextInput } from "react-native";
import React, { useState } from "react";

const TextInputBox = ({ placeHolder, style, onChangeText }) => {
  const [text, onChangeTextLocal] = useState("");

  const handleChangeText = (newText) => {
    onChangeTextLocal(newText);
    onChangeText(newText); // Pass the updated text to the parent component
  };

  return (
    <View>
      <TextInput
        style={style}
        onChangeText={handleChangeText}
        value={text}
        placeholder={placeHolder}
      />
    </View>
  );
};

export default TextInputBox