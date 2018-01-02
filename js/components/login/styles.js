
const React = require('react-native');

const { StyleSheet, Dimensions, PixelRatio } = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default {
  container: {
    flex: 1,
    justifyContent: 'center',
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 50,
  },
  bg: {
    width: 300,
  },
  input: {
    marginBottom: 20,
  },
  btn: {
    marginTop: 20,
    alignSelf: 'center',
    width: '100%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerText: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 5,
  },
  popupDialog: {
    dialogContentView: {
      flex: 1,
      width: 300,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
    },
    zIndex: 99999,
  },
};
