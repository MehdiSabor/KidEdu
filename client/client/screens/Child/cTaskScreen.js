// TaskScreen.js
import React, { useState, useEffect, useCallback } from 'react';

import { ScrollView,View, Text, StyleSheet, RefreshControl, FlatList, Button, Modal, TextInput , ActivityIndicator, TouchableOpacity } from 'react-native';
import {apiRequestChild} from '../../services/api';
import { Card } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import TaskActionModal from './TaskActionModal';
import { Icon } from 'react-native-elements';


const TaskScreen = ({ route }) => {
  const { roomId } = route.params;
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
   const [isActionModalVisible, setIsActionModalVisible] = useState(false);
   const [taskHistory, setTaskHistory] = useState([]);
    
   const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);

   const completeTask = async (taskId) => {
    try {
      await apiRequestChild(`/task/complete/${taskId}`, {
        method: 'PATCH',
      });
      // Refresh the tasks list or handle UI update
      setIsActionModalVisible(false);
      fetchTasks();
      fetchTaskHistory();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) + ' at ' + date.toLocaleTimeString();
  };


  const fetchTaskHistory = async () => {
    try {
      const data = await apiRequestChild(`/room/${roomId}/task-history`); // Adjust the endpoint as necessary
      setTaskHistory(data);
      console.log(taskHistory);
    } catch (error) {
      console.error('Error fetching task history:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const data = await apiRequestChild(`/task/getall/${roomId}`);
      console.log(data);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      

      fetchTasks();
      fetchTaskHistory();

      return () => {
        // Optional: Any cleanup actions
      };
    }, [roomId])
  );

  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    // Place your data fetching logic here
    try {
      // Fetch data
      fetchTasks();
      fetchTaskHistory();
    } catch (error) {
      console.error(error);
    }

    setRefreshing(false);
  }, []);


 
  if (isLoading) {
    return <ActivityIndicator />;
  }



  return (
    <View style={styles.container}>
    <View style={styles.header}>
  <Icon
    name='history' // Use an appropriate icon name based on your icon library
    type='material' // Icon type depends on the library used
    onPress={() => setIsHistoryModalVisible(true)}
  />

</View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>

          <TouchableOpacity onPress={() => {
          setSelectedTask(item);
          setIsActionModalVisible(true);
        }}>
       
          <Card containerStyle={styles.taskContainer}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDescription}>{item.description}</Text>
      <Text style={styles.taskStatus}>Status: {item.status}</Text>
      <Text style={styles.taskPoints}>Points: {item.points}</Text>
    </Card>
    </TouchableOpacity>
          </View>
        )}
      />

<TaskActionModal
      task={selectedTask}
      isVisible={isActionModalVisible}
      onClose={() => setIsActionModalVisible(false)}
      onComplete={completeTask}

     
    />

<Modal
      animationType="slide"
      transparent={true}
      visible={isHistoryModalVisible}
  
 onRequestClose={() => setIsHistoryModalVisible(false)}>

      <View style={styles.modalView}>
        <View style={styles.modalHeader}>
        
<TouchableOpacity onPress={() => setIsHistoryModalVisible(false)}>
 <Icon name="close" size={24} /> 
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.modalTitle}>Task History</Text>
          {taskHistory.map((item, index) => (
  <Card key={index} containerStyle={styles.taskContainer}>
    <Text style={styles.taskTitle}>{item.task.title}</Text>
    <Text style={styles.taskDescription}>{item.task.description}</Text>
    <Text style={styles.taskPoints}>Points: {item.task.points}</Text>
    <Text style={styles.TaskClaimedAt}>Changed: {formatDate(item.changedAt)}</Text>
    <Text style={styles.TaskClaimedAt}>To: {item.task.status}</Text>
  </Card>
))}

</ScrollView>
      </View>
    </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
     // Consider setting a background color for the entire view
  },
  taskContainer: {
    marginBottom: 10,
    borderRadius: 5,
  
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: { height: 1, width: 0 },
  },
  taskTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  taskStatus: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  taskPoints: {
    fontSize: 18,
    color: 'green',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 10,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  scrollView: {
    width: '100%',
  },
  TaskChangedAt: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
    // Additional styling as needed
  },
});


export default TaskScreen;
