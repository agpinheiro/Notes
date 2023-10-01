import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { RouteProps } from '../../routes/Routes';
import Container from '../../components/Cotainer/Container';
import Logo from '../../assets/logo.svg';
import LogoLottie from '../../assets/logoLottie.json';
import LottieView from 'lottie-react-native';
import { theme } from '../../theme/theme';

type NavProps = RouteProps<'Welcome'>;

const Welcome: React.FC<NavProps> = ({ navigation }) => {
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    const targetOpacity = 1; // Valor final que queremos alcançar
    const duration = 1000; // 1 segundo em milissegundos
    const increment = 0.02; // O quanto queremos incrementar a cada intervalo

    let currentOpacity = opacity;
    const interval = setInterval(() => {
      // Verifique se já atingimos o valor final
      if (currentOpacity >= targetOpacity) {
        clearInterval(interval); // Pare o intervalo quando atingir o valor desejado
      } else {
        // Incremente a opacidade e atualize o estado
        currentOpacity += increment;
        setOpacity(currentOpacity);
      }
    }, duration * increment);

    const time = setTimeout(() => {
      navigation.navigate('Main');
    }, 3000);
    return () => {
      clearTimeout(time);
      clearInterval(interval);
    };
  }, []);
  return (
    <Container>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1 }}
          onPress={() => navigation.navigate('Main')}
        >
          {/* <Image resizeMode="center" source={Logo} /> */}
          <LottieView
            style={{
              width: theme.screnn.w,
              height: theme.screnn.h,
            }}
            source={LogoLottie}
            autoPlay
            loop={false}
          />
          <Logo
            style={{
              position: 'absolute',
              top: 0,
              alignSelf: 'center',
              opacity: opacity,
            }}
            width={theme.screnn.w * 0.5}
          />
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default Welcome;
