import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const WelAppScreen = () => {
  const navigation = useNavigation();

  const anipadding = useSharedValue(0);
  const ani2padding = useSharedValue(0);

  useEffect(() => {
    anipadding.value = 0;
    ani2padding.value = 0;

    setTimeout(() => anipadding.value = withSpring(anipadding.value + hp(3)), 100);
    setTimeout(() => ani2padding.value = withSpring(ani2padding.value + hp(5)), 300);
    setTimeout(() => navigation.navigate('Auth'), 2500);
  }, []);

  const aniStyle1 = useAnimatedStyle(() => ({
    padding: anipadding.value,
  }));

  const aniStyle2 = useAnimatedStyle(() => ({
    padding: ani2padding.value,
  }));

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Animated.View style={[styles.animatedOuterView, aniStyle2]}>
        <Animated.View style={[styles.animatedInnerView, aniStyle1]}>
          <Image source={require('../assets/Welc.png')} style={styles.image} />
        </Animated.View>
      </Animated.View>

      <View style={styles.textContainer}>
        <Text style={styles.mainText}>Tola</Text>
        <Text style={styles.subText}>For you at your pace</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue', 
  },
  animatedOuterView: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    borderRadius: wp(50),
    borderBottomRightRadius: wp(10),
  },
  animatedInnerView: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    borderRadius: wp(50),
  },
  image: {
    width: hp(35),
    height: hp(42),
  },
  textContainer: {
    alignItems: 'center',
    marginTop: hp(5),
  },
  mainText: {
    fontSize: hp(8),
    fontFamily: 'RubikBubbles-Regular',
    fontWeight: 'bold',
    color: '#FFFFFF', 
    letterSpacing: wp(0.2), 
  },
  subText: {
    fontSize: hp(2),
    fontFamily: 'RubikBubbles-Regular',
    fontWeight: 'bold',
    color: '#FFFFFF', 
    letterSpacing: wp(0.2), 
    marginTop: hp(1),
  },
});

export default WelAppScreen;

// import React, { useEffect } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   StatusBar,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

// const WelAppScreen = () => {
//   const navigation = useNavigation();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigation.navigate('Auth'); // Navigate to AuthScreen after splash
//     }, 2500); // Duration of splash screen

//     return () => clearTimeout(timer);
//   }, [navigation]);

//   const anipadding = useSharedValue(0);
//   const ani2padding = useSharedValue(0);

//   useEffect(() => {
//     anipadding.value = 0;
//     ani2padding.value = 0;

//     setTimeout(() => anipadding.value = withSpring(anipadding.value + hp(3)), 100);
//     setTimeout(() => ani2padding.value = withSpring(ani2padding.value + hp(5)), 300);
//   }, []);

//   const aniStyle1 = useAnimatedStyle(() => ({
//     padding: anipadding.value,
//   }));

//   const aniStyle2 = useAnimatedStyle(() => ({
//     padding: ani2padding.value,
//   }));

//   return (
//     <View style={styles.container}>
//       <StatusBar style="light" />

//       <Animated.View style={[styles.animatedOuterView, aniStyle2]}>
//         <Animated.View style={[styles.animatedInnerView, aniStyle1]}>
//           <Image source={require('../assets/Welc.png')} style={styles.image} />
//         </Animated.View>
//       </Animated.View>

//       <View style={styles.textContainer}>
//         <Text style={styles.mainText}>Tola</Text>
//         <Text style={styles.subText}>For you at your pace</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'lightblue', 
//   },
//   animatedOuterView: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)', 
//     borderRadius: wp(50),
//     borderBottomRightRadius: wp(10),
//   },
//   animatedInnerView: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)', 
//     borderRadius: wp(50),
//   },
//   image: {
//     width: hp(35),
//     height: hp(42),
//   },
//   textContainer: {
//     alignItems: 'center',
//     marginTop: hp(5),
//   },
//   mainText: {
//     fontSize: hp(8),
//     fontFamily: 'RubikBubbles-Regular',
//     fontWeight: 'bold',
//     color: '#FFFFFF', 
//     letterSpacing: wp(0.2), 
//   },
//   subText: {
//     fontSize: hp(2),
//     fontFamily: 'RubikBubbles-Regular',
//     fontWeight: 'bold',
//     color: '#FFFFFF', 
//     letterSpacing: wp(0.2), 
//     marginTop: hp(1),
//   },
// });

// export default WelAppScreen;
