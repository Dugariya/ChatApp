import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React, {FC} from 'react';

interface IProps {
  title: string;
  backButton?: boolean;
  imageURL?: string;
}

let text_color = '#eeeedd';
const defaultIcon =
  'https://cdn-icons-png.freepik.com/512/3135/3135715.png?ga=GA1.1.232808186.1704286703&';
const ChatHeader: FC<IProps> = ({
  title,
  backButton = true,
  imageURL = defaultIcon,
}) => {
  return (
    <View style={styles.container}>
      {backButton && (
        <TouchableOpacity>
          <Image
            source={require('../images/back.png')}
            style={{width: 20, height: 20}}
          />
        </TouchableOpacity>
      )}
      <View
        style={{flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1}}>
        <Image source={{uri: imageURL}} style={styles.image_icon_style} />
        <Text style={styles.title_text_style}>{title}</Text>
      </View>
      <TouchableOpacity>
        <Image
          source={require('../images/dots.png')}
          style={styles.image_icon_style}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    // justifyContent: 'space-between',
    backgroundColor: '#5f9ea0',
    gap: 20,
    height: 55,
  },
  image_icon_style: {
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  title_text_style: {
    fontSize: 18,
    fontWeight: 'bold',
    color: text_color,
  },
});
