import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { IAllRoutesParamList } from '~/routers/types';

type TNavigationProp = NativeStackNavigationProp<IAllRoutesParamList>;

const AboutPage = (): React.JSX.Element => {
  const navigation = useNavigation<TNavigationProp>();

  const handleGoBack = (): void => {
    navigation.navigate('ScanInboundPage', {});
  };

  return (
    <SafeAreaView edges={['top', 'bottom']}>
      <Text>AboutPage</Text>
      <TouchableOpacity onPress={handleGoBack}>
        <Text>asdbahsbdh</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AboutPage;
