import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';

export interface PickedImage {
  uri: string;
  width: number;
  height: number;
}

interface UseImagePickerReturn {
  pickFromCamera: () => Promise<PickedImage | null>;
  pickFromGallery: () => Promise<PickedImage | null>;
  isLoading: boolean;
  permissionError: string | null;
  clearPermissionError: () => void;
}

const LAUNCH_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
};

export function useImagePicker(): UseImagePickerReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const pickFromCamera = useCallback(async (): Promise<PickedImage | null> => {
    setPermissionError(null);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setPermissionError('Camera access is required. Please enable it in Settings.');
      return null;
    }
    setIsLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync(LAUNCH_OPTIONS);
      if (result.canceled || result.assets.length === 0) return null;
      const { uri, width, height } = result.assets[0];
      return { uri, width, height };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const pickFromGallery = useCallback(async (): Promise<PickedImage | null> => {
    setPermissionError(null);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setPermissionError('Photo library access is required. Please enable it in Settings.');
      return null;
    }
    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync(LAUNCH_OPTIONS);
      if (result.canceled || result.assets.length === 0) return null;
      const { uri, width, height } = result.assets[0];
      return { uri, width, height };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearPermissionError = useCallback(() => setPermissionError(null), []);

  return { pickFromCamera, pickFromGallery, isLoading, permissionError, clearPermissionError };
}
