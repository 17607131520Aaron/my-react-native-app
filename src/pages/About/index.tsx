import { Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { navigateTo } from '~/routers/navigation';

const AboutPage = (): React.JSX.Element => {
  const handleGoToScan = (): void => {
    navigateTo('ScanInboundPage', {});
  };

  return (
    <SafeAreaView edges={['top', 'bottom']}>
      <Text>AboutPage</Text>
      <TouchableOpacity onPress={handleGoToScan}>
        <Text>asdbahsbdh</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AboutPage;
