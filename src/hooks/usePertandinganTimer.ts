import { useCallback, useEffect, useRef, useState } from "react";

import { usePertandinganStore } from "../stores/pertandinganStore";

import { updateTimer as updateTimerApi } from "../api/turnament/pertandingan/pertandingan";

interface UsePertandinganTimerOptions {
  pertandinganId: number;

  autoSync?: boolean;

  onTimeUp?: () => void;
}

export const usePertandinganTimer = ({
  pertandinganId,
  autoSync = true,
  onTimeUp,
}: UsePertandinganTimerOptions) => {
  const { activePertandingan, updateActivePertandingan } =
    usePertandinganStore();

  const initialTime = activePertandingan?.sisa_detik ?? 0;

  const [timeLeft, setTimeLeft] = useState(initialTime);

  const [running, setRunning] = useState(
    activePertandingan?.status === "berlangsung",
  );

  const timeRef = useRef(timeLeft);

  useEffect(() => {
    timeRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    if (!activePertandingan) {
      return;
    }

    setTimeLeft(activePertandingan.sisa_detik ?? 0);

    setRunning(activePertandingan.status === "berlangsung");
  }, [
    activePertandingan?.id,
    activePertandingan?.ronde_aktif,
    activePertandingan?.sisa_detik,
    activePertandingan?.status,
  ]);

  useEffect(() => {
    if (!running) {
      return;
    }

    const interval = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(interval);

          setRunning(false);

          onTimeUp?.();

          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [running, onTimeUp]);

  const syncTimer = useCallback(
    async (value?: number) => {
      const seconds = value ?? timeRef.current;

      const result = await updateTimerApi(pertandinganId, {
        sisa_detik: seconds,
      });

      updateActivePertandingan(result);

      return result;
    },
    [pertandinganId, updateActivePertandingan],
  );

  const setTimer = useCallback(
    (seconds: number) => {
      setTimeLeft(seconds);

      updateActivePertandingan({
        sisa_detik: seconds,
      });
    },
    [updateActivePertandingan],
  );

  const startTimer = useCallback(() => {
    setRunning(true);
  }, []);

  const stopTimer = useCallback(() => {
    setRunning(false);
  }, []);

  useEffect(() => {
    if (!autoSync || !running) {
      return;
    }

    const interval = window.setInterval(() => {
      syncTimer().catch(console.error);
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [autoSync, running, syncTimer]);

  const formattedTime = `${String(Math.floor(timeLeft / 60)).padStart(
    2,
    "0",
  )}:${String(timeLeft % 60).padStart(2, "0")}`;

  return {
    timeLeft,
    formattedTime,
    running,
    setTimer,
    startTimer,
    stopTimer,
    syncTimer,
  };
};
