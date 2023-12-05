// TaskActionModal.js
import React from 'react';
import { Modal, View, Text, StyleSheet, Button } from 'react-native';

const TaskActionModal = ({ task, isVisible, onClose, onComplete}) => {
    if (!task) {
        return null; // Don't render the modal if task is null
      }


      // Determine if the task is completed
  const isCompleted = task.status === 'COMPLETED';
  const isConfirmed = task.status === 'CONFIRMED';

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>Title: {task.title}</Text>
        <Text>Description: {task.description}</Text>
        <Text>Points: {task.points}</Text>
        <Text>Status: {task.status}</Text>
        <View style={styles.modalButtons}>

        <Button 
          title="Complete" 
          onPress={() => onComplete(task.id)} 
          disabled={isCompleted || isConfirmed} // Disable if not completed
        />
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

export default TaskActionModal;
