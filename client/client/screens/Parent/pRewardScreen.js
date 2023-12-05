import React, { useEffect, useState, useCallback  } from 'react';
import { ScrollView, Modal,Button, View, TouchableOpacity,  Text, StyleSheet,RefreshControl, FlatList, ActivityIndicator } from 'react-native';
import {apiRequest} from '../../services/api'; // Adjust path as necessary
import { Card } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import RewardActionModal from './RewardActionModal';
import { Icon } from 'react-native-elements';
import RewardCreationModal from './RewardCreationModal';

const RewardScreen = ({ route }) => {
    const { roomId } = route.params;
    const [Rewards, setRewards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isActionModalVisible, setIsActionModalVisible] = useState(false);
    const [selectedReward, setSelectedReward] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [rewardHistory, setRewardHistory] = useState([]);
    const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);

    
const updateReward = async (rewardId) => {
    // Show RewardCreationModal to update the Reward or navigate to a Reward update screen
    

    //TO DO FOR LATER
    console.log("update",rewardId);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) + ' at ' + date.toLocaleTimeString();
  };



  const fetchRewardHistory = async () => {
    try {
      const data = await apiRequest(`/room/${roomId}/claim-history`); // Adjust the endpoint as necessary
      setRewardHistory(data);
      console.log(rewardHistory);
    } catch (error) {
      console.error('Error fetching reward history:', error);
    }
  };
  const deleteReward = async (rewardId) => {
      try {
        await apiRequest(`/reward/delete/${rewardId}`, {
          method: 'DELETE',
        });
        // Refresh the Rewards list or handle UI update
        setIsActionModalVisible(false);
        fetchRewards();
        
      } catch (error) {
        console.error('Error deleting reward:', error);
      }
    };

    const fetchRewards = async () => {
        try {
          const data = await apiRequest(`/Reward/getall/${roomId}`);
          console.log(data);
          setRewards(data);
        } catch (error) {
          console.error('Error fetching Rewards:', error);
        } finally {
          setIsLoading(false);
        }
      };


      const onRefresh = useCallback(async () => {
        setRefreshing(true);
    
        // Place your data fetching logic here
        try {
          // Fetch data
          fetchRewards();
          fetchRewardHistory();
        } catch (error) {
          console.error(error);
        }
    
        setRefreshing(false);
      }, []);
  

  const handleCreateReward = async (title, description, points) => {
    try {
      // Assuming your API expects a POST request to create a new Reward
      const newReward = {
        name: title,
        description: description,
        points: parseInt(points, 10),
        roomId: roomId, // Make sure roomId is an integer
      };
      console.log(newReward);

      await apiRequest(`/Reward/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReward),
      });

      // Close the modal and clear the form
      setIsModalVisible(false);
      // Refresh the Rewards list
      fetchRewardHistory();
      fetchRewards(); // Implement this function to fetch Rewards from the API
    } catch (error) {
      console.error('Error creating Reward:', error);
    }
  };


  useFocusEffect(
    React.useCallback(() => {
      

      fetchRewards();
      fetchRewardHistory();

      return () => {
        // Optional: Any cleanup actions
      };
    }, [roomId])
  );

  if (isLoading) {
    return <ActivityIndicator />;
  }


  return (


    <View style={styles.container}>

<View style={styles.header}>
  <Icon
    name='gift' // Use an appropriate icon name based on your icon library
    type='font-awesome' // Icon type depends on the library used
    onPress={() => setIsHistoryModalVisible(true)}
  />

</View>
      <FlatList
        data={Rewards}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.RewardContainer}>
         
         <TouchableOpacity onPress={() => {
          setSelectedReward(item);
          setIsActionModalVisible(true);
        }}>
       

            <Card containerStyle={styles.RewardContainer}>
      <Text style={styles.RewardTitle}>{item.name}</Text>
      <Text style={styles.RewardDescription}>{item.description}</Text>
      
      <Text style={styles.RewardPoints}>Points: {item.points}</Text>
    </Card>
    </TouchableOpacity>
            {/* Render additional Reward details */}
          </View>
        )}
      />

<Button title="Create Reward" onPress={() => setIsModalVisible(true)} />

<RewardCreationModal
        isModalVisible={isModalVisible}
        onModalClose={() => setIsModalVisible(false)}
        onRewardCreate={handleCreateReward}
      />
      <RewardActionModal
      Reward={selectedReward}
      isVisible={isActionModalVisible}
      onClose={() => setIsActionModalVisible(false)}
      onUpdate={updateReward}
      onDelete={deleteReward}
    />

<Modal
        animationType="slide"
        transparent={true}
        visible={isHistoryModalVisible}
        onRequestClose={() => setIsHistoryModalVisible(false)}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsHistoryModalVisible(false)} style={styles.closeButton}>
              <Icon name="close" size={24} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.modalTitle}>Reward History</Text>
            {rewardHistory.map((item, index) => (
              <Card key={index} containerStyle={styles.RewardContainer}>
                <Text style={styles.RewardTitle}>{item.reward.name}</Text>
                <Text style={styles.RewardDescription}>{item.reward.description}</Text>
                <Text style={styles.RewardPoints}>Points: {item.reward.points}</Text>
                <Text style={styles.RewardClaimedAt}>Claimed: {formatDate(item.claimedAt)}</Text>
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
    padding: 10,
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
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  closeButton: {
    // Style as needed
  },
  scrollView: {
    width: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  RewardContainer: {
    marginBottom: 10,
    borderRadius: 5,
    // Additional styling as needed
  },
  RewardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  RewardDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  RewardPoints: {
    fontSize: 18,
    color: 'green',
    fontWeight: 'bold',
  },
  RewardClaimedAt: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
    // Additional styling as needed
  },
  // ... other styles ...
});

export default RewardScreen;
  
  
  