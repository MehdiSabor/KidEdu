// RewardActionModal.js
import React from 'react';
import { Modal, View, Text, StyleSheet, Button } from 'react-native';

const RewardActionModal = ({ Reward, isVisible, onClose, onClaim }) => {
    if (!Reward) {
        return null; // Don't render the modal if Reward is null
      }


     
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>Title: {Reward.name}</Text>
        <Text>Description: {Reward.description}</Text>
        <Text>Points: {Reward.points}</Text>
        <View style={styles.modalButtons}>

       

         <Button title="Claim" onPress={() => onClaim(Reward.id)} />
        </View>
        <Button title="Close" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  // ... other styles
});

export default RewardActionModal;
