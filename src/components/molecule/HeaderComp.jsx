import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';

const HeaderComp = () => {
  // Absolute height calculation (removes all flex ambiguity)
  const sectionHeight = Dimensions.get('window').height * 0.15; // 15% of screen

  return (
    <View style={styles.root}>
      {/* Top Section - Red */}
      <View
        style={[
          styles.section,
          {height: sectionHeight, backgroundColor: 'red'},
        ]}
      />

      {/* Bottom Section - Cyan */}
      <View
        style={[
          styles.section,
          {height: sectionHeight, backgroundColor: 'cyan'},
        ]}
      />
    </View>
  );
};

export default HeaderComp;

const styles = StyleSheet.create({
  root: {
    position: 'absolute', // Takes out of normal document flow
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'yellow',
    zIndex: 100, // Ensures visibility
  },
  section: {
    width: '100%',
  },
});
