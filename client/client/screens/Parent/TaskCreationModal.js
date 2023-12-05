// TaskCreationModal.js
import React, { useState } from 'react';
import { View, Modal, TextInput, Button, StyleSheet } from 'react-native';

const TaskCreationModal = ({ isModalVisible, onModalClose, onTaskCreate }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPoints, setTaskPoints] = useState('');

  const handleCreateTask = () => {
    onTaskCreate(taskTitle, taskDescription, taskPoints);
    setTaskTitle('');
    setTaskDescription('');
    setTaskPoints('');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={onModalClose}>
      <View style={styles.modalView}>
        <TextInput
          placeholder="Task Title"
          value={taskTitle}
          onChangeText={setTaskTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Task Description"
          value={taskDescription}
          onChangeText={setTaskDescription}
          style={styles.input}
        />
        <TextInput
          placeholder="Task Points"
          value={taskPoints}
          onChangeText={setTaskPoints}
          keyboardType="numeric"
          style={styles.input}
        />
        <Button title="Submit Task" onPress={handleCreateTask} />
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

export default TaskCreationModal;
