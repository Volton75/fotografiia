import { useEffect, useRef, useState } from 'react';

interface CameraViewProps {
  className?: string;
}

export function CameraView({ className }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let active = true;

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
          setReady(true);
        }
      } catch (e) {
        const err = e as Error;
        setError(
          err.name === 'NotAllowedError'
            ? 'Dostęp do kamery został odrzucony. Zezwól na dostęp w ustawieniach przeglądarki.'
            : 'Nie udało się uruchomić kamery. Sprawdź, czy urządzenie ma kamerę tylną.',
        );
      }
    };

    start();

    return () => {
      active = false;
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className={className}>
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        playsInline
        muted
        autoPlay
        style={{ transform: 'scaleX(1)' }}
      />
      {!ready && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-900 text-neutral-400">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-600 border-t-neutral-300" />
          <p className="text-sm">Uruchamianie kamery...</p>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-900 px-6 text-center text-neutral-300">
          <p className="text-sm leading-relaxed">{error}</p>
        </div>
      )}
    </div>
  );
}
