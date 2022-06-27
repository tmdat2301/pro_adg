import styles from './styles';
import React from 'react';
import { NavigationField } from '@interfaces/quickSearch.interface';
import { TypeFieldExtension } from '@helpers/constants';
import LeadCU from './components/LeadCU';
import DealCU from './components/DealCU';
import CorporateCU from './components/CorporateCU';
import ContactCU from './components/ContactCU';
import { SafeAreaView } from 'react-native-safe-area-context';
interface ICreateAndEditProps extends NavigationField {}

const CreateAndEditScreen = (props: ICreateAndEditProps) => {
  const { type, idUpdate, isGoback } = props.route.params;
  const idCrnt = idUpdate ? idUpdate : null;
  const setViewCU = () => {
    try {
      switch (type) {
        case TypeFieldExtension.lead:
          return <LeadCU idLead={idCrnt} />;
        case TypeFieldExtension.contact:
          return <ContactCU idContact={idCrnt} />;
        case TypeFieldExtension.corporate:
          return <CorporateCU idCorporate={idCrnt} />;
        case TypeFieldExtension.deal:
          return <DealCU idDeal={idCrnt} isGoback={isGoback} />;
        default:
          return <></>;
      }
    } catch (error) {
      return <></>;
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {setViewCU()}
    </SafeAreaView>
  );
};

export default CreateAndEditScreen;
