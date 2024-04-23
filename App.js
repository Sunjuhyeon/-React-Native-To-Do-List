import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { theme } from './colors';
import { useEffect, useState } from 'react';

const STORAGE_KEY = '@toDos'

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});

  useEffect(() => {
    loadToDos();
  }, []);

  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = payload => setText(payload);
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
    console.log(JSON.parse(s))
  }
  const addToDo = async () => {
    if(text === ""){
      return;
    }

    const newToDos = {
      [Date.now()]: { text, working },
      ...toDos,
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  }
  console.log(toDos)
  const deleteToDo = (key) => {
    Alert.alert("리스트 지우기", "정말 지우시겠습니까?", [
      {text: '취소'},
      {
        text: '삭제',
        onPress: async () => {
          const newToDos = {...toDos};
          delete newToDos[key];
          setToDos(newToDos);
          await saveToDos(newToDos);
        }
      },
    ]);
  }
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? 'white' : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? 'white' : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onSubmitEditing={addToDo}
          onChangeText={onChangeText}
          returnKeyType="done"
          value={text}
          placeholder={working ? 'Add a To Do' : 'Where Do You Want To Go ?'}
          style={styles.input}
        />
        <ScrollView>
          {Object.keys(toDos).map(key =>
            toDos[key].working === working ? (
              <View style={styles.toDo} key={key}>
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Fontisto name="trash" size={20} color={theme.grey} />
                </TouchableOpacity>
              </View>
            ) : null
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 100,
  },
  btnText: {
    fontSize: 44,
    fontWeight: '600',
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 17,
  },
  toDo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor:theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  toDoText: {
    color : '#fff',
    fontSize : 16,
    fontWeight : '500'
  }
});
