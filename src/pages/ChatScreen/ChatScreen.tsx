import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  findNodeHandle,
  UIManager,
  StatusBar,
} from 'react-native';
import React, {FC, useEffect, useRef, useState} from 'react';
import CustomBottom from '../../components/bottomSheet/CustomBottomSheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  MentionInput,
  MentionSuggestionsProps,
} from 'react-native-controlled-mentions';
import ChatHeader from '../components/ChatHeader';

let text_color = '#eeeedd';
let bg_color = '#333333';
let icon_color = '#9e9e9e';
const ChatScreen = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [setshowInput, setSetshowInput] = useState(false);
  const [value, setValue] = useState('');
  const [inputHeight, setInputHeight] = useState(0);
  const inputRef = useRef(null);
  const [cursorPoint, setCursorPoint] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      _keyboardDidShow,
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      _keyboardDidHide,
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const _keyboardDidShow = (event: KeyboardEvent) => {
    // Handle keyboard show event
    setKeyboardVisible(true);
  };

  const _keyboardDidHide = (event: KeyboardEvent) => {
    // Handle keyboard hide event
    setKeyboardVisible(false);
    setSetshowInput(false);
  };

  const suggestions = [
    {id: '1', name: 'David Tabaka'},
    {id: '2', name: 'Mary'},
    {id: '3', name: 'Tony'},
    {id: '4', name: 'Mike'},
    {id: '5', name: 'Mike'},
    {id: '6', name: 'Grey'},
    {id: '7', name: 'Tony'},
    {id: '8', name: 'Grey'},
  ];

  const renderSuggestions: FC<MentionSuggestionsProps> = ({
    keyword,
    onSuggestionPress,
  }) => {
    if (keyword == null) {
      return null;
    }

    return (
      <View style={styles.render_component}>
        <StatusBar hidden={true} />
        <ScrollView scrollEnabled={true} keyboardShouldPersistTaps="always">
          {suggestions
            .filter(one =>
              one.name
                .toLocaleLowerCase()
                .includes(keyword.toLocaleLowerCase()),
            )
            .map(one => (
              <Pressable
                key={one.id}
                onPress={() => onSuggestionPress(one)}
                style={styles.render_item}>
                <Text style={styles.render_text_style}>{one.name}</Text>
              </Pressable>
            ))}
        </ScrollView>
      </View>
    );
  };
  const handleTextClick = () => {
    setSetshowInput(true);
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  };
  return (
    <GestureHandlerRootView style={styles.container}>
      <ChatHeader
        title="Pavan Dugariya"
        imageURL="https://pbs.twimg.com/profile_images/1198642711194001408/cKfbfVpJ_400x400.jpg"
      />
      <CustomBottom>
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
          <ScrollView scrollEnabled={true} keyboardShouldPersistTaps={'always'}>
            <View style={{padding: 10}}>
              {!keyboardVisible && (
                <View style={styles.text_input_first_container}>
                  <TouchableOpacity style={styles.micro_phone_btn}>
                    <Image
                      style={{width: 20, height: 20}}
                      tintColor={icon_color}
                      source={require('../images/plus.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={{flex: 1}} onPress={handleTextClick}>
                    <Text numberOfLines={1} style={{color: text_color}}>
                      {value ? value : 'Message something'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.micro_phone_btn}>
                    <Image
                      style={{width: 20, height: 20}}
                      tintColor={icon_color}
                      source={require('../images/microphone.png')}
                    />
                  </TouchableOpacity>
                </View>
              )}
              {setshowInput && (
                <MentionInput
                  onContentSizeChange={e => {
                    setCursorPoint({
                      locationY: e.nativeEvent.contentSize.height,
                    });
                    console.log(e.nativeEvent, 'SIZE');
                  }}
                  onKeyPress={e => {
                    console.log(e.nativeEvent.key, 'KEY');
                  }}
                  onTouchStart={e => {
                    setCursorPoint(e.nativeEvent);

                    console.log(e.nativeEvent, 'TOUCH StART');
                  }}
                  onPressIn={e => {
                    console.log(e.nativeEvent, 'PRESS_IN');
                  }}
                  onResponderStart={e => {
                    console.log(e.nativeEvent, 'ON_RESPONSE_START');
                  }}
                  onSelectionChange={e => {
                    console.log(e.nativeEvent);
                  }}
                  onFocus={() => {
                    const node = findNodeHandle(inputRef.current);
                    UIManager.measure(
                      node,
                      (x, y, width, height, pageX, pageY) => {
                        console.log('TextInput X position:', pageX);
                        console.log('TextInput Y position:', pageY);
                        // Calculate the cursor position relative to the TextInput position
                        // You can also use the pageX and pageY coordinates to calculate the position of the cursor
                      },
                    );
                  }}
                  onLayout={e => {
                    console.log(e.nativeEvent.layout);
                    setInputHeight(e.nativeEvent.layout.height);
                  }}
                  placeholder="Message something"
                  placeholderTextColor={text_color}
                  style={{color: text_color}}
                  inputRef={inputRef}
                  // ref={inputRef}
                  value={value}
                  onChange={setValue}
                  multiline={true}
                  focusable={true}
                  // style={{height: '100%'}}
                  autoFocus={true}
                  partTypes={[
                    {
                      // isBottomMentionSuggestionsRender: true,
                      trigger: '@', // Should be a single character like '@' or '#'
                      renderSuggestions,
                      textStyle: {fontWeight: 'bold', color: '#ADD8E6'}, // The mention style in the input
                    },
                    {
                      isBottomMentionSuggestionsRender: true,
                      trigger: '#', // Should be a single character like '@' or '#'
                      renderSuggestions,
                      textStyle: {fontWeight: 'bold', color: '#90EE90'}, // The mention style in the input
                    },
                  ]}
                />
              )}
            </View>
          </ScrollView>
          {setshowInput && (
            <TouchableOpacity
              style={styles.send_btn}
              onPress={() => {
                setSetshowInput(false);
                setValue('');
              }}>
              <Image
                source={require('../images/send-message.png')}
                tintColor={'#fff'}
                style={{height: 25, width: 20, alignSelf: 'center'}}
              />
            </TouchableOpacity>
          )}
        </KeyboardAvoidingView>
      </CustomBottom>
    </GestureHandlerRootView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: bg_color,
  },
  micro_phone_btn: {
    backgroundColor: 'rgba(0,0,0,.2)',
    padding: 5,
    borderRadius: 15,
  },
  text_input_first_container: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    gap: 8,
    alignItems: 'center',
  },
  send_btn: {
    backgroundColor: '#5f9ea0',
    borderRadius: 35,
    width: 35,
    height: 35,
    position: 'absolute',
    bottom: 10,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  render_component: {
    // borderWidth: 0.5,
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,.03)',
    borderColor: '#e3e3e3',
    gap: 5,
    // alignSelf: 'flex-start',
    maxHeight: 200,
    // position: 'absolute',
    // top: 0,
    // bottom: 0,
    // left: 0,
    // right: 0,
    // zIndex: 2,
  },
  render_item: {
    padding: 5,
    backgroundColor: bg_color,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  render_text_style: {
    color: text_color,
  },
});
