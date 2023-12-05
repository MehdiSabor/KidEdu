// RewardCreationModal.js
import React, { useState } from 'react';
import { View, Modal, TextInput, Button, StyleSheet } from 'react-native';

const RewardCreationModal = ({ isModalVisible, onModalClose, onRewardCreate }) => {
  const [RewardTitle, setRewardTitle] = useState('');
  const [RewardDescription, setRewardDescription] = useState('');
  const [RewardPoints, setRewardPoints] = useState('');

  const handleCreateReward = () => {
    onRewardCreate(RewardTitle, RewardDescription, RewardPoints);
    setRewardTitle('');
    setRewardDescription('');
    setRewardPoints('');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={onModalClose}>
      <View style={styles.modalView}>
        <TextInput
          placeholder="Reward Title"
          value={RewardTitle}
          onChangeText={setRewardTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Reward Description"
          value={RewardDescription}
          onChangeText={setRewardDescription}
          style={styles.input}
        />
        <TextInput
          placeholder="Reward Points"
          value={RewardPoints}
          onChangeText={setRewardPoints}
          keyboardType="numeric"
          style={styles.input}
        />
        <Button title="Submit Reward" onPress={handleCreateReward} />
        <Button title="Cancel" onPress={onModalClose} />
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
  },
});

export default RewardCreationModal;
