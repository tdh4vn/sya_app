
const React = require('react-native');

const { StyleSheet } = React;
export default {
  container: {
    backgroundColor: '#FBFAFA',
  },
  row: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  mt: {
    marginTop: 18,
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
