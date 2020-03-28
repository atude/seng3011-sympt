import * as React from 'react';
import { Text } from 'react-native';

const StyledText = (props) => {
  return <Text {...props} style={[props.style, { fontFamily: 'open-sans' }]} />;
};

export default StyledText;
