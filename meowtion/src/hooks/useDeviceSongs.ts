import { useCallback, useEffect, useMemo, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Directory, File, Paths } from 'expo-file-system';

export type DeviceSong = {
  id: string;
  title: string;
  durationSeconds: number;
  uri: string;
  albumId?: string;
  source: 'device' | 'drive';
};

type UseDeviceSongsResult = {
  songs: DeviceSong[];
  isLoading: boolean;
  errorMessage: string | null;
  hasPermission: boolean;
  refreshSongs: () => Promise<void>;
  requestAccess: () => Promise<void>;
};

function formatSongTitle(filename: string) {
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function toSongItem(asset: MediaLibrary.Asset): Promise<DeviceSong> {
  const assetInfo = await MediaLibrary.getAssetInfoAsync(asset, { shouldDownloadFromNetwork: true });

  return {
    id: asset.id,
    title: formatSongTitle(asset.filename),
    durationSeconds: asset.duration ?? 0,
    uri: assetInfo.localUri ?? assetInfo.uri,
    albumId: asset.albumId,
    source: 'device',
  };
}

const DRIVE_TRACKS = [
  {
    id: 'AAAAAAA',
    title: 'Embalo - Ryu The Runner',
    fileName: 'drive-track-01.mp3',
  }
] as const;

const driveCacheDirectory = new Directory(Paths.cache, 'meowtion-drive');

function getDriveDownloadUrl(fileId: string) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

function toDriveSong(fileName: string, uri: string, title: string): DeviceSong {
  return {
    id: `drive:${fileName}`,
    title,
    durationSeconds: 0,
    uri,
    source: 'drive',
  };
}

async function ensureDriveFallbackSongs(): Promise<DeviceSong[]> {
  if (!driveCacheDirectory.exists) {
    driveCacheDirectory.create({ intermediates: true, idempotent: true });
  }

  const downloads = await Promise.all(
    DRIVE_TRACKS.map(async (track) => {
      const targetFile = new File(driveCacheDirectory, track.fileName);

      if (!targetFile.exists) {
        await File.downloadFileAsync(getDriveDownloadUrl(track.id), targetFile);
      }

      return toDriveSong(track.fileName, targetFile.uri, track.title);
    })
  );

  return downloads;
}

export function useDeviceSongs(): UseDeviceSongsResult {
  const [songs, setSongs] = useState<DeviceSong[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const loadSongs = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const available = await MediaLibrary.isAvailableAsync();
      if (!available) {
        const fallbackSongs = await ensureDriveFallbackSongs();
        setSongs(fallbackSongs);
        setHasPermission(false);
        setErrorMessage('Biblioteca local indisponivel. Carregamos as musicas do Drive.');
        return;
      }

      const permissionResponse = await MediaLibrary.getPermissionsAsync(false, ['audio']);
      const granted = permissionResponse.status === 'granted';
      setHasPermission(granted);

      if (!granted) {
        const fallbackSongs = await ensureDriveFallbackSongs();
        setSongs(fallbackSongs);
        setErrorMessage('Permissao negada. Carregamos as musicas do Drive.');
        return;
      }

      const page = await MediaLibrary.getAssetsAsync({
        first: 200,
        mediaType: MediaLibrary.MediaType.audio,
        sortBy: [MediaLibrary.SortBy.modificationTime],
      });

      if (page.assets.length === 0) {
        const fallbackSongs = await ensureDriveFallbackSongs();
        setSongs(fallbackSongs);
        setErrorMessage('Nenhuma musica local encontrada. Carregamos as faixas do Drive.');
        return;
      }

      const deviceSongs = await Promise.all(page.assets.map((asset) => toSongItem(asset)));
      setSongs(deviceSongs);
    } catch (error) {
      try {
        const fallbackSongs = await ensureDriveFallbackSongs();
        setSongs(fallbackSongs);
        setErrorMessage('Nao foi possivel ler a biblioteca local. Carregamos as musicas do Drive.');
      } catch {
        setSongs([]);
        setErrorMessage('Nao foi possivel carregar as musicas do dispositivo.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSongs();
  }, [loadSongs]);

  const requestAccess = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await MediaLibrary.requestPermissionsAsync(false, ['audio']);
      const granted = response.status === 'granted';
      setHasPermission(granted);

      if (granted) {
        await loadSongs();
        return;
      }

      const fallbackSongs = await ensureDriveFallbackSongs();
      setSongs(fallbackSongs);
      setErrorMessage('Sem permissao para acessar a biblioteca local. Carregamos as musicas do Drive.');
    } catch {
      try {
        const fallbackSongs = await ensureDriveFallbackSongs();
        setSongs(fallbackSongs);
        setErrorMessage('Falha ao solicitar permissao. Carregamos as musicas do Drive.');
      } catch {
        setSongs([]);
        setErrorMessage('Falha ao solicitar permissao da biblioteca de midia.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [loadSongs]);

  return useMemo(
    () => ({
      songs,
      isLoading,
      errorMessage,
      hasPermission,
      refreshSongs: loadSongs,
      requestAccess,
    }),
    [songs, isLoading, errorMessage, hasPermission, loadSongs, requestAccess]
  );
}
