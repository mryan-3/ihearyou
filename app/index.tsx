import * as Speech from 'expo-speech'
import { View, Text, Button, ActivityIndicator, Pressable } from 'react-native'
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition'
import { useState } from 'react'

export default function HomeScreen() {
  const [color, setColor] = useState('white')
  const [recognizing, setRecognizing] = useState(false)
  const [transcript, setTranscript] = useState('')

  useSpeechRecognitionEvent('start', () => setRecognizing(true))
  useSpeechRecognitionEvent('end', () => setRecognizing(false))
  useSpeechRecognitionEvent('result', (event) => {
    const newTranscript = event.results[0]?.transcript
    setTranscript(newTranscript)
    if (newTranscript?.includes('red')) {
      Speech.speak('Here is the red screen')
      setColor('red')
    }
    if (newTranscript?.includes('blue')) {
      Speech.speak('Here is the blue screen')
      setColor('blue')
    }
  })
  useSpeechRecognitionEvent('error', (event) => {
    console.log('error code:', event.error, 'error message:', event.message)
  })
  const handleStart = async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync()
    if (!result.granted) {
      console.warn('Permissions not granted', result)
      return
    }
    ExpoSpeechRecognitionModule.start({
      lang: 'en-US',
      interimResults: true,
      maxAlternatives: 1,
      continuous: false,
      requiresOnDeviceRecognition: false,
    })
  }

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 dark:bg-gray-900 transition-colors duration-500" style={{ backgroundColor: color }}>
      <View className="w-11/12 max-w-md bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl p-8 items-center">
        <Text className="text-3xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">I Hear You</Text>
        <View className="mb-8 flex-row items-center space-x-3">
          {recognizing && (
            <View className="h-4 w-4 rounded-full bg-blue-500 animate-pulse" />
          )}
          <Text className="text-lg text-gray-700 dark:text-gray-200 font-medium">
            {recognizing ? 'Listening...' : 'Tap start and say a color'}
          </Text>
        </View>
        <Text className="text-2xl font-semibold text-center mb-8 text-gray-800 dark:text-gray-100 min-h-[32px]">
          {transcript}
        </Text>
        <Pressable
          className={`w-full py-4 rounded-xl ${recognizing ? 'bg-red-500' : 'bg-blue-600'} shadow-lg mb-2`}
          onPress={recognizing ? () => ExpoSpeechRecognitionModule.stop() : handleStart}
        >
          <Text className="text-xl font-bold text-white text-center">
            {recognizing ? 'Stop' : 'Start Listening'}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}
